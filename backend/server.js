import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roomRoutes from './routes/rooms.js';
import messageRoutes from './routes/messages.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CollabCode API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      timestamp: new Date()
    });
  });

  // Handle code changes
  socket.on('code-change', (data) => {
    socket.to(data.roomId).emit('code-updated', {
      code: data.code,
      userId: socket.id,
      timestamp: new Date()
    });
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('new-message', {
      message: data.message,
      userId: data.userId,
      userName: data.userName,
      timestamp: new Date()
    });
  });

  // Handle cursor position
  socket.on('cursor-move', (data) => {
    socket.to(data.roomId).emit('cursor-updated', {
      userId: socket.id,
      position: data.position,
      timestamp: new Date()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
}); 