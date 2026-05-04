import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ChatPanel = ({ currentUser, roomId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      userId: "system",
      userName: "System",
      message: `Welcome to room ${roomId}! Start collaborating and coding together.`,
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    },
    {
      id: "msg-1",
      userId: "user-456",
      userName: "Alice",
      message: "Hey everyone! Ready to work on this project?",
      timestamp: new Date(Date.now() - 240000),
      type: 'message'
    },
    {
      id: "msg-2",
      userId: "user-789",
      userName: "Bob",
      message: "Absolutely! I've been looking at the requirements. Should we start with the component structure?",
      timestamp: new Date(Date.now() - 180000),
      type: 'message'
    },
    {
      id: "msg-3",
      userId: "user-456",
      userName: "Alice",
      message: "Good idea! I think we should create a modular approach. What do you think about using TypeScript?",
      timestamp: new Date(Date.now() - 120000),
      type: 'message'
    }
  ]);

  const [users] = useState([
    { id: currentUser.id, name: currentUser.name, isOnline: true },
    { id: "user-456", name: "Alice", isOnline: true },
    { id: "user-789", name: "Bob", isOnline: true },
    { id: "user-101", name: "Charlie", isOnline: false },
  ]);

  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate receiving messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance every 3 seconds
        const sampleMessages = [
          "Looking good so far!",
          "I made some changes to the function on line 23",
          "Can you check the console? I'm getting an error",
          "Nice work on that component!",
          "Should we add error handling here?",
          "The design is coming together nicely",
        ];
        
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const randomUser = users.filter(u => u.id !== currentUser.id && u.isOnline)[Math.floor(Math.random() * 2)];
        
        if (randomUser) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            userId: randomUser.id,
            userName: randomUser.name,
            message: randomMessage,
            timestamp: new Date(),
            type: 'message'
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [users, currentUser.id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      message: message.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate message broadcast
    console.log("Broadcasting message...", { roomId, message: message.trim() });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-chat-bg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Chat</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {users.filter(u => u.isOnline).length} online
          </span>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.type === 'system' ? 'w-full text-center' : ''}`}>
                {msg.type === 'system' ? (
                  <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                    {msg.message}
                  </div>
                ) : (
                  <div className={`flex ${msg.userId === currentUser.id ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      msg.userId === currentUser.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {getInitials(msg.userName)}
                    </div>
                    <div className={`${msg.userId === currentUser.id ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className={`text-sm rounded-lg px-3 py-2 ${
                        msg.userId === currentUser.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-chat-message text-foreground'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Online Users */}
      <div className="p-4 border-t border-border bg-card/30">
        <h4 className="text-sm font-medium text-foreground mb-2">Online Users</h4>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-success' : 'bg-muted-foreground'}`} />
              <span className="text-sm text-foreground">{user.name}</span>
              {user.id === currentUser.id && (
                <span className="text-xs text-muted-foreground">(you)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-input border-border"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 