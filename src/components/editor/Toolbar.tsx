import { Button } from "@/components/ui/button";
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  MousePointer2,
  Download,
  Upload
} from "lucide-react";

export const Toolbar = () => {
  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-4">
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Select"
      >
        <MousePointer2 className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Add Text"
      >
        <Type className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Add Rectangle"
      >
        <Square className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Add Circle"
      >
        <Circle className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Upload Image"
      >
        <ImageIcon className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Import"
      >
        <Upload className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Export"
      >
        <Download className="w-5 h-5" />
      </Button>
    </div>
  );
};
