import { Bug, Sparkles, Shield, Gauge, Brain, Layers } from "lucide-react";

const features = [
  {
    icon: Bug,
    title: "Bug Detection",
    description: "Automatically identify and fix bugs, edge cases, and potential runtime errors in your code.",
    color: "text-red-400",
    bg: "bg-red-400/10"
  },
  {
    icon: Sparkles,
    title: "Code Optimization",
    description: "Improve performance with intelligent suggestions for algorithms, data structures, and patterns.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10"
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description: "Scan for vulnerabilities, unsafe patterns, and security best practices violations.",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    icon: Gauge,
    title: "Performance Tuning",
    description: "Optimize execution speed, memory usage, and resource consumption automatically.",
    color: "text-green-400",
    bg: "bg-green-400/10"
  },
  {
    icon: Brain,
    title: "Smart Refactoring",
    description: "Modernize legacy code with intelligent refactoring suggestions and best practices.",
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    icon: Layers,
    title: "Multi-Language Support",
    description: "Works with JavaScript, TypeScript, Python, Java, C++, and many more languages.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10"
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Six Perspectives, Perfect Code
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced analysis from multiple angles to ensure your code is clean, efficient, and secure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};