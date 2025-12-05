import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CodeDemo } from "@/components/CodeDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CodeDemo />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;