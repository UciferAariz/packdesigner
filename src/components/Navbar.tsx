import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:shadow-elegant transition-all">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PackDesigner
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Products
          </Link>
          <Link to="/editor" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Editor
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Sign In
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:shadow-elegant transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
