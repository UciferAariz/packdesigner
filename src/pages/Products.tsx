import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import productBottle from "@/assets/product-bottle.jpg";
import productBox from "@/assets/product-box.jpg";
import productPouch from "@/assets/product-pouch.jpg";
import productTube from "@/assets/product-tube.jpg";

const allProducts = [
  {
    id: 1,
    name: "Cosmetic Bottle",
    category: "Bottles",
    image: productBottle,
    description: "Perfect for beauty and skincare products",
    dimensions: "50ml - 200ml"
  },
  {
    id: 2,
    name: "Shipping Box",
    category: "Boxes",
    image: productBox,
    description: "Versatile packaging for e-commerce",
    dimensions: "Small to Large"
  },
  {
    id: 3,
    name: "Food Pouch",
    category: "Pouches",
    image: productPouch,
    description: "Ideal for snacks and beverages",
    dimensions: "100g - 1kg"
  },
  {
    id: 4,
    name: "Tube Packaging",
    category: "Tubes",
    image: productTube,
    description: "Premium packaging for cosmetics",
    dimensions: "30ml - 150ml"
  },
  {
    id: 5,
    name: "Glass Bottle",
    category: "Bottles",
    image: productBottle,
    description: "Luxury packaging for beverages",
    dimensions: "250ml - 1L"
  },
  {
    id: 6,
    name: "Display Box",
    category: "Boxes",
    image: productBox,
    description: "Premium retail packaging",
    dimensions: "Custom sizes"
  },
  {
    id: 7,
    name: "Stand-Up Pouch",
    category: "Pouches",
    image: productPouch,
    description: "Modern food packaging solution",
    dimensions: "50g - 2kg"
  },
  {
    id: 8,
    name: "Squeeze Tube",
    category: "Tubes",
    image: productTube,
    description: "Perfect for lotions and creams",
    dimensions: "20ml - 100ml"
  }
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Browse Templates
              </h1>
              <p className="text-xl text-muted-foreground">
                Choose from our collection of professional packaging templates
              </p>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search templates..." 
                  className="pl-10"
                />
              </div>
              <select className="px-4 py-2 rounded-lg border border-input bg-background">
                <option>All Categories</option>
                <option>Bottles</option>
                <option>Boxes</option>
                <option>Pouches</option>
                <option>Tubes</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.map((product) => (
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary">
                        {product.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.dimensions}
                      </span>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
