import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, CheckCircle2, Copy, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const codeExamples = {
  javascript: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  html: `<div class="container">
  <div class="header">
    <h1>Title</h1>
  </div>
  <div class="content">
    <p>Text here</p>
  </div>
  <div class="footer">
    <p>Footer</p>
  </div>
</div>`,
  css: `.button {
  background-color: blue;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
}`,
  python: `def find_max(numbers):
    max_num = numbers[0]
    for i in range(len(numbers)):
        if numbers[i] > max_num:
            max_num = numbers[i]
    return max_num`
};

type Language = keyof typeof codeExamples;

export const CodeDemo = () => {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(codeExamples.javascript);
  const [optimizedCode, setOptimizedCode] = useState("");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [showOptimized, setShowOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(codeExamples[newLang]);
    setShowOptimized(false);
    setOptimizedCode("");
    setImprovements([]);
  };

  const handleOptimize = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to optimize");
      return;
    }

    setIsOptimizing(true);
    setShowOptimized(false);

    try {
      const { data, error } = await supabase.functions.invoke('optimize-code', {
        body: { code, language }
      });

      if (error) {
        console.error('Function error:', error);
        toast.error(error.message || "Failed to optimize code");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setOptimizedCode(data.optimizedCode);
      setImprovements(data.improvements || []);
      setShowOptimized(true);
      toast.success("Code optimized successfully!");
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error("Failed to optimize code");
    } finally {
      setIsOptimizing(false);
    }
  };

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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Original Code</h3>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Select a language and edit the code
              </div>
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
                  onClick={handleOptimize}
                  className="glow"
                  disabled={isOptimizing || !code}
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Analyze & Optimize
                    </>
                  )}
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
              {showOptimized && optimizedCode ? (
                <pre className="code-font text-sm text-foreground whitespace-pre-wrap">
                  {optimizedCode}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {isOptimizing ? "Optimizing your code..." : "Click \"Analyze & Optimize\" to see results"}
                </div>
              )}
            </div>
          </div>
        </div>

        {showOptimized && improvements.length > 0 && (
          <div className="mt-6 p-6 rounded-xl bg-card border border-primary/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Improvements Applied
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              {improvements.map((improvement, index) => (
                <li key={index}>✓ {improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
