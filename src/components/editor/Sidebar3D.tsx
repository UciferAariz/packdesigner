import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Image as ImageIcon,
  Lightbulb,
  RotateCcw,
  Download,
  Layers,
} from "lucide-react";

interface Sidebar3DProps {
  onModelUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lightIntensity: number;
  onLightingChange: (value: number[]) => void;
  onResetCamera: () => void;
  onExport: () => void;
  loading?: boolean;
}

export const Sidebar3D: React.FC<Sidebar3DProps> = ({
  onModelUpload,
  onTextureUpload,
  lightIntensity,
  onLightingChange,
  onResetCamera,
  onExport,
  loading = false,
}) => {
  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const textureInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <aside className="w-72 border-r border-border bg-card p-4 overflow-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Model & Textures
          </h3>

          <div className="flex flex-col gap-2">
            <input
              ref={modelInputRef}
              type="file"
              accept=".glb,.gltf"
              onChange={onModelUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => modelInputRef.current?.click()}
              className="justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Model (.glb / .gltf)
            </Button>

            <input
              ref={textureInputRef}
              type="file"
              accept="image/*"
              onChange={onTextureUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => textureInputRef.current?.click()}
              className="justify-start"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Texture
            </Button>

            <p className="text-xs text-muted-foreground mt-1">
              Tip: upload .glb/.gltf. Textures should be PNG/JPEG.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Lighting
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs w-12">Intensity</span>
              <div className="flex-1">
                <Slider
                  value={[lightIntensity]}
                  min={0}
                  max={2}
                  step={0.01}
                  onValueChange={onLightingChange}
                />
              </div>
              <span className="text-sm w-10 text-right">{lightIntensity.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onLightingChange([0.5])}>
                Dim
              </Button>
              <Button variant="outline" size="sm" onClick={() => onLightingChange([1])}>
                Normal
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Utilities
          </h3>

          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={onResetCamera}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Camera
            </Button>

            <Button
              className="w-full justify-start bg-primary hover:bg-primary/90"
              onClick={onExport}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? "Exporting..." : "Export Render"}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
