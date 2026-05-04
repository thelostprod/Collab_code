import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }],
  language: {
    type: String,
    enum: ['javascript', 'python', 'cpp', 'java', 'go', 'typescript', 'php', 'ruby', 'rust'],
    default: 'javascript'
  },
  code: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowJoin: {
      type: Boolean,
      default: true
    },
    requirePermission: {
      type: Boolean,
      default: false
    },
    maxParticipants: {
      type: Number,
      default: 10
    },
    autoSave: {
      type: Boolean,
      default: true
    },
    autoSaveInterval: {
      type: Number, // in seconds
      default: 30
    }
  },
  stats: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    totalCodeChanges: {
      type: Number,
      default: 0
    },
    sessionDuration: {
      type: Number, // in minutes
      default: 0
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique room ID
roomSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = `room-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
  }
  next();
});

// Add participant to room
roomSchema.methods.addParticipant = function(userId) {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      joinedAt: new Date(),
      isActive: true,
      lastActivity: new Date()
    });
    this.stats.totalParticipants += 1;
  } else {
    existingParticipant.isActive = true;
    existingParticipant.lastActivity = new Date();
  }
  
  this.lastActivity = new Date();
  return this.save();
};

// Remove participant from room
roomSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.isActive = false;
    participant.lastActivity = new Date();
  }
  this.lastActivity = new Date();
  return this.save();
};

// Update code
roomSchema.methods.updateCode = function(code) {
  this.code = code;
  this.stats.totalCodeChanges += 1;
  this.lastActivity = new Date();
  return this.save();
};

// Get active participants
roomSchema.methods.getActiveParticipants = function() {
  return this.participants.filter(p => p.isActive);
};

// Get room info for API response
roomSchema.methods.getRoomInfo = function() {
  return {
    id: this._id,
    roomId: this.roomId,
    name: this.name,
    description: this.description,
    owner: this.owner,
    language: this.language,
    isPublic: this.isPublic,
    isActive: this.isActive,
    settings: this.settings,
    stats: this.stats,
    lastActivity: this.lastActivity,
    createdAt: this.createdAt,
    participantCount: this.getActiveParticipants().length
  };
};

const Room = mongoose.model('Room', roomSchema);

export default Room; 