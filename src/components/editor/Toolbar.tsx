import { Button } from "@/components/ui/button";
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  MousePointer2,
  Download,
  Upload,
  Trash2
} from "lucide-react";

interface ToolbarProps {
  onAddText: () => void;
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onClear: () => void;
  onExport: () => void;
}

export const Toolbar = ({ 
  onAddText, 
  onAddRectangle, 
  onAddCircle, 
  onClear,
  onExport
}: ToolbarProps) => {
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
        onClick={onAddText}
      >
        <Type className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Add Rectangle"
        onClick={onAddRectangle}
      >
        <Square className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Add Circle"
        onClick={onAddCircle}
      >
        <Circle className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Upload Image"
        disabled
      >
        <ImageIcon className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Clear Canvas"
        onClick={onClear}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost"
        className="hover:bg-secondary"
        title="Export"
        onClick={onExport}
      >
        <Download className="w-5 h-5" />
      </Button>
    </div>
  );
};
