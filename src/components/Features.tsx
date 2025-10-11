import { Box, Palette, Download, Zap } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "2D Label Editor",
    description: "Create beautiful labels with text, images, and shapes using our intuitive drag-and-drop editor."
  },
  {
    icon: Box,
    title: "3D Preview",
    description: "Visualize your designs on realistic 3D packaging models with real-time rendering."
  },
  {
    icon: Download,
    title: "Export & Order",
    description: "Download high-resolution mockups or place orders for physical packaging production."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Work directly in your browser with instant updates and smooth performance."
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to bring your packaging vision to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-gradient-card border border-border hover:shadow-card transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-elegant transition-all">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
