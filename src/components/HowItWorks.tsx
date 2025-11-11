import { Upload, Eye, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Code",
    description: "Paste your code or upload files directly into SIX EYES",
  },
  {
    icon: Eye,
    title: "Multi-Angle Analysis",
    description: "Six specialized analyzers scan your code simultaneously",
  },
  {
    icon: Sparkles,
    title: "Smart Optimization",
    description: "AI-powered engine repairs bugs and optimizes performance",
  },
  {
    icon: Download,
    title: "Get Clean Code",
    description: "Download improved code with detailed change explanations",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your code from good to exceptional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                )}
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary mb-6 glow">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-primary mb-2">
                    STEP {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
