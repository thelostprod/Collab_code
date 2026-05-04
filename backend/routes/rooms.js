import express from 'express';
import Room from '../models/Room.js';
import { isRoomOwner, isRoomParticipant } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, language, isPublic, settings } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Room name is required'
      });
    }

    const room = new Room({
      name,
      description: description || '',
      language: language || 'javascript',
      isPublic: isPublic !== undefined ? isPublic : true,
      owner: req.user._id,
      settings: settings || {},
      participants: [{
        user: req.user._id,
        joinedAt: new Date(),
        isActive: true,
        lastActivity: new Date()
      }]
    });

    await room.save();

    // Update user stats
    await req.user.updateOne({
      $inc: { 'stats.sessionsCreated': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: {
        room: room.getRoomInfo()
      }
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      error: 'Server error while creating room'
    });
  }
});

// @route   GET /api/rooms
// @desc    Get all public rooms or user's rooms
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { type = 'public', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (type === 'my') {
      query.$or = [
        { owner: req.user._id },
        { 'participants.user': req.user._id }
      ];
    } else if (type === 'public') {
      query.isPublic = true;
    }

    const rooms = await Room.find(query)
      .populate('owner', 'name avatar')
      .populate('participants.user', 'name avatar')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(query);

    res.json({
      success: true,
      data: {
        rooms: rooms.map(room => room.getRoomInfo()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      error: 'Server error while fetching rooms'
    });
  }
});

// @route   GET /api/rooms/:roomId
// @desc    Get room by ID
// @access  Private
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('owner', 'name avatar')
      .populate('participants.user', 'name avatar');

    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      });
    }

    // Check if user can access the room
    const canAccess = room.isPublic || 
                     room.owner._id.toString() === req.user._id.toString() ||
                     room.participants.some(p => p.user._id.toString() === req.user._id.toString());

    if (!canAccess) {
      return res.status(403).json({
        error: 'Access denied to this room'
      });
    }

    res.json({
      success: true,
      data: {
        room: room.getRoomInfo()
      }
    });

  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      error: 'Server error while fetching room'
    });
  }
});

// @route   POST /api/rooms/:roomId/join
// @desc    Join a room
// @access  Private
router.post('/:roomId/join', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      });
    }

    if (!room.isActive) {
      return res.status(400).json({
        error: 'Room is not active'
      });
    }

    if (!room.settings.allowJoin) {
      return res.status(403).json({
        error: 'Room is not accepting new participants'
      });
    }

    const activeParticipants = room.getActiveParticipants();
    if (activeParticipants.length >= room.settings.maxParticipants) {
      return res.status(400).json({
        error: 'Room is full'
      });
    }

    await room.addParticipant(req.user._id);

    res.json({
      success: true,
      message: 'Joined room successfully',
      data: {
        room: room.getRoomInfo()
      }
    });

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      error: 'Server error while joining room'
    });
  }
});

// @route   POST /api/rooms/:roomId/leave
// @desc    Leave a room
// @access  Private
router.post('/:roomId/leave', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      });
    }

    await room.removeParticipant(req.user._id);

    res.json({
      success: true,
      message: 'Left room successfully'
    });

  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      error: 'Server error while leaving room'
    });
  }
});

// @route   PUT /api/rooms/:roomId
// @desc    Update room (owner only)
// @access  Private
router.put('/:roomId', isRoomOwner, async (req, res) => {
  try {
    const { name, description, language, isPublic, settings } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (language) updates.language = language;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (settings) updates.settings = { ...req.room.settings, ...settings };

    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      updates,
      { new: true, runValidators: true }
    ).populate('owner', 'name avatar')
     .populate('participants.user', 'name avatar');

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: {
        room: room.getRoomInfo()
      }
    });

  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      error: 'Server error while updating room'
    });
  }
});

// @route   DELETE /api/rooms/:roomId
// @desc    Delete room (owner only)
// @access  Private
router.delete('/:roomId', isRoomOwner, async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.roomId, { isActive: false });

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      error: 'Server error while deleting room'
    });
  }
});

// @route   POST /api/rooms/:roomId/code
// @desc    Update room code
// @access  Private
router.post('/:roomId/code', isRoomParticipant, async (req, res) => {
  try {
    const { code } = req.body;

    if (code === undefined) {
      return res.status(400).json({
        error: 'Code is required'
      });
    }

    await req.room.updateCode(code);

    res.json({
      success: true,
      message: 'Code updated successfully'
    });

  } catch (error) {
    console.error('Update code error:', error);
    res.status(500).json({
      error: 'Server error while updating code'
    });
  }
});

export default router; 