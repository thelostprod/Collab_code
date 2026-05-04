import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (preferences) {
      updates.preferences = { ...req.user.preferences, ...preferences };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getProfile()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/users/online
// @desc    Get online users
// @access  Private
router.get('/online', async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnline: true })
      .select('name avatar lastSeen')
      .limit(50);

    res.json({
      success: true,
      data: {
        users: onlineUsers
      }
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      error: 'Server error while fetching online users'
    });
  }
});

// @route   POST /api/users/update-status
// @desc    Update user online status
// @access  Private
router.post('/update-status', async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: isOnline,
      lastSeen: new Date()
    });

    res.json({
      success: true,
      message: 'Status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      error: 'Server error while updating status'
    });
  }
});

export default router; 