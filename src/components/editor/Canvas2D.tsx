import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle as FabricCircle, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Canvas2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState("#9333ea");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Start designing your label");

    return () => {
      canvas.dispose();
    };
  }, []);

  const addText = () => {
    if (!fabricCanvas) return;
    
    const text = new IText("Edit me", {
      left: 100,
      top: 100,
      fill: selectedColor,
      fontSize: 24,
      fontFamily: "Inter",
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    toast.success("Text added");
  };

  const addRectangle = () => {
    if (!fabricCanvas) return;
    
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: selectedColor,
      width: 150,
      height: 100,
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    toast.success("Rectangle added");
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      fill: selectedColor,
      radius: 50,
    });
    
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    toast.success("Circle added");
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared");
  };

  const colors = [
    "#9333ea", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#000000", "#ffffff"
  ];

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex items-center justify-center bg-secondary/30 p-8">
        <div className="bg-white rounded-lg shadow-card">
          <canvas ref={canvasRef} />
        </div>
      </div>

      <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Tools</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Add Elements</label>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={addText} variant="outline" size="sm">
                Text
              </Button>
              <Button onClick={addRectangle} variant="outline" size="sm">
                Box
              </Button>
              <Button onClick={addCircle} variant="outline" size="sm">
                Circle
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-primary scale-110' 
                      : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Opacity</label>
            <Slider defaultValue={[100]} max={100} step={1} />
          </div>

          <div className="pt-4 border-t border-border">
            <Button 
              onClick={clearCanvas} 
              variant="outline" 
              className="w-full"
            >
              Clear Canvas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
