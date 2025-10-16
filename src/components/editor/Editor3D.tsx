import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
import { Sidebar3D } from "./Sidebar3D"; // use the Sidebar3D you added earlier
// If you use Supabase, import your helper. Example:
// import { uploadTextureFile, deleteTextureFile } from "@/lib/supabase";

type LoadedModel = {
  gltf?: GLTF;
  root?: THREE.Object3D;
  url?: string;
  name?: string;
  textureInfo?: { url: string; supabasePath?: string };
};

export const Editor3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const [loadedModel, setLoadedModel] = useState<LoadedModel | null>(null);
  const [activeTextureUrl, setActiveTextureUrl] = useState<string | null>(null);

  // init scene
  useEffect(() => {
    const el = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f7);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0);
    controls.update();
    controlsRef.current = controls;

    // lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemi.position.set(0, 2, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 4, 2);
    scene.add(dir);

    // ground plane for shadow/scale reference (optional)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    ground.visible = false; // hide if you don't want it
    scene.add(ground);

    // resize handler
    const onWindowResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onWindowResize);

    // render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      controls.dispose();
      renderer.dispose();
      // remove canvas element
      if (renderer.domElement && el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      scene.traverse((c) => {
        if ((c as any).geometry) (c as any).geometry.dispose?.();
        if ((c as any).material) {
          const mat = (c as any).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
          else mat.dispose?.();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- three helpers you asked about ----

  // load GLB (from URL)
  async function loadGLB(url: string, name = "model") {
    if (!sceneRef.current) throw new Error("Scene not ready");
    const loader = new GLTFLoader();
    return new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          // remove previous model
          if (loadedModel?.root) {
            sceneRef.current!.remove(loadedModel.root);
            disposeObject(loadedModel.root);
            setLoadedModel(null);
          }

          const root = gltf.scene;
          // center and scale heuristically
          centerAndScale(root);
          root.name = name;
          sceneRef.current!.add(root);
          setLoadedModel({ gltf, root, url, name });
          resolve(gltf);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  // fallback programmatic bottle (if preset GLB missing)
  function createSimpleBottle() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.6, 32), bodyMat);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.5, 16), bodyMat);
    neck.position.y = 1.05;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    cap.position.y = 1.32;
    group.add(body, neck, cap);
    return group;
  }

  // apply texture (url) to loaded model (or a mesh)
  function applyTextureToModel(target: THREE.Object3D | undefined, textureUrl: string, options?: { scale?: number; rotation?: number; offsetX?: number; offsetY?: number }) {
    if (!target && !loadedModel?.root) return;
    const root = target ?? loadedModel!.root!;
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      if (options?.scale) {
        tex.repeat.set(options.scale, options.scale);
      } else {
        tex.repeat.set(1, 1);
      }
      if (options?.rotation) tex.rotation = options.rotation;
      tex.offset.set(options?.offsetX ?? 0, options?.offsetY ?? 0);
      tex.needsUpdate = true;

      root.traverse((child: any) => {
        if (child.isMesh) {
          // if material is an array
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              if (m.map) m.map.dispose?.();
              m.map = tex;
              m.needsUpdate = true;
            });
          } else {
            if ((child.material as any).map) (child.material as any).map.dispose?.();
            (child.material as any).map = tex;
            (child.material as any).needsUpdate = true;
          }
        }
      });

      // remember active texture URL (for UI)
      setActiveTextureUrl(textureUrl);
      // After applying, you may want to update state with texture info (e.g., supabase path)
      setLoadedModel((prev) => prev ? { ...prev, textureInfo: { url: textureUrl } } : prev);
    });
  }

  // delete texture - removes maps from materials and releases GPU memory
  async function deleteTexture(alsoSupabasePath?: string) {
    if (!loadedModel?.root) return;
    loadedModel.root.traverse((child: any) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => {
            if (m.map) {
              m.map.dispose?.();
              m.map = null;
              m.needsUpdate = true;
            }
          });
        } else {
          if ((child.material as any).map) {
            (child.material as any).map.dispose?.();
            (child.material as any).map = null;
            (child.material as any).needsUpdate = true;
          }
        }
      }
    });
    setActiveTextureUrl(null);
    setLoadedModel((prev) => prev ? { ...prev, textureInfo: undefined } : prev);

    // Optionally delete from Supabase if you persisted it:
    // if (alsoSupabasePath) await deleteTextureFile('textures', alsoSupabasePath);
  }

  // helper to upload file and apply texture (used by Sidebar)
  async function handleTextureUploadFile(file: File) {
    // create local preview URL
    const url = URL.createObjectURL(file);
    // apply texture immediately to model
    applyTextureToModel(undefined, url, { scale: 1, rotation: 0, offsetX: 0, offsetY: 0 });

    // Optionally persist to Supabase and store returned path/publicUrl
    // const { path, publicUrl } = await uploadTextureFile('textures', file);
    // setLoadedModel(prev => prev ? { ...prev, textureInfo: { url: publicUrl, supabasePath: path } } : prev);
  }

  // helper to upload and load a model file (from input)
  async function handleModelUploadFile(file: File) {
    // use ephemeral object url to load GLB locally
    const url = URL.createObjectURL(file);
    try {
      await loadGLB(url, file.name);
      // Optionally store model (upload to Supabase or your storage) here
    } catch (err) {
      console.error("Failed to load GLB:", err);
      // fallback: create simple bottle
      const fallback = createSimpleBottle();
      sceneRef.current!.add(fallback);
      setLoadedModel({ root: fallback, name: "fallback-bottle", url: undefined });
    } finally {
      // revoke URL if you want to free memory - but revoke after a short delay if texture is in use
      setTimeout(() => URL.revokeObjectURL(url), 20000);
    }
  }

  // presets wiring - either load GLB presets from /public or create simple shapes
  async function applyPreset(presetKey: string) {
    // mapping to public file URLs
    const presetsMap: Record<string, string> = {
      dropper: "/models/presets/dropper.glb",
      cosmetic1: "/models/presets/cosmetic1.glb",
      cosmetic2: "/models/presets/jar.glb",
      spray: "/models/presets/spray.glb",
      serum: "/models/presets/serum.glb",
    };
    const url = presetsMap[presetKey];
    if (!url) {
      // fallback to simple programmatic model
      const fallback = createSimpleBottle();
      if (loadedModel?.root) {
        sceneRef.current!.remove(loadedModel.root);
        disposeObject(loadedModel.root);
      }
      centerAndScale(fallback);
      sceneRef.current!.add(fallback);
      setLoadedModel({ root: fallback, name: presetKey });
      return;
    }
    try {
      await loadGLB(url, presetKey);
    } catch (err) {
      console.warn("Preset GLB failed to load, using fallback:", err);
      const fallback = createSimpleBottle();
      centerAndScale(fallback);
      sceneRef.current!.add(fallback);
      setLoadedModel({ root: fallback, name: presetKey });
    }
  }

  // apply texture transform (scale, rotation (radians), offsetX, offsetY)
  function applyTextureTransform(params: { scale: number; rotation: number; offsetX: number; offsetY: number }) {
    if (!loadedModel?.root) return;
    // if active texture is an object URL, just reapply with new options
    const texUrl = loadedModel.textureInfo?.url ?? activeTextureUrl;
    if (!texUrl) return;
    applyTextureToModel(undefined, texUrl, {
      scale: params.scale,
      rotation: params.rotation,
      offsetX: params.offsetX,
      offsetY: params.offsetY,
    });
  }

  // small util: center and scale model to fit camera
  function centerAndScale(root: THREE.Object3D) {
    // compute bounding box
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // reposition
    root.position.x += -center.x;
    root.position.y += -center.y;
    root.position.z += -center.z;

    // scale to fit -> target height ~1.5
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 1.6 / maxDim;
      root.scale.setScalar(scale);
    }
  }

  // helper: dispose geometry & materials recursively
  function disposeObject(obj: THREE.Object3D) {
    obj.traverse((c: any) => {
      if (c.geometry) {
        c.geometry.dispose?.();
      }
      if (c.material) {
        const m = c.material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
        else m.dispose?.();
      }
    });
  }

  // expose the functions to the Sidebar via props
  // pass these handlers to Sidebar3D props:
  // onModelUpload, onApplyPreset, onTextureUpload, onApplyTextureTransform, onDeleteTexture

  return (
    <div className="flex h-full">
      <Sidebar3D
        onModelUpload={async (file) => {
          await handleModelUploadFile(file);
        }}
        onApplyPreset={(preset) => applyPreset(preset)}
        onTextureUpload={async (file) => {
          await handleTextureUploadFile(file);
        }}
        onApplyTextureTransform={(params) => applyTextureTransform(params)}
        onDeleteTexture={async () => {
          await deleteTexture(loadedModel?.textureInfo?.supabasePath);
        }}
      />

      <div ref={mountRef} style={{ flex: 1, height: "100%" }} />
    </div>
  );
};

export default Editor3D;
