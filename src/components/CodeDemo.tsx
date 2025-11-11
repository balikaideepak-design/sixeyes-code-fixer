import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlayCircle, CheckCircle2, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const CodeDemo = () => {
  const [code, setCode] = useState(`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`);

  const optimizedCode = `const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};`;

  const [showOptimized, setShowOptimized] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const clearCode = () => {
    setCode("");
    toast.success("Original code cleared!");
  };

  return (
    <section id="demo" className="py-24 px-6 bg-secondary/30 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground">
            Watch SIX EYES transform your code instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Original Code</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(code, "Original code")}
                  disabled={!code}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={clearCode}
                  disabled={!code}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowOptimized(!showOptimized)}
                  className="glow"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Analyze & Optimize
                </Button>
              </div>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[300px] code-font text-sm bg-background border-border resize-none"
              placeholder="Paste your code here..."
            />
          </div>

          {/* Output Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Optimized Code</h3>
              <div className="flex items-center gap-2">
                {showOptimized && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(optimizedCode, "Optimized code")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Optimized</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="min-h-[300px] p-4 rounded-lg bg-background border border-border">
              {showOptimized ? (
                <pre className="code-font text-sm text-foreground whitespace-pre-wrap">
                  {optimizedCode}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Click "Analyze & Optimize" to see results
                </div>
              )}
            </div>
          </div>
        </div>

        {showOptimized && (
          <div className="mt-6 p-6 rounded-xl bg-card border border-primary/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Improvements Applied
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Replaced var with const for better scoping</li>
              <li>✓ Converted to arrow function for cleaner syntax</li>
              <li>✓ Used Array.reduce() for more functional approach</li>
              <li>✓ Reduced code complexity by 40%</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
