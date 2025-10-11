import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-packaging.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-card border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Design Your Perfect Packaging</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create Stunning
            <span className="bg-gradient-primary bg-clip-text text-transparent"> 3D Packaging </span>
            Designs
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Design, visualize, and customize product packaging in both 2D and 3D. 
            Professional mockups made simple with our intuitive browser-based editor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-elegant transition-all group"
              onClick={() => navigate('/products')}
            >
              Start Designing
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/editor')}
            >
              Try Demo Editor
            </Button>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 animate-float" />
            <img 
              src={heroImage} 
              alt="Packaging design showcase" 
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
