import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle as FabricCircle, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface Canvas2DProps {
  actionsRef?: React.MutableRefObject<any>;
}

export const Canvas2D: React.FC<Canvas2DProps> = ({ actionsRef } = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState("#9333ea");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const c = new Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });
    setFabricCanvas(c);

    // Add default grid or helper
    c.setWidth(800);
    c.setHeight(600);

    // expose actions
    if (actionsRef) {
      actionsRef.current = {
        addRect: () => addRectangle(),
        addCircle: () => addCircle(),
        addText: () => addText(),
        clear: () => clearCanvas(),
        export: () => exportCanvas(),
      };
    }

    return () => {
      c.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRectangle = () => {
    if (!fabricCanvas) return;
    const rect = new Rect({
      left: 50,
      top: 50,
      width: 140,
      height: 100,
      fill: selectedColor,
      stroke: "#333",
      strokeWidth: 1,
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.requestRenderAll();
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      radius: 50,
      fill: selectedColor,
      stroke: "#333",
      strokeWidth: 1,
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.requestRenderAll();
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const t = new IText("Text", {
      left: 120,
      top: 120,
      fontSize: 24,
      fill: selectedColor,
    });
    fabricCanvas.add(t);
    fabricCanvas.setActiveObject(t);
    fabricCanvas.requestRenderAll();
    t.enterEditing();
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.requestRenderAll();
    toast.success("Canvas cleared");
  };

  const exportCanvas = () => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = dataUrl;
    link.click();
    toast.success("Canvas exported");
  };

  const handleColorChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(ev.target.value);
    const active = fabricCanvas?.getActiveObject();
    if (active && (active as any).set) {
      // try to set fill for active object
      (active as any).set("fill", ev.target.value);
      fabricCanvas?.requestRenderAll();
    }
  };

  const handleZoom = (value: number) => {
    setZoom(value);
    if (!fabricCanvas) return;
    fabricCanvas.setZoom(value);
    fabricCanvas.requestRenderAll();
  };

  return (
    <div className="w-80 border-r border-border bg-card p-4 flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button onClick={addText} variant="outline" size="sm">
            Add Text
          </Button>
          <Button onClick={addRectangle} variant="outline" size="sm">
            Box
          </Button>
          <Button onClick={addCircle} variant="outline" size="sm">
            Circle
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="w-10 h-8 p-0 border rounded"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange({ ...e } as any)}
              className="flex-1 input"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Zoom</label>
          <Slider
            value={[zoom]}
            min={0.25}
            max={2}
            step={0.05}
            onValueChange={(v) => handleZoom(v[0])}
          />
        </div>

        <div className="pt-4 border-t border-border">
          <Button onClick={clearCanvas} variant="outline" className="w-full">
            Clear Canvas
          </Button>
          <Button onClick={exportCanvas} className="w-full mt-2">
            Export PNG
          </Button>
        </div>
      </div>

      <div className="flex-1 mt-2">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
