import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Zap, Shield, Globe, ArrowRight, Play, Star } from "lucide-react";
import { DemoModal } from "@/components/DemoModal.jsx";

export const HomePage = ({ onNavigateToAuth }) => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Real-time Collaboration",
      description: "Code together with multiple users in real-time. See live changes, cursor positions, and instant feedback."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Coding",
      description: "Build projects with your team. Share code, debug together, and learn from each other."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Execution",
      description: "Run code directly in the browser. Support for JavaScript, Python, C++, Java, and more."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your code is secure with encrypted connections and private room options."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-language Support",
      description: "Support for all major programming languages with syntax highlighting and auto-completion."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Modern Interface",
      description: "Beautiful dark and light themes optimized for coding with a clean, distraction-free interface."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "👩‍💻",
      text: "CollabCode has transformed how our team works. Real-time collaboration makes pair programming effortless."
    },
    {
      name: "Vibhav Singh",
      role: "Tech Lead",
      avatar: "👨‍💻",
      text: "The best collaborative coding platform I've used. Clean interface and powerful features."
    },
    {
      name: "Adarsh Chaudhary",
      role: "Software Engineer",
      avatar: "👩‍💻",
      text: "Perfect for remote teams. We use it daily for code reviews and pair programming sessions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CollabCode
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigateToAuth()}>
              Sign In
            </Button>
            <Button onClick={() => onNavigateToAuth()}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Collaborative
            </span>{" "}
            <span className="text-foreground">Coding</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate platform for real-time collaborative coding. Code together, 
            learn together, build amazing things together with your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => onNavigateToAuth()} className="group">
              Start Coding Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="group" onClick={() => setShowDemo(true)}>
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for collaborative coding
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make team coding seamless and productive
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-primary transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow-primary transition-all duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by developers worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our users have to say about CollabCode
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start coding together?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using CollabCode to build amazing things together.
          </p>
          <Button size="lg" onClick={() => onNavigateToAuth()} className="group">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">CollabCode</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 CollabCode. Built with ❤️ for developers by Adarsh.
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}; 