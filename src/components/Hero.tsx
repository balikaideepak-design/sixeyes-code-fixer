import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Eye } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo/Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-secondary border border-border">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Code Analysis & Optimization</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="gradient-text">SIX EYES</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Multi-perspective code repair and optimization powered by advanced analysis
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="text-lg glow group">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="secondary" className="text-lg">
            <Code2 className="mr-2 w-5 h-5" />
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-4xl font-bold text-primary mb-2">6x</div>
            <div className="text-muted-foreground">Analysis Perspectives</div>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-4xl font-bold text-success mb-2">95%</div>
            <div className="text-muted-foreground">Issue Detection Rate</div>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-4xl font-bold text-warning mb-2">3x</div>
            <div className="text-muted-foreground">Faster Optimization</div>
          </div>
        </div>
      </div>
    </section>
  );
};
