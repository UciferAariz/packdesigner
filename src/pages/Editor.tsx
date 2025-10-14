import { Navbar } from "@/components/Navbar";
import { Canvas2D } from "@/components/editor/Canvas2D";
import { Toolbar } from "@/components/editor/Toolbar";
import { Preview3D } from "@/components/editor/Preview3D";
import { useState, useRef } from "react";

const Editor = () => {
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d');
  const canvasActionsRef = useRef<any>({});

  const handleAddText = () => {
    canvasActionsRef.current.addText?.();
  };

  const handleAddRectangle = () => {
    canvasActionsRef.current.addRectangle?.();
  };

  const handleAddCircle = () => {
    canvasActionsRef.current.addCircle?.();
  };

  const handleClear = () => {
    canvasActionsRef.current.clear?.();
  };

  const handleExport = () => {
    canvasActionsRef.current.export?.();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex overflow-hidden">
        <Toolbar 
          onAddText={handleAddText}
          onAddRectangle={handleAddRectangle}
          onAddCircle={handleAddCircle}
          onClear={handleClear}
          onExport={handleExport}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-4">
            <button
              onClick={() => setActiveTab('2d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === '2d' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary'
              }`}
            >
              2D Editor
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === '3d' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary'
              }`}
            >
              3D Preview
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {activeTab === '2d' ? (
              <Canvas2D actionsRef={canvasActionsRef} />
            ) : (
              <Preview3D />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
