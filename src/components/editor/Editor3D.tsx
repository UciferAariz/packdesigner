// src/components/editor/Editor3D.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
import { Sidebar3D } from "./Sidebar3D"; // adjust path if necessary
import { uploadTextureFile, deleteTextureFile } from "@/lib/supabaseClient"; // ensure this exists

type LoadedModel = {
  gltf?: GLTF;
  root?: THREE.Object3D;
  url?: string | undefined;
  name?: string;
  textureInfo?: { url: string; supabasePath?: string } | undefined;
};

const Editor3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const [loadedModel, setLoadedModel] = useState<LoadedModel | null>(null);
  const [activeTextureUrl, setActiveTextureUrl] = useState<string | null>(null);

  // init three scene
  useEffect(() => {
    const mount = mountRef.current!;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f7);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0);
    controls.update();
    controlsRef.current = controls;

    // lighting
    const hem = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hem.position.set(0, 2, 0);
    scene.add(hem);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 4, 2);
    scene.add(dir);

    // optional ground helper
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    ground.visible = false;
    scene.add(ground);

    // handle resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // animation loop
    let mounted = true;
    const animate = () => {
      if (!mounted) return;
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);

      // dispose scene children
      scene.traverse((c: any) => {
        if (c.geometry) c.geometry.dispose?.();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach((m: any) => m.dispose?.());
          else c.material.dispose?.();
        }
        if (c.texture) c.texture?.dispose?.();
      });
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ three helper functions ------------------

  // load GLB from url
  async function loadGLB(url: string, name = "model"): Promise<GLTF> {
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

  // programmatic simple bottle (fallback)
  function createSimpleBottle(): THREE.Group {
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

  // apply texture to model (traverse and assign texture to mesh materials)
  function applyTextureToModel(target: THREE.Object3D | undefined, textureUrl: string, options?: { scale?: number; rotation?: number; offsetX?: number; offsetY?: number }) {
    const root = target ?? loadedModel?.root;
    if (!root) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        const scale = options?.scale ?? 1;
        tex.repeat.set(scale, scale);
        if (options?.rotation) tex.rotation = options.rotation;
        tex.offset.set(options?.offsetX ?? 0, options?.offsetY ?? 0);
        tex.needsUpdate = true;

        root.traverse((child: any) => {
          if (child.isMesh) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => {
                if (m.map) m.map.dispose?.();
                m.map = tex;
                m.needsUpdate = true;
              });
            } else {
              if (child.material.map) child.material.map.dispose?.();
              child.material.map = tex;
              child.material.needsUpdate = true;
            }
          }
        });

        setActiveTextureUrl(textureUrl);
        setLoadedModel((prev) => (prev ? { ...prev, textureInfo: { url: textureUrl } } : prev));
      },
      undefined,
      (err) => {
        console.error("Texture load error:", err);
      }
    );
  }

  // dispose geometry & materials recursively
  function disposeObject(obj: THREE.Object3D) {
    obj.traverse((c: any) => {
      if (c.geometry) c.geometry.dispose?.();
      if (c.material) {
        if (Array.isArray(c.material)) c.material.forEach((m: any) => m.dispose?.());
        else c.material.dispose?.();
      }
      if (c.texture) c.texture?.dispose?.();
    });
  }

  // center & scale object to a reasonable size for camera
  function centerAndScale(root: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    root.position.x += -center.x;
    root.position.y += -center.y;
    root.position.z += -center.z;

    const maxDim = Math.max(size.x || 0.0001, size.y || 0.0001, size.z || 0.0001);
    if (maxDim > 0) {
      const scale = 1.6 / maxDim;
      root.scale.setScalar(scale);
    }
  }

  // ------------------ Supabase-integrated handlers ------------------

  // When user selects a texture file in the sidebar:
  // 1) Upload to Supabase storage (textures bucket)
  // 2) Apply returned public URL to the model
  async function handleTextureUploadFile(file: File) {
    try {
      // upload to Supabase
      const { path, publicUrl } = await uploadTextureFile("textures", file);
      // apply to model immediately using the public URL
      applyTextureToModel(undefined, publicUrl, { scale: 1, rotation: 0, offsetX: 0, offsetY: 0 });

      // persist textureInfo path for deletion later
      setLoadedModel((prev) =>
        prev ? { ...prev, textureInfo: { url: publicUrl, supabasePath: path } } : prev
      );
      setActiveTextureUrl(publicUrl);
    } catch (err) {
      console.error("Failed to upload texture to Supabase:", err);
      alert("Failed to upload texture. See console for details.");
    }
  }

  // Delete texture from the model and optionally from Supabase
  async function handleDeleteTexture(supabasePath?: string) {
    if (!loadedModel?.root) return;

    // remove maps from all materials
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
          if (child.material.map) {
            child.material.map.dispose?.();
            child.material.map = null;
            child.material.needsUpdate = true;
          }
        }
      }
    });

    setActiveTextureUrl(null);
    setLoadedModel((prev) => (prev ? { ...prev, textureInfo: undefined } : prev));

    // delete from Supabase storage if path provided
    if (supabasePath) {
      try {
        await deleteTextureFile("textures", supabasePath);
        console.log("Deleted texture from Supabase:", supabasePath);
      } catch (err) {
        console.error("Failed to delete texture from Supabase:", err);
      }
    }
  }

  // Model upload (file) - createObjectURL and load
  async function handleModelUploadFile(file: File) {
    const url = URL.createObjectURL(file);
    try {
      await loadGLB(url, file.name);
    } catch (err) {
      console.error("Failed to load GLB, using fallback model:", err);
      // fallback: create simple bottle
      if (!sceneRef.current) return;
      if (loadedModel?.root) {
        sceneRef.current.remove(loadedModel.root);
        disposeObject(loadedModel.root);
        setLoadedModel(null);
      }
      const fallback = createSimpleBottle();
      centerAndScale(fallback);
      sceneRef.current.add(fallback);
      setLoadedModel({ root: fallback, name: "fallback-bottle" });
    } finally {
      // small delay before revoking (texture may still use the blob)
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }, 20000);
    }
  }

  // Apply a named preset (either load GLB from public folder or generate fallback)
  async function applyPreset(presetKey: string) {
    const presetsMap: Record<string, string> = {
      dropper: "/models/presets/dropper.glb",
      cosmetic1: "/models/presets/cosmetic1.glb",
      cosmetic2: "/models/presets/jar.glb",
      spray: "/models/presets/spray.glb",
      serum: "/models/presets/serum.glb",
    };

    const url = presetsMap[presetKey];
    if (!url) {
      // create fallback
      if (!sceneRef.current) return;
      if (loadedModel?.root) {
        sceneRef.current.remove(loadedModel.root);
        disposeObject(loadedModel.root);
        setLoadedModel(null);
      }
      const fallback = createSimpleBottle();
      centerAndScale(fallback);
      sceneRef.current.add(fallback);
      setLoadedModel({ root: fallback, name: presetKey });
      return;
    }

    try {
      await loadGLB(url, presetKey);
    } catch (err) {
      console.warn("Failed to load preset GLB, using fallback:", err);
      if (!sceneRef.current) return;
      if (loadedModel?.root) {
        sceneRef.current.remove(loadedModel.root);
        disposeObject(loadedModel.root);
        setLoadedModel(null);
      }
      const fallback = createSimpleBottle();
      centerAndScale(fallback);
      sceneRef.current.add(fallback);
      setLoadedModel({ root: fallback, name: presetKey });
    }
  }

  // Apply scale/rotation/offset transform to currently applied texture
  function applyTextureTransform(params: { scale: number; rotation: number; offsetX: number; offsetY: number }) {
    const url = loadedModel?.textureInfo?.url ?? activeTextureUrl;
    if (!url) return;
    applyTextureToModel(undefined, url, {
      scale: params.scale,
      rotation: params.rotation,
      offsetX: params.offsetX,
      offsetY: params.offsetY,
    });
    // keep textureInfo updated (no supabase path change)
    setLoadedModel((prev) =>
      prev ? { ...prev, textureInfo: { ...(prev.textureInfo ?? { url }), url } } : prev
    );
  }

  // ------------------ render ------------------

  return (
    <div className="flex h-full">
      <Sidebar3D
        onModelUpload={async (file: File) => {
          await handleModelUploadFile(file);
        }}
        onApplyPreset={(presetKey: string) => {
          applyPreset(presetKey);
        }}
        onTextureUpload={async (file: File) => {
          await handleTextureUploadFile(file);
        }}
        onApplyTextureTransform={(params) => {
          applyTextureTransform(params);
        }}
        onDeleteTexture={async (textureId?: string) => {
          // textureId corresponds to supabasePath if available
          await handleDeleteTexture(loadedModel?.textureInfo?.supabasePath);
        }}
      />

      <div ref={mountRef} style={{ flex: 1, height: "100%", minHeight: 400 }} />
    </div>
  );
};

export default Editor3D;
