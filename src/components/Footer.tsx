import { Eye, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-16 px-6 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold gradient-text">SIX EYES</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Multi-perspective code repair and optimization platform powered by advanced AI models.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Product</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Company</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Legal</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 SIX EYES. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 hover:-translate-y-1">
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com/balikaideepak-design" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 hover:-translate-y-1"
            >
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 hover:-translate-y-1">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};