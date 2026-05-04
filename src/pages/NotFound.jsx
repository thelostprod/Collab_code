import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-x-4">
          <Button onClick={() => navigate("/")} size="lg">
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} size="lg">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 