import React, { useState } from "react";
import { AuthPage } from "@/components/AuthPage.jsx";
import { Dashboard } from "@/components/Dashboard.jsx";
import { RoomEditor } from "@/components/RoomEditor.jsx";
import { HomePage } from "./HomePage.jsx";

const Index = () => {
  const [appState, setAppState] = useState('homepage'); // Start with homepage
  const [user, setUser] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState("");

  const handleNavigateToAuth = () => {
    setAppState('auth');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleJoinRoom = (roomId) => {
    setCurrentRoomId(roomId);
    setAppState('room');
  };

  const handleCreateRoom = () => {
    const newRoomId = `room-${Math.random().toString(36).substr(2, 9)}`;
    setCurrentRoomId(newRoomId);
    setAppState('room');
  };

  const handleLeaveRoom = () => {
    setAppState('dashboard');
    setCurrentRoomId("");
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('homepage'); // Go back to homepage after logout
    setCurrentRoomId("");
  };

  const handleBackToHome = () => {
    setAppState('homepage');
    setUser(null);
    setCurrentRoomId("");
  };

  // Render homepage
  if (appState === 'homepage') {
    return <HomePage onNavigateToAuth={handleNavigateToAuth} />;
  }

  // Render authentication page
  if (appState === 'auth') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onBackToHome={handleBackToHome} />;
  }

  // Render dashboard
  if (appState === 'dashboard' && user) {
    return (
      <Dashboard
        user={user}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        onLogout={handleLogout}
      />
    );
  }

  // Render room editor
  if (appState === 'room' && user && currentRoomId) {
    return (
      <RoomEditor
        user={user}
        roomId={currentRoomId}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return null;
};

export default Index; 