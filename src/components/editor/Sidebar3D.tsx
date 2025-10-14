import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Upload, 
  Image as ImageIcon, 
  Lightbulb,
  RotateCcw,
  Download,
  Box,
  Layers
} from "lucide-react";
import { useRef } from "react";

interface Sidebar3DProps {
  onModelUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lightIntensity: number;
  onLightingChange: (value: number[]) => void;
  onResetCamera: () => void;
  onExport: () => void;
  loading: boolean;
}

export const Sidebar3D = ({
  onModelUpload,
  onTextureUpload,
  lightIntensity,
  onLightingChange,
  onResetCamera,
  onExport,
  loading
}: Sidebar3DProps) => {
  const modelInputRef = useRef<HTMLInputElement>(null);
  const textureInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-80 bg-card border-r border-border overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Box className="w-5 h-5" />
            3D Editor
          </h3>
        </div>

        {/* Upload Model */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload 3D Model
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
               onClick={() => modelInputRef.current?.click()}>
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-1">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              GLB or GLTF format
            </p>
          </div>
          <input
            ref={modelInputRef}
            type="file"
            accept=".glb,.gltf"
            onChange={onModelUpload}
            className="hidden"
          />
        </div>

        {/* Upload Texture */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Upload Texture
          </label>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => textureInputRef.current?.click()}
            disabled={loading}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
          <input
            ref={textureInputRef}
            type="file"
            accept="image/*"
            onChange={onTextureUpload}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground">
            Apply texture to model surface
          </p>
        </div>

        {/* Lighting Controls */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Lighting Intensity
          </label>
          <Slider
            value={[lightIntensity]}
            onValueChange={onLightingChange}
            min={0.1}
            max={2}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Current: {lightIntensity.toFixed(1)}x
          </p>
        </div>

        {/* Material Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Material Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" disabled>
              Plastic Glossy
            </Button>
            <Button variant="outline" size="sm" disabled>
              Metal
            </Button>
            <Button variant="outline" size="sm" disabled>
              Matte
            </Button>
            <Button variant="outline" size="sm" disabled>
              Glass
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Coming soon
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onResetCamera}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Camera
          </Button>
          
          <Button
            className="w-full justify-start bg-primary hover:bg-primary/90"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Render
          </Button>
        </div>
      </div>
    </div>
  );
};
