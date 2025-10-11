import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import productBottle from "@/assets/product-bottle.jpg";
import productBox from "@/assets/product-box.jpg";
import productPouch from "@/assets/product-pouch.jpg";
import productTube from "@/assets/product-tube.jpg";

const products = [
  {
    id: 1,
    name: "Cosmetic Bottle",
    category: "Bottles",
    image: productBottle,
    description: "Perfect for beauty and skincare products"
  },
  {
    id: 2,
    name: "Shipping Box",
    category: "Boxes",
    image: productBox,
    description: "Versatile packaging for e-commerce"
  },
  {
    id: 3,
    name: "Food Pouch",
    category: "Pouches",
    image: productPouch,
    description: "Ideal for snacks and beverages"
  },
  {
    id: 4,
    name: "Tube Packaging",
    category: "Tubes",
    image: productTube,
    description: "Premium packaging for cosmetics"
  }
];

export const ProductGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Popular Templates
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our professionally designed packaging templates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden bg-secondary/50">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-xs font-medium text-primary mb-2">
                  {product.category}
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-elegant transition-all"
                  onClick={() => navigate('/editor')}
                >
                  Customize
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/products')}
          >
            View All Templates
          </Button>
        </div>
      </div>
    </section>
  );
};
