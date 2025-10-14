import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Upload, 
  Image as ImageIcon, 
  Lightbulb, 
  Move3d,
  RotateCw,
  ZoomIn,
  Download,
  Box
} from "lucide-react";
import { toast } from "sonner";
import { Sidebar3D } from "./Sidebar3D";

export const Editor3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(hemisphereLight);

    // Add default model (cylinder as bottle placeholder)
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1
    });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.position.y = 1;
    scene.add(cylinder);
    modelRef.current = cylinder;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['glb', 'gltf'].includes(fileExtension || '')) {
      toast.error("Please upload a .glb or .gltf file");
      return;
    }

    setLoading(true);
    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          if (!sceneRef.current) return;

          // Remove old model
          if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
          }

          const model = gltf.scene;
          
          // Center and scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3 / maxDim;
          
          model.scale.multiplyScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          model.position.y = 0;

          // Enable shadows
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          sceneRef.current.add(model);
          modelRef.current = model;
          setLoading(false);
          toast.success("Model uploaded successfully");
        },
        (error) => {
          console.error(error);
          setLoading(false);
          toast.error("Failed to load model");
        }
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(e.target?.result as string, (texture) => {
        if (!modelRef.current) return;

        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.3,
              metalness: 0.1
            });
          }
        });

        toast.success("Texture applied successfully");
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLightingChange = (value: number[]) => {
    const intensity = value[0];
    setLightIntensity(intensity);
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = intensity * 0.6;
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = intensity;
    }
  };

  const handleExport = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = '3d-render.png';
    link.href = dataURL;
    link.click();
    toast.success("Render exported");
  };

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(5, 3, 5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
    toast.success("Camera reset");
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar3D
        onModelUpload={handleModelUpload}
        onTextureUpload={handleTextureUpload}
        lightIntensity={lightIntensity}
        onLightingChange={handleLightingChange}
        onResetCamera={resetCamera}
        onExport={handleExport}
        loading={loading}
      />

      <div className="flex-1 relative">
        <div ref={containerRef} className="w-full h-full" />
        
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg">
              <p className="text-foreground">Loading model...</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card px-6 py-3 rounded-full shadow-lg border border-border">
          <p className="text-sm text-muted-foreground">
            Drag to rotate • Right-click to pan • Scroll to zoom
          </p>
        </div>
      </div>
    </div>
  );
};
