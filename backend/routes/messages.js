import express from 'express';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import { isRoomParticipant } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/:roomId
// @desc    Get messages for a room
// @access  Private
router.get('/:roomId', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Check if user can access the room
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      });
    }

    const canAccess = room.isPublic || 
                     room.owner.toString() === req.user._id.toString() ||
                     room.participants.some(p => p.user.toString() === req.user._id.toString());

    if (!canAccess) {
      return res.status(403).json({
        error: 'Access denied to this room'
      });
    }

    const messages = await Message.find({
      room: req.params.roomId,
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('reactions.user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Message.countDocuments({
      room: req.params.roomId,
      isDeleted: false
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse().map(msg => msg.getMessageInfo()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Server error while fetching messages'
    });
  }
});

// @route   POST /api/messages/:roomId
// @desc    Send a message to a room
// @access  Private
router.post('/:roomId', async (req, res) => {
  try {
    const { content, type = 'message', metadata } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content is required'
      });
    }

    // Check if user is participant in the room
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      });
    }

    const isParticipant = room.participants.some(p => 
      p.user.toString() === req.user._id.toString() && p.isActive
    ) || room.owner.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        error: 'You must be a participant to send messages'
      });
    }

    const message = new Message({
      room: req.params.roomId,
      sender: req.user._id,
      content: content.trim(),
      type,
      metadata: metadata || {}
    });

    await message.save();

    // Update room stats
    await Room.findByIdAndUpdate(req.params.roomId, {
      $inc: { 'stats.totalMessages': 1 },
      lastActivity: new Date()
    });

    // Populate sender info for response
    await message.populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: message.getMessageInfo()
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Server error while sending message'
    });
  }
});

// @route   PUT /api/messages/:messageId
// @desc    Edit a message
// @access  Private
router.put('/:messageId', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content is required'
      });
    }

    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Check if user is the message sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'You can only edit your own messages'
      });
    }

    await message.editMessage(content.trim());
    await message.populate('sender', 'name avatar');

    res.json({
      success: true,
      message: 'Message edited successfully',
      data: {
        message: message.getMessageInfo()
      }
    });

  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      error: 'Server error while editing message'
    });
  }
});

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:messageId', async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Check if user is the message sender or room owner
    const room = await Room.findById(message.room);
    const isOwner = room.owner.toString() === req.user._id.toString();
    const isSender = message.sender.toString() === req.user._id.toString();

    if (!isOwner && !isSender) {
      return res.status(403).json({
        error: 'You can only delete your own messages'
      });
    }

    await message.deleteMessage();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Server error while deleting message'
    });
  }
});

// @route   POST /api/messages/:messageId/reactions
// @desc    Add reaction to a message
// @access  Private
router.post('/:messageId/reactions', async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        error: 'Emoji is required'
      });
    }

    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    await message.addReaction(req.user._id, emoji);
    await message.populate('sender', 'name avatar');
    await message.populate('reactions.user', 'name avatar');

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: {
        message: message.getMessageInfo()
      }
    });

  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      error: 'Server error while adding reaction'
    });
  }
});

// @route   DELETE /api/messages/:messageId/reactions
// @desc    Remove reaction from a message
// @access  Private
router.delete('/:messageId/reactions', async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        error: 'Emoji is required'
      });
    }

    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    await message.removeReaction(req.user._id, emoji);
    await message.populate('sender', 'name avatar');
    await message.populate('reactions.user', 'name avatar');

    res.json({
      success: true,
      message: 'Reaction removed successfully',
      data: {
        message: message.getMessageInfo()
      }
    });

  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      error: 'Server error while removing reaction'
    });
  }
});

export default router; 