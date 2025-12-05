import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlayCircle, CheckCircle2, Copy, Trash2, Loader2, Volume2, StopCircle,
  Download, FileDiff, Code2, Settings, History, Clock, Terminal, Info
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Language = "javascript" | "html" | "css" | "python" | "c" | "java";

const LOADING_STEPS = [
  "Analyzing syntax...",
  "Detecting inefficiencies...",
  "Checking security vulnerabilities...",
  "Refactoring logic...",
  "Applying best practices...",
  "Finalizing optimization..."
];

const FILE_EXTENSIONS: Record<Language, string> = {
  javascript: "js",
  html: "html",
  css: "css",
  python: "py",
  c: "c",
  java: "java"
};

// --- Syntax Highlighting Logic ---
const KEYWORDS = {
  javascript: /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|extends|try|catch|async|await|new|this|typeof)\b/g,
  python: /\b(def|return|if|elif|else|for|while|import|from|as|class|try|except|finally|with|pass|lambda|global|nonlocal|True|False|None)\b/g,
  c: /\b(int|float|double|char|void|bool|if|else|for|while|return|struct|enum|union|switch|case|break|continue|default|signed|unsigned|long|short|const|static|volatile|extern|auto|register|sizeof|typedef)\b/g,
  java: /\b(public|private|protected|class|interface|void|int|double|float|boolean|String|if|else|for|while|return|new|this|super|import|package|try|catch|finally|static|final)\b/g,
  html: /(&lt;\/?[a-z0-9]+|&gt;|\/&gt;)/gi, // Basic HTML tag detection
  css: /\b(color|background|margin|padding|border|font|display|flex|grid|width|height|position|top|left|right|bottom)\b/g
};

const highlightCode = (code: string, lang: Language) => {
  if (!code) return null;

  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  escaped = escaped.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="text-green-400">$1</span>');
  escaped = escaped.replace(/(\/\/.*$|#.*$)/gm, '<span class="text-gray-500 italic">$1</span>');
  escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

  const keywordRegex = KEYWORDS[lang as keyof typeof KEYWORDS];
  if (keywordRegex) {
    escaped = escaped.replace(keywordRegex, '<span class="text-purple-400 font-semibold">$1</span>');
  }

  return <div dangerouslySetInnerHTML={{ __html: escaped }} className="font-mono text-sm leading-6" />;
};

// --- Simple Diff Logic ---
type DiffLine = { type: 'same' | 'add' | 'remove', content: string };

const generateDiff = (original: string, modified: string): DiffLine[] => {
  const oldLines = original.split('\n');
  const newLines = modified.split('\n');
  const diff: DiffLine[] = [];

  let i = 0, j = 0;
  while (i < oldLines.length || j < newLines.length) {
    const oldLine = oldLines[i];
    const newLine = newLines[j];

    if (oldLine === newLine) {
      diff.push({ type: 'same', content: oldLine || "" });
      i++; j++;
    } else {
      if (i < oldLines.length) {
        diff.push({ type: 'remove', content: oldLine });
        i++;
      }
      if (j < newLines.length) {
        diff.push({ type: 'add', content: newLine });
        j++;
      }
    }
  }
  return diff;
};

// --- Types for History and Settings ---
type OptimizationSettings = {
  performance: boolean;
  readability: boolean;
  security: boolean;
  comments: boolean;
};

type HistoryItem = {
  id: string;
  timestamp: number;
  language: Language;
  originalCode: string;
  optimizedCode: string;
  improvements: string[];
};

export const CodeDemo = () => {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [showOptimized, setShowOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [viewMode, setViewMode] = useState<'code' | 'diff'>('code');

  // New State for Settings and History
  const [settings, setSettings] = useState<OptimizationSettings>({
    performance: true,
    readability: true,
    security: true,
    comments: false
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('optimizationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Loading animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOptimizing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isOptimizing]);

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setShowOptimized(false);
    setOptimizedCode("");
    setImprovements([]);
    stopSpeaking();
  };

  const handleSettingChange = (key: keyof OptimizationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveToHistory = (optimized: string, imp: string[]) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      language,
      originalCode: code,
      optimizedCode: optimized,
      improvements: imp
    };

    const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('optimizationHistory', JSON.stringify(newHistory));
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setLanguage(item.language);
    setCode(item.originalCode);
    setOptimizedCode(item.optimizedCode);
    setImprovements(item.improvements);
    setShowOptimized(true);
    toast.success("Restored from history");
  };

  const handleOptimize = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to optimize");
      return;
    }

    setIsOptimizing(true);
    setShowOptimized(false);
    stopSpeaking();

    try {
      const { data, error } = await supabase.functions.invoke('optimize-code', {
        body: { code, language, mode: 'optimize', settings }
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

      // Save to history
      saveToHistory(data.optimizedCode, data.improvements || []);

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

  const handleDownload = () => {
    if (!optimizedCode) return;

    const element = document.createElement("a");
    const file = new Blob([optimizedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `optimized_code.${FILE_EXTENSIONS[language]}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded successfully!");
  };

  const clearCode = () => {
    setCode("");
    stopSpeaking();
    toast.success("Original code cleared!");
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const readImprovements = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (improvements.length === 0) {
      toast.info("No improvements to read.");
      return;
    }

    const textToRead = "Here are the improvements made: " + improvements.join(". ");
    const utterance = new SpeechSynthesisUtterance(textToRead);

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.name.includes("Google US English") ||
      v.name.includes("Samantha") ||
      v.name.includes("Zira") ||
      v.name.toLowerCase().includes("female")
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const diffLines = useMemo(() => {
    if (showOptimized && code && optimizedCode) {
      return generateDiff(code, optimizedCode);
    }
    return [];
  }, [code, optimizedCode, showOptimized]);

  return (
    <section id="demo" className="py-24 px-6 bg-secondary/30 scroll-mt-20 relative overflow-hidden">
      {/* Ambient background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="text-left animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-2">Code Optimization</h2>
            <p className="text-muted-foreground">Refine your code with intelligent analysis.</p>
          </div>

          <div className="flex gap-2 animate-fade-in-up delay-100">
            {/* Optimization Settings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 hover:border-primary/50 transition-all">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Optimization Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize how the AI optimizes your code.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="performance"
                        checked={settings.performance}
                        onCheckedChange={() => handleSettingChange('performance')}
                      />
                      <Label htmlFor="performance">Performance</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="readability"
                        checked={settings.readability}
                        onCheckedChange={() => handleSettingChange('readability')}
                      />
                      <Label htmlFor="readability">Readability</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="security"
                        checked={settings.security}
                        onCheckedChange={() => handleSettingChange('security')}
                      />
                      <Label htmlFor="security">Security</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="comments"
                        checked={settings.comments}
                        onCheckedChange={() => handleSettingChange('comments')}
                      />
                      <Label htmlFor="comments">Add Comments</Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* History Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 hover:border-primary/50 transition-all">
                  <History className="w-4 h-4" />
                  History
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Recent Activity</SheetTitle>
                  <SheetDescription>
                    Your last 10 optimization sessions.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
                  <div className="space-y-4">
                    {history.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No history yet.
                      </div>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => restoreHistoryItem(item)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold capitalize text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {item.language}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="font-mono text-xs text-muted-foreground line-clamp-2 bg-muted p-2 rounded">
                            {item.originalCode}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Code */}
          <div className="space-y-4 animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-2 p-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Original Code
              </h3>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] transition-all hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between bg-card/50 p-2 rounded-lg border border-border/50 backdrop-blur-sm">
              <div className="text-sm text-muted-foreground pl-2">
                Paste your code below
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(code, "Original code")}
                  disabled={!code}
                  className="hover:bg-background transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearCode}
                  disabled={!code}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleOptimize}
                  className="glow hover:scale-105 transition-transform active:scale-95"
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
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="relative h-[400px] code-font text-sm bg-card border-border/50 resize-none font-mono focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-300"
                placeholder="// Paste your code here..."
              />
            </div>
          </div>

          {/* Output Code */}
          <div className="space-y-4 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-2 p-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Optimized Code
                </h3>
                {showOptimized && (
                  <div className="flex bg-muted/50 rounded-md p-1 gap-1">
                    <Button
                      variant={viewMode === 'code' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-6 px-2 text-xs transition-all"
                      onClick={() => setViewMode('code')}
                    >
                      <Code2 className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                    <Button
                      variant={viewMode === 'diff' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-6 px-2 text-xs transition-all"
                      onClick={() => setViewMode('diff')}
                    >
                      <FileDiff className="w-3 h-3 mr-1" />
                      Diff
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {showOptimized && (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 gap-2"
                        >
                          <Info className="w-4 h-4" />
                          How to Run
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-gray-900 border-gray-700 text-gray-300">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Running {language}
                          </h4>
                          <div className="text-sm space-y-2">
                            {language === 'javascript' && (
                              <p>Run in browser console or Node.js:<br /><code className="bg-black/50 px-1 py-0.5 rounded">node filename.js</code></p>
                            )}
                            {language === 'python' && (
                              <p>Run with Python:<br /><code className="bg-black/50 px-1 py-0.5 rounded">python filename.py</code></p>
                            )}
                            {language === 'c' && (
                              <p>Compile and run:<br /><code className="bg-black/50 px-1 py-0.5 rounded">gcc filename.c -o filename && ./filename</code></p>
                            )}
                            {language === 'java' && (
                              <p>Compile and run:<br /><code className="bg-black/50 px-1 py-0.5 rounded">javac Filename.java && java Filename</code></p>
                            )}
                            {(language === 'html' || language === 'css') && (
                              <p>Open the file in any web browser to view the result.</p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-gray-700 mt-2">
                            <h5 className="font-medium text-white text-xs mb-1.5 opacity-80">Recommended Online Platforms</h5>
                            <ul className="text-xs space-y-1 text-gray-400">
                              <li>
                                <a href="https://onecompiler.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">OneComplier (All languages)</a>
                              </li>
                              {(language === 'javascript' || language === 'html' || language === 'css') && (
                                <>
                                  <li><a href="https://codepen.io" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">CodePen</a> (Frontend)</li>
                                  <li><a href="https://stackblitz.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">StackBlitz</a> (Frontend/Node)</li>
                                </>
                              )}
                              {(language === 'c' || language === 'java' || language === 'python') && (
                                <>
                                  <li><a href="https://www.programiz.com/c-programming/online-compiler/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">Programiz</a> (Simple Compiler)</li>
                                  <li><a href="https://www.onlinegdb.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">OnlineGDB</a> (Debugging)</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 rounded-full hover:bg-primary/10 transition-all ${isSpeaking ? "text-primary animate-pulse bg-primary/10" : ""}`}
                      onClick={readImprovements}
                      title={isSpeaking ? "Stop reading" : "Read improvements aloud"}
                    >
                      {isSpeaking ? <StopCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      title="Download optimized code"
                      className="hover:border-primary/50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(optimizedCode, "Optimized code")}
                      className="hover:border-primary/50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="h-[482px] overflow-auto p-4 rounded-lg bg-card border border-border/50 relative shadow-inner">
              {showOptimized && optimizedCode ? (
                <div className="animate-fade-in-up">
                  {viewMode === 'code' ? (
                    // Syntax Highlighted Code
                    <div className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {highlightCode(optimizedCode, language)}
                    </div>
                  ) : (
                    // Diff View
                    <div className="font-mono text-sm w-full leading-relaxed">
                      {diffLines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`flex w-full transition-colors hover:bg-white/5 ${line.type === 'add' ? 'bg-green-500/10 text-green-200 border-l-2 border-green-500 pl-1' :
                            line.type === 'remove' ? 'bg-red-500/10 text-red-200 border-l-2 border-red-500 pl-1 opacity-70' : 'pl-1.5'
                            }`}
                        >
                          <span className="w-6 shrink-0 text-muted-foreground select-none text-xs py-0.5 text-right pr-3 opacity-30 font-normal">
                            {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : idx + 1}
                          </span>
                          <span className="whitespace-pre-wrap break-all py-0.5">{line.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6">
                  {isOptimizing ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
                      </div>
                      <p className="text-sm font-medium animate-pulse text-primary/80">{LOADING_STEPS[loadingStep]}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 opacity-50 hover:opacity-80 transition-opacity duration-300">
                      <Code2 className="w-16 h-16 stroke-1" />
                      <p>Click "Analyze & Optimize" to see results</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visual List of Improvements */}
        {showOptimized && improvements.length > 0 && (
          <div className="mt-8 p-6 rounded-xl bg-card border border-primary/20 animate-fade-in-up delay-300 shadow-lg shadow-primary/5">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-full bg-green-500/10 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              Improvements Applied
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors border border-transparent hover:border-border/50">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};