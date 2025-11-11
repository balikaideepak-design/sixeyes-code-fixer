import { Bug, Sparkles, Shield, Gauge, Brain, Layers } from "lucide-react";

const features = [
  {
    icon: Bug,
    title: "Bug Detection",
    description: "Automatically identify and fix bugs, edge cases, and potential runtime errors in your code.",
  },
  {
    icon: Sparkles,
    title: "Code Optimization",
    description: "Improve performance with intelligent suggestions for algorithms, data structures, and patterns.",
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description: "Scan for vulnerabilities, unsafe patterns, and security best practices violations.",
  },
  {
    icon: Gauge,
    title: "Performance Tuning",
    description: "Optimize execution speed, memory usage, and resource consumption automatically.",
  },
  {
    icon: Brain,
    title: "Smart Refactoring",
    description: "Modernize legacy code with intelligent refactoring suggestions and best practices.",
  },
  {
    icon: Layers,
    title: "Multi-Language Support",
    description: "Works with JavaScript, TypeScript, Python, Java, C++, and many more languages.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
