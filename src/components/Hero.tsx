import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Eye } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Grid background with animation */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Floating blurs for atmosphere */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo/Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-secondary/50 border border-white/10 backdrop-blur-sm animate-fade-in-up hover:bg-secondary/80 transition-colors duration-300 cursor-default">
          <Eye className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary-foreground/200">AI-Powered Code Analysis</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight animate-fade-in-up delay-100">
          <span className="gradient-text inline-block hover:scale-105 transition-transform duration-500 cursor-default">SIX EYES</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Multi-perspective code repair and optimization. <br className="hidden md:block"/>
          Powered by advanced AI to make your code <span className="text-foreground font-medium">cleaner</span>, <span className="text-foreground font-medium">faster</span>, and <span className="text-foreground font-medium">safer</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in-up delay-300">
          <Button 
            size="lg" 
            className="text-lg h-14 px-8 rounded-full glow group hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Optimizing
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg h-14 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Code2 className="mr-2 w-5 h-5" />
            Live Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up delay-500">
          {[
            { value: "6x", label: "Analysis Angles", color: "text-primary" },
            { value: "99%", label: "Accuracy Rate", color: "text-success" },
            { value: "< 2s", label: "Processing Time", color: "text-warning" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-card/50 border border-white/5 backdrop-blur-sm hover:bg-card hover:border-primary/20 transition-all duration-300 group"
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300 inline-block`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};