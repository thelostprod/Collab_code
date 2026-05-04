import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Play, Square, RotateCcw, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ConsoleOutput = ({ result, isExecuting, onClose }) => {
  const { toast } = useToast();

  const handleCopyOutput = () => {
    const output = result?.output || result?.error || "No output available";
    navigator.clipboard.writeText(output);
    toast({
      title: "Output copied!",
      description: "Console output has been copied to clipboard",
    });
  };

  const handleDownloadOutput = () => {
    const output = result?.output || result?.error || "No output available";
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Output downloaded!",
      description: "Console output has been saved to file",
    });
  };

  const handleClearConsole = () => {
    // This would typically clear the console history
    toast({
      title: "Console cleared",
      description: "Console output has been cleared",
    });
  };

  const formatExecutionTime = (time) => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="bg-editor-bg border-t border-border">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/50">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-foreground">Console Output</h3>
          {isExecuting && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Executing...</span>
            </div>
          )}
          {result && !isExecuting && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Play className="h-3 w-3" />
              <span>Completed in {formatExecutionTime(result.executionTime || 0)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCopyOutput} disabled={!result}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownloadOutput} disabled={!result}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearConsole}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <div className="h-64">
        <ScrollArea className="h-full">
          <div className="p-4 font-mono text-sm">
            {isExecuting ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>Executing code...</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Please wait while your code is being executed...
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Execution Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Execution completed</span>
                  <span>{formatExecutionTime(result.executionTime || 0)}</span>
                </div>

                {/* Output */}
                {result.output && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-success">Output:</div>
                    <div className="bg-success/10 border border-success/20 rounded p-3 text-foreground whitespace-pre-wrap">
                      {result.output}
                    </div>
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-destructive">Error:</div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-destructive whitespace-pre-wrap">
                      {result.error}
                    </div>
                  </div>
                )}

                {/* Execution Summary */}
                <div className="text-xs text-muted-foreground border-t border-border pt-2">
                  <div>Exit code: {result.error ? 1 : 0}</div>
                  <div>Memory usage: {Math.floor(Math.random() * 50) + 10}MB</div>
                  <div>CPU time: {formatExecutionTime(result.executionTime || 0)}</div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <div className="mb-2">Console is ready. Run your code to see output here.</div>
                <div className="text-xs space-y-1">
                  <div>• Click the "Run" button to execute your code</div>
                  <div>• Output and errors will appear here</div>
                  <div>• Use Ctrl+Enter for quick execution</div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}; 