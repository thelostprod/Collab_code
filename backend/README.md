# CollabCode Backend API

A Node.js/Express backend for the CollabCode collaborative coding platform with real-time features powered by Socket.io and MongoDB.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Real-time Collaboration**: Socket.io for live code editing and chat
- **Room Management**: Create, join, and manage coding sessions
- **Chat System**: Real-time messaging with reactions and mentions
- **User Management**: User profiles, statistics, and preferences
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, input validation, and error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.io
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `config.env` and update the values:
   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/collabcode
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if using local MongoDB):
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the server**:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| POST | `/api/auth/change-password` | Change password | Private |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update user profile | Private |
| GET | `/api/users/stats` | Get user statistics | Private |
| GET | `/api/users/online` | Get online users | Private |
| POST | `/api/users/update-status` | Update online status | Private |

### Rooms

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/rooms` | Create new room | Private |
| GET | `/api/rooms` | Get rooms (public/my) | Private |
| GET | `/api/rooms/:roomId` | Get room by ID | Private |
| POST | `/api/rooms/:roomId/join` | Join room | Private |
| POST | `/api/rooms/:roomId/leave` | Leave room | Private |
| PUT | `/api/rooms/:roomId` | Update room (owner) | Private |
| DELETE | `/api/rooms/:roomId` | Delete room (owner) | Private |
| POST | `/api/rooms/:roomId/code` | Update room code | Private |

### Messages

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/messages/:roomId` | Get room messages | Private |
| POST | `/api/messages/:roomId` | Send message | Private |
| PUT | `/api/messages/:messageId` | Edit message | Private |
| DELETE | `/api/messages/:messageId` | Delete message | Private |
| POST | `/api/messages/:messageId/reactions` | Add reaction | Private |
| DELETE | `/api/messages/:messageId/reactions` | Remove reaction | Private |

## 🔌 Socket.io Events

### Client to Server

- `join-room`: Join a coding room
- `code-change`: Broadcast code changes
- `send-message`: Send chat message
- `cursor-move`: Update cursor position

### Server to Client

- `user-joined`: User joined the room
- `code-updated`: Code was updated by another user
- `new-message`: New chat message received
- `cursor-updated`: Cursor position updated by another user

## 📊 Database Models

### User
- Basic info (name, email, password)
- Profile data (avatar, role, preferences)
- Statistics (sessions created, coding time, collaborators)
- Online status and last seen

### Room
- Room details (name, description, language)
- Participants and ownership
- Settings (max participants, auto-save, permissions)
- Statistics (total participants, messages, code changes)

### Message
- Message content and metadata
- Sender and room reference
- Message type (text, system, code, file)
- Reactions and mentions
- Edit/delete tracking

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse on auth endpoints
- **Input Validation**: Request data validation
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Comprehensive error responses

## 🚀 Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabcode
JWT_SECRET=your-very-secure-jwt-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 (Recommended)

```bash
npm install -g pm2
pm2 start server.js --name collabcode-backend
pm2 save
pm2 startup
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 Development

### Project Structure

```
backend/
├── models/          # Database models
│   ├── User.js
│   ├── Room.js
│   └── Message.js
├── routes/          # API routes
│   ├── auth.js
│   ├── users.js
│   ├── rooms.js
│   └── messages.js
├── middleware/      # Custom middleware
│   └── auth.js
├── server.js        # Main server file
├── config.env       # Environment variables
├── package.json
└── README.md
```

### Adding New Features

1. Create model in `models/` directory
2. Add routes in `routes/` directory
3. Update middleware if needed
4. Test with Postman or curl
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API documentation above
- Review the error logs
- Test with the provided examples
- Ensure MongoDB is running and accessible 