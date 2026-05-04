import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Play, Users, Code, Zap } from "lucide-react";

export const DemoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const demoFeatures = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "See multiple cursors, live code changes, and instant feedback"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Multi-language Support",
      description: "JavaScript, Python, C++, Java, Go and more with syntax highlighting"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Execution",
      description: "Run code directly in the browser with real-time output"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">CollabCode Demo</CardTitle>
            <CardDescription>
              See how real-time collaborative coding works
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Video Placeholder */}
          <div className="aspect-video bg-gradient-card border border-border rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interactive Demo</h3>
              <p className="text-muted-foreground">
                Watch how teams collaborate in real-time
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{feature.title}</h5>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button onClick={onClose} className="group">
              Try It Now
              <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 