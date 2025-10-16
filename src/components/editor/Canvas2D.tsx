// src/components/editor/Canvas2D.tsx
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { SharedSidebar } from "./SharedSidebar";

interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objRef: fabric.Object;
}

interface Canvas2DProps {
  actionsRef?: React.MutableRefObject<any>;
}

export const Canvas2D: React.FC<Canvas2DProps> = ({ actionsRef } = {}) => {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const c = new fabric.Canvas(canvasElRef.current!, {
      backgroundColor: "#fff",
      preserveObjectStacking: true,
      width: 1000,
      height: 700,
    });
    fabricRef.current = c;

    // selection change -> update selectedId
    c.on("selection:created", updateLayerSelection);
    c.on("selection:updated", updateLayerSelection);
    c.on("selection:cleared", () => setSelectedId(null));
    c.on("object:added", handleObjectAdded);
    c.on("object:removed", handleObjectRemoved);

    // expose actions
    if (actionsRef) {
      actionsRef.current = {
        addRect: addRect,
        addCircle: addCircle,
        addText: addText,
        clear: clearCanvas,
        export: exportCanvas,
        bringForward: bringForward,
        sendBackward: sendBackward,
        bringToFront: bringToFront,
        sendToBack: sendToBack,
      };
    }

    return () => {
      c.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // layer helpers
  function syncLayers() {
    const c = fabricRef.current!;
    const objs = c.getObjects();
    // Fabric object's stacking order: bottom (index 0) -> top (last)
    const list = objs
      .slice()
      .reverse() // reverse so top-most appears first in UI
      .map((o) => ({
        id: (o as any).uid || (o as any).__uid || (o as any).toObject().id || String((o as any).__uuid || Math.random()),
        name: (o as any).name || ((o as any).type ? (o as any).type : "Object"),
        visible: !(o as any).visible === false ? true : (o as any).visible !== false,
        locked: !!(o as any).selectable === false,
        objRef: o,
      }));
    // ensure each object has a stable id
    list.forEach((li) => {
      if (!(li.objRef as any).uid) (li.objRef as any).uid = li.id;
    });

    setLayers(list);
  }

  function handleObjectAdded(e: any) {
    const o = e.target as fabric.Object;
    // ensure stable id
    if (!(o as any).uid) (o as any).uid = `o_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    // name default
    if (!(o as any).name) (o as any).name = o.type || "object";
    syncLayers();
  }

  function handleObjectRemoved() {
    syncLayers();
  }

  function updateLayerSelection(e: any) {
    const active = fabricRef.current!.getActiveObject();
    if (!active) {
      setSelectedId(null);
      return;
    }
    setSelectedId((active as any).uid || null);
  }

  // create primitives
  const addRect = () => {
    const c = fabricRef.current!;
    const rect = new fabric.Rect({
      left: 60,
      top: 60,
      width: 180,
      height: 110,
      fill: "#F97316",
      stroke: "#333",
      strokeWidth: 1,
    });
    rect.set("name", "Rectangle");
    c.add(rect);
    c.setActiveObject(rect);
    c.requestRenderAll();
  };

  const addCircle = () => {
    const c = fabricRef.current!;
    const circle = new fabric.Circle({
      left: 160,
      top: 160,
      radius: 60,
      fill: "#10B981",
    });
    circle.set("name", "Circle");
    c.add(circle);
    c.setActiveObject(circle);
    c.requestRenderAll();
  };

  const addText = () => {
    const c = fabricRef.current!;
    const it = new fabric.IText("Text", {
      left: 240,
      top: 240,
      fontSize: 28,
      fill: "#111827",
    });
    it.set("name", "Text");
    c.add(it);
    c.setActiveObject(it);
    c.requestRenderAll();
    it.enterEditing();
  };

  // layer operations
  function selectLayerItem(item: LayerItem) {
    fabricRef.current!.setActiveObject(item.objRef);
    fabricRef.current!.requestRenderAll();
    setSelectedId(item.id);
  }

  function toggleVisibility(item: LayerItem) {
    item.objRef.visible = !item.objRef.visible;
    item.objRef.set("visible", item.objRef.visible);
    fabricRef.current!.requestRenderAll();
    syncLayers();
  }

  function toggleLock(item: LayerItem) {
    const locked = !(item.objRef.selectable ?? true);
    item.objRef.set({
      selectable: locked ? true : false,
      evented: locked ? true : false,
    });
    // flip selectable
    item.objRef.set("selectable", !item.objRef.selectable);
    fabricRef.current!.requestRenderAll();
    syncLayers();
  }

  function renameLayer(item: LayerItem, newName: string) {
    item.objRef.set("name", newName);
    syncLayers();
  }

  function deleteLayer(item: LayerItem) {
    fabricRef.current!.remove(item.objRef);
    fabricRef.current!.requestRenderAll();
    syncLayers();
  }

  // reordering helpers
  function bringForward() {
    const active = fabricRef.current!.getActiveObject();
    if (!active) return;
    fabricRef.current!.bringForward(active);
    fabricRef.current!.renderAll();
    syncLayers();
  }
  function sendBackward() {
    const active = fabricRef.current!.getActiveObject();
    if (!active) return;
    fabricRef.current!.sendBackwards(active);
    fabricRef.current!.renderAll();
    syncLayers();
  }
  function bringToFront() {
    const active = fabricRef.current!.getActiveObject();
    if (!active) return;
    fabricRef.current!.bringToFront(active);
    fabricRef.current!.renderAll();
    syncLayers();
  }
  function sendToBack() {
    const active = fabricRef.current!.getActiveObject();
    if (!active) return;
    fabricRef.current!.sendToBack(active);
    fabricRef.current!.renderAll();
    syncLayers();
  }

  const clearCanvas = () => {
    fabricRef.current!.clear();
    fabricRef.current!.setBackgroundColor("#fff", () => {
      fabricRef.current!.renderAll();
    });
    setLayers([]);
  };

  const exportCanvas = () => {
    const url = fabricRef.current!.toDataURL({ format: "png", multiplier: 2 });
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.png";
    a.click();
  };

  // initial sync when user triggers
  useEffect(() => {
    syncLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full">
      <SharedSidebar title="2D Layers & Tools" collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={addText} className="btn">Text</button>
            <button onClick={addRect} className="btn">Box</button>
            <button onClick={addCircle} className="btn">Circle</button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold">Layers</h3>
              <div className="flex gap-1">
                <button className="btn" onClick={bringToFront}>Top</button>
                <button className="btn" onClick={bringForward}>Up</button>
                <button className="btn" onClick={sendBackward}>Down</button>
                <button className="btn" onClick={sendToBack}>Bottom</button>
              </div>
            </div>

            <div className="max-h-56 overflow-auto border rounded p-2 bg-muted/30">
              {layers.length === 0 && <div className="text-xs text-muted">No objects</div>}

              {layers.map((L) => (
                <div key={L.id} className={`flex items-center gap-2 p-1 mb-1 ${selectedId === L.id ? 'bg-muted/60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div onClick={() => selectLayerItem(L)} className="truncate cursor-pointer">
                        <strong className="text-sm">{L.name}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="btn-xs" onClick={() => toggleVisibility(L)}>{L.objRef.visible ? "👁" : "🚫"}</button>
                        <button className="btn-xs" onClick={() => toggleLock(L)}>{(L.objRef.selectable ?? true) ? "🔓" : "🔒"}</button>
                        <button className="btn-xs text-red-500" onClick={() => deleteLayer(L)}>✕</button>
                      </div>
                    </div>
                    <input
                      className="w-full text-xs mt-1 border rounded px-1"
                      defaultValue={L.name}
                      onBlur={(e) => renameLayer(L, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex gap-2">
              <button className="btn w-full" onClick={clearCanvas}>Clear</button>
              <button className="btn w-full" onClick={exportCanvas}>Export</button>
            </div>
          </div>
        </div>
      </SharedSidebar>

      {/* canvas area */}
      <div className="flex-1 p-3">
        <canvas ref={canvasElRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};
