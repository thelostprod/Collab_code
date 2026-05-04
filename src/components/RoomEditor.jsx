import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "./CodeEditor.jsx";
import { ChatPanel } from "./ChatPanel.jsx";
import { ConsoleOutput } from "./ConsoleOutput.jsx";
import { Copy, Users, LogOut, Share2, History, Settings } from "lucide-react";

export const RoomEditor = ({ user, roomId, onLeaveRoom }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState();
  const [showConsole, setShowConsole] = useState(true);
  
  const { toast } = useToast();

  // Simulate auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (code.trim()) {
        // Simulate saving to backend
        console.log("Auto-saving code...", { roomId, code: code.substring(0, 50) + "..." });
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [code, roomId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Simulate real-time sync via WebSocket
    console.log("Broadcasting code change...", { roomId, userId: user.id });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    console.log("Broadcasting language change...", { roomId, language: newLanguage });
  };

  const handleExecuteCode = async (codeToExecute, lang) => {
    setIsExecuting(true);
    setExecutionResult(undefined);

    // Simulate code execution
    setTimeout(() => {
      const results = simulateCodeExecution(codeToExecute, lang);
      setExecutionResult(results);
      setIsExecuting(false);
      setShowConsole(true);
    }, 1500 + Math.random() * 1000);
  };

  const simulateCodeExecution = (code, lang) => {
    const executionTime = Math.floor(Math.random() * 300) + 50;
    
    // Simulate different outputs based on language and code content
    if (code.includes("console.log") || code.includes("print") || code.includes("cout")) {
      if (code.includes("Hello")) {
        return {
          output: "Hello, World!",
          executionTime,
        };
      } else if (code.includes("error") || code.includes("Error")) {
        return {
          error: "ReferenceError: 'error' is not defined",
          executionTime,
        };
      } else {
        return {
          output: "Code executed successfully!\nOutput: " + (Math.random() * 100).toFixed(2),
          executionTime,
        };
      }
    } else if (code.trim() === "") {
      return {
        error: "No code to execute",
        executionTime: 10,
      };
    } else {
      return {
        output: `Code executed successfully in ${lang}!`,
        executionTime,
      };
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID copied!",
      description: "Room ID has been copied to clipboard",
    });
  };

  const shareRoom = () => {
    const shareData = {
      title: "Join my coding session",
      text: `Join my collaborative coding session on CollabCode! Room ID: ${roomId}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      copyRoomId();
    }
  };

  return (
    <div className="h-screen bg-gradient-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CollabCode
            </h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Room:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{roomId}</code>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={copyRoomId}>
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
            <Button variant="ghost" size="sm" onClick={shareRoom}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              3 Online
            </Button>
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={onLeaveRoom}>
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <CodeEditor
            initialCode={code}
            language={language}
            onLanguageChange={handleLanguageChange}
            onCodeChange={handleCodeChange}
            isExecuting={isExecuting}
            onExecute={handleExecuteCode}
          />
          
          {/* Console Output */}
          {showConsole && (
            <div className="flex-shrink-0 border-t border-border">
              <ConsoleOutput
                result={executionResult}
                isExecuting={isExecuting}
                onClose={() => setShowConsole(false)}
              />
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="w-80 border-l border-border flex-shrink-0">
          <ChatPanel currentUser={user} roomId={roomId} />
        </div>
      </div>
    </div>
  );
}; 