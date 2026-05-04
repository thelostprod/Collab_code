import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", defaultCode: "// Welcome to CollabCode!\nconsole.log('Hello, World!');\n\n// Start coding collaboratively..." },
  { value: "python", label: "Python", defaultCode: "# Welcome to CollabCode!\nprint('Hello, World!')\n\n# Start coding collaboratively..." },
  { value: "cpp", label: "C++", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}\n\n// Start coding collaboratively..." },
  { value: "java", label: "Java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n        \n        // Start coding collaboratively...\n    }\n}" },
  { value: "go", label: "Go", defaultCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n    \n    // Start coding collaboratively...\n}" },
];

export const CodeEditor = ({ 
  initialCode, 
  language, 
  onLanguageChange, 
  onCodeChange, 
  isExecuting = false,
  onExecute 
}) => {
  const [code, setCode] = useState(initialCode || LANGUAGES.find(l => l.value === language)?.defaultCode || "");
  const [lineNumbers, setLineNumbers] = useState([]);
  const textareaRef = useRef(null);
  const { toast } = useToast();

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  // Simulate cursor positions for collaborative editing
  const [cursors] = useState([
    { id: "user2", name: "Alice", position: { line: 3, column: 15 }, color: "#ff6b6b" },
    { id: "user3", name: "Bob", position: { line: 7, column: 8 }, color: "#4ecdc4" },
  ]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleLanguageChange = (newLanguage) => {
    const langData = LANGUAGES.find(l => l.value === newLanguage);
    if (langData) {
      setCode(langData.defaultCode);
      onCodeChange(langData.defaultCode);
      onLanguageChange(newLanguage);
      toast({
        title: "Language changed",
        description: `Switched to ${langData.label}`,
      });
    }
  };

  const handleExecute = () => {
    onExecute(code, language);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "Code has been copied to clipboard",
    });
  };

  const handleReset = () => {
    const langData = LANGUAGES.find(l => l.value === language);
    if (langData) {
      setCode(langData.defaultCode);
      onCodeChange(langData.defaultCode);
      toast({
        title: "Code reset",
        description: "Editor has been reset to default template",
      });
    }
  };

  // Handle tab key for proper indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onCodeChange(newCode);
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              onClick={handleExecute}
              disabled={isExecuting}
              className="bg-primary hover:bg-primary/90"
            >
              {isExecuting ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Collaborative cursors indicator */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex -space-x-1">
            {cursors.map((cursor) => (
              <div
                key={cursor.id}
                className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: cursor.color }}
                title={`${cursor.name} - Line ${cursor.position.line}`}
              >
                {cursor.name.charAt(0)}
              </div>
            ))}
          </div>
          <span>{cursors.length} collaborators</span>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="w-16 bg-editor-line border-r border-border flex-shrink-0 overflow-hidden">
          <div className="p-4 font-mono text-xs text-muted-foreground select-none">
            {lineNumbers.map((num) => (
              <div key={num} className="text-right leading-6">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Code Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent text-foreground font-mono text-sm leading-6 p-4 resize-none outline-none border-none"
            placeholder="Start coding..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          
          {/* Collaborative cursors overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {cursors.map((cursor) => (
              <div
                key={cursor.id}
                className="absolute w-0.5 h-6 animate-pulse"
                style={{
                  backgroundColor: cursor.color,
                  left: `${(cursor.position.column * 8) + 16}px`,
                  top: `${(cursor.position.line - 1) * 24}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 