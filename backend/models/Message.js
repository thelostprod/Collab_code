import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['message', 'system', 'code', 'file'],
    default: 'message'
  },
  metadata: {
    // For code messages
    language: String,
    lineNumber: Number,
    
    // For file messages
    fileName: String,
    fileSize: Number,
    fileType: String,
    
    // For system messages
    action: String, // 'user-joined', 'user-left', 'room-created', etc.
    
    // For code execution
    executionResult: {
      output: String,
      error: String,
      executionTime: Number
    }
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// Get message for API response
messageSchema.methods.getMessageInfo = function() {
  return {
    id: this._id,
    room: this.room,
    sender: this.sender,
    content: this.content,
    type: this.type,
    metadata: this.metadata,
    isEdited: this.isEdited,
    editedAt: this.editedAt,
    isDeleted: this.isDeleted,
    reactions: this.reactions,
    mentions: this.mentions,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(r => 
    r.user.toString() === userId.toString() && r.emoji === emoji
  );
  
  if (!existingReaction) {
    this.reactions.push({
      user: userId,
      emoji: emoji,
      createdAt: new Date()
    });
  }
  
  return this.save();
};

// Remove reaction
messageSchema.methods.removeReaction = function(userId, emoji) {
  this.reactions = this.reactions.filter(r => 
    !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  return this.save();
};

// Edit message
messageSchema.methods.editMessage = function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Soft delete message
messageSchema.methods.deleteMessage = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

const Message = mongoose.model('Message', messageSchema);

export default Message; 