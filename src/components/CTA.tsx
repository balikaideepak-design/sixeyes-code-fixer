import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 glow">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-background/80 backdrop-blur">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Start Optimizing Today</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Code?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust SIX EYES to keep their code clean, efficient, and secure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg glow group">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" className="text-lg">
              Schedule Demo
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
