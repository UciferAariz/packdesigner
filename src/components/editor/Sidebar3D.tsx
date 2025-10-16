// src/components/editor/Sidebar3D.tsx
import React, { useRef, useState } from "react";
import { SharedSidebar } from "./SharedSidebar";
import { supabase } from "@/integrations/supabase/client";

type Sidebar3DProps = {
  onModelUpload: (file: File) => Promise<void>;
  onApplyPreset: (presetName: string) => void;
  onTextureUpload: (file: File) => Promise<void>;
  onApplyTextureTransform?: (params: { scale: number; rotation: number; offsetX: number; offsetY: number }) => void;
  onDeleteTexture?: (textureId?: string) => Promise<void>;
  loading?: boolean;
};

export const Sidebar3D: React.FC<Sidebar3DProps> = ({
  onModelUpload,
  onApplyPreset,
  onTextureUpload,
  onApplyTextureTransform,
  onDeleteTexture,
  loading = false,
}) => {
  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const textureInputRef = useRef<HTMLInputElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [saving, setSaving] = useState(false);

  const presetList = [
    { key: "dropper", label: "Dropper Bottle", glb: "/models/presets/dropper.glb" },
    { key: "cosmetic1", label: "Cylindrical Cosmetic", glb: "/models/presets/cosmetic1.glb" },
    { key: "cosmetic2", label: "Wide Jar", glb: "/models/presets/jar.glb" },
    { key: "spray", label: "Spray Bottle", glb: "/models/presets/spray.glb" },
    { key: "serum", label: "Serum Bottle", glb: "/models/presets/serum.glb" },
  ];

  async function handleModelFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    await onModelUpload(f);
  }

  async function handleTextureFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    await onTextureUpload(f);
  }

  function applyTransform() {
    onApplyTextureTransform?.({ scale, rotation, offsetX, offsetY });
  }

  async function saveTextureToSupabase(file: File) {
    if (!supabase) throw new Error("Supabase not configured");
    setSaving(true);
    try {
      const key = `textures/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from("textures").upload(key, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      // optionally save metadata to a table
      // await supabase.from('textures_meta').insert({ path: data.path, name: file.name, created_at: new Date() })
      setSaving(false);
      alert("Saved to Supabase as: " + data.path);
    } catch (err: any) {
      setSaving(false);
      console.error(err);
      alert("Failed to save texture: " + (err.message || err));
    }
  }

  async function handleDeleteTexture(textureId?: string) {
    if (!onDeleteTexture) return;
    await onDeleteTexture(textureId);
  }

  return (
    <SharedSidebar title="3D Editor" collapsed={false}>
      <div className="space-y-4">
        <section>
          <h3 className="text-xs font-semibold mb-2">Model Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            {presetList.map((p) => (
              <button
                key={p.key}
                className="btn w-full text-left"
                onClick={() => onApplyPreset(p.key)}
              >
                {p.label}
              </button>
            ))}
            <div className="text-xs text-muted mt-1">
              Place preset GLBs under <code>public/models/presets/</code> as the names above or update their paths.
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold mb-2">Model & Texture</h3>
          <input ref={modelInputRef} type="file" accept=".glb,.gltf" className="hidden" onChange={handleModelFilePick} />
          <button className="btn w-full" onClick={() => modelInputRef.current?.click()}>
            Upload Model (.glb/.gltf)
          </button>

          <input ref={textureInputRef} type="file" accept="image/*" className="hidden" onChange={handleTextureFilePick} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button className="btn" onClick={() => textureInputRef.current?.click()}>
              Upload Texture
            </button>
            <button className="btn" onClick={() => {
              // trigger delete
              if (confirm("Delete current texture?")) handleDeleteTexture();
            }}>
              Delete Texture
            </button>
          </div>

          <div className="mt-2">
            <div className="text-xs mb-1">Texture Transform</div>
            <label className="text-xs">Scale</label>
            <input type="range" min={0.1} max={4} step={0.05} value={scale} onChange={(e)=>setScale(Number(e.target.value))} />
            <div className="flex gap-2 items-center">
              <label className="text-xs">Rotation</label>
              <input type="number" value={rotation} onChange={(e)=>setRotation(Number(e.target.value))} className="input w-20" />
            </div>
            <div className="flex gap-2">
              <input type="number" value={offsetX} onChange={(e)=>setOffsetX(Number(e.target.value))} className="input w-full" placeholder="Offset X" />
              <input type="number" value={offsetY} onChange={(e)=>setOffsetY(Number(e.target.value))} className="input w-full" placeholder="Offset Y" />
            </div>
            <div className="flex gap-2 mt-2">
              <button className="btn" onClick={applyTransform}>Apply</button>
              <button className="btn" onClick={() => {
                // save last uploaded texture to Supabase - will ask user to pick file again
                const el = textureInputRef.current;
                if (el?.files?.length) saveTextureToSupabase(el.files[0]);
                else alert("Please upload a texture first to save it.");
              }}>
                {saving ? "Saving..." : "Save to Supabase"}
              </button>
            </div>
          </div>
        </section>

      </div>
    </SharedSidebar>
  );
};
