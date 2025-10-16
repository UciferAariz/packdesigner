import React, { useState } from "react";
import { Upload, Box, Shapes, Palette, Sun, Grid3x3 } from "lucide-react";
import { Canvas2D } from "./Canvas2D";
import Editor3D from "./Editor3D";

type SidebarPanel = "upload" | "scenes" | "models" | "elements" | "background" | "lighting" | null;

export const EditorLayout = () => {
  const [activePanel, setActivePanel] = useState<SidebarPanel>(null);
  const [activeEditor, setActiveEditor] = useState<"2d" | "3d">("3d");

  const sidebarItems = [
    { id: "upload" as const, icon: Upload, label: "Upload" },
    { id: "scenes" as const, icon: Grid3x3, label: "Scenes" },
    { id: "models" as const, icon: Box, label: "Models" },
    { id: "elements" as const, icon: Shapes, label: "Elements" },
    { id: "background" as const, icon: Palette, label: "Background" },
    { id: "lighting" as const, icon: Sun, label: "Lighting" },
  ];

  const togglePanel = (panel: SidebarPanel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a]">
      {/* Top Bar */}
      <div className="h-14 bg-[#2a2a2a] border-b border-[#3a3a3a] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h1 className="text-white text-lg font-semibold">3D Packaging Editor</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveEditor("3d")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeEditor === "3d"
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
            }`}
          >
            3D Editor
          </button>
          <button
            onClick={() => setActiveEditor("2d")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeEditor === "2d"
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
            }`}
          >
            2D Editor
          </button>
          <button className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all">
            Super render
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-20 bg-[#1f1f1f] border-r border-[#3a3a3a] flex flex-col py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id)}
              className={`h-20 flex flex-col items-center justify-center gap-2 transition-colors ${
                activePanel === item.id
                  ? "bg-[#2a2a2a] text-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="w-96 bg-[#2a2a2a] border-r border-[#3a3a3a] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-semibold capitalize">{activePanel}</h2>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {activePanel === "models" && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button className="flex-1 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium">
                      Library
                    </button>
                    <button className="flex-1 py-2 bg-[#3a3a3a] text-gray-400 rounded-lg text-sm font-medium hover:text-white">
                      My
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">Boxes</button>
                      <button className="px-3 py-1 bg-[#3a3a3a] text-gray-400 rounded text-xs hover:text-white">Bottles</button>
                      <button className="px-3 py-1 bg-[#3a3a3a] text-gray-400 rounded text-xs hover:text-white">Food Packaging</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-[#3a3a3a] rounded-lg p-3 hover:bg-[#4a4a4a] cursor-pointer transition-colors">
                        <div className="aspect-square bg-[#2a2a2a] rounded-lg mb-2 flex items-center justify-center">
                          <Box className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-white text-xs">Box Model {i}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "elements" && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">All</button>
                    <button className="px-3 py-1 bg-[#3a3a3a] text-gray-400 rounded text-xs hover:text-white">Shapes</button>
                    <button className="px-3 py-1 bg-[#3a3a3a] text-gray-400 rounded text-xs hover:text-white">Plants</button>
                  </div>

                  <h3 className="text-white text-sm font-medium mb-3">Shapes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["Cube", "Cylinder", "Sphere", "Cone", "Torus", "Pyramid"].map((shape) => (
                      <div key={shape} className="bg-[#3a3a3a] rounded-lg p-3 hover:bg-[#4a4a4a] cursor-pointer transition-colors">
                        <div className="aspect-square bg-[#2a2a2a] rounded-lg mb-2 flex items-center justify-center">
                          <Shapes className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-white text-xs text-center">{shape}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "background" && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button className="flex-1 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium">
                      Color
                    </button>
                    <button className="flex-1 py-2 bg-[#3a3a3a] text-gray-400 rounded-lg text-sm font-medium hover:text-white">
                      Image
                    </button>
                  </div>

                  <div>
                    <h3 className="text-white text-sm font-medium mb-3">Solid</h3>
                    <div className="flex gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-cyan-400" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white text-sm font-medium mb-3">Gradient</h3>
                    <div className="grid grid-cols-9 gap-2">
                      {Array.from({ length: 45 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-full cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            background: `hsl(${i * 8}, 70%, 60%)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "lighting" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">Color</label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded bg-white border-2 border-cyan-400" />
                      <input type="color" defaultValue="#ffffff" className="w-10 h-10 rounded cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 bg-[#3a3a3a] text-white rounded-lg text-sm hover:bg-[#4a4a4a]">
                      Dim
                    </button>
                    <button className="flex-1 py-2 bg-cyan-500 text-white rounded-lg text-sm">
                      Normal
                    </button>
                    <button className="flex-1 py-2 bg-[#3a3a3a] text-white rounded-lg text-sm hover:bg-[#4a4a4a]">
                      Bright
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 relative">
          {activeEditor === "3d" ? <Editor3D /> : <Canvas2D />}
        </div>

        {/* Right Toolbar */}
        <div className="w-20 bg-[#2d2d2d] border-l border-[#3a3a3a] flex flex-col items-center py-6 gap-3">
          <button 
            className="w-12 h-12 rounded-lg bg-[#3a3a3a] text-gray-300 hover:text-white hover:bg-[#4a4a4a] transition-all flex items-center justify-center text-xl"
            title="Undo"
          >
            ↶
          </button>
          <button 
            className="w-12 h-12 rounded-lg bg-[#3a3a3a] text-gray-300 hover:text-white hover:bg-[#4a4a4a] transition-all flex items-center justify-center text-xl"
            title="Redo"
          >
            ↷
          </button>
          <div className="w-10 h-px bg-[#3a3a3a] my-2" />
          <button 
            className="w-12 h-12 rounded-lg bg-[#3a3a3a] text-gray-300 hover:text-white hover:bg-[#4a4a4a] transition-all flex items-center justify-center"
            title="Focus Camera"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <path d="M3 12h3m12 0h3M12 3v3m0 12v3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button 
            className="w-12 h-12 rounded-lg bg-[#3a3a3a] text-gray-300 hover:text-white hover:bg-[#4a4a4a] transition-all flex items-center justify-center"
            title="Frame All"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" strokeWidth="2" rx="2"/>
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
