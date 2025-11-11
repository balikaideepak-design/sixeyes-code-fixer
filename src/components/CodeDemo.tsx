import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, CheckCircle2, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

const codeExamples = {
  javascript: {
    original: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
    optimized: `const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};`
  },
  html: {
    original: `<div class="container">
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
    optimized: `<div class="container">
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <p>Text here</p>
  </main>
  <footer>
    <p>Footer</p>
  </footer>
</div>`
  },
  css: {
    original: `.button {
  background-color: blue;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
}`,
    optimized: `.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}`
  },
  python: {
    original: `def find_max(numbers):
    max_num = numbers[0]
    for i in range(len(numbers)):
        if numbers[i] > max_num:
            max_num = numbers[i]
    return max_num`,
    optimized: `def find_max(numbers):
    return max(numbers)`
  }
};

export const CodeDemo = () => {
  const [language, setLanguage] = useState<keyof typeof codeExamples>("javascript");
  const [code, setCode] = useState(codeExamples.javascript.original);
  const [showOptimized, setShowOptimized] = useState(false);

  const handleLanguageChange = (newLang: keyof typeof codeExamples) => {
    setLanguage(newLang);
    setCode(codeExamples[newLang].original);
    setShowOptimized(false);
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
                      onClick={() => copyToClipboard(codeExamples[language].optimized, "Optimized code")}
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
                  {codeExamples[language].optimized}
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
