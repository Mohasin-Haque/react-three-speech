import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model({ emotion, isSpeaking, stopSignal }) {
  const group = useRef();
  const { scene } = useGLTF("/model.glb");

  const mesh = scene.getObjectByProperty("type", "SkinnedMesh");
  const dict = mesh?.morphTargetDictionary || {};
  const inf = mesh?.morphTargetInfluences || [];

  const head = scene.getObjectByName("Head");
  const leftHand = scene.getObjectByName("LeftHand");
  const rightHand = scene.getObjectByName("RightHand");

  const visemes = [
    "viseme_aa", "viseme_E", "viseme_I", "viseme_O", "viseme_U",
    "viseme_PP", "viseme_FF", "viseme_TH", "viseme_DD", "viseme_kk",
    "viseme_CH", "viseme_SS", "viseme_nn", "viseme_RR"
  ];

  useEffect(() => {
    // Reset all expressions
    for (let key in dict) inf[dict[key]] = 0;

    // Apply emotion expression
    if (emotion === "Happy") {
      inf[dict.mouthSmile] = 0.6;
      inf[dict.cheekSquintLeft] = 0.3;
      inf[dict.cheekSquintRight] = 0.3;
    } else if (emotion === "Sad") {
      inf[dict.mouthFrownLeft] = 0.5;
      inf[dict.mouthFrownRight] = 0.5;
      inf[dict.browInnerUp] = 0.3;
    } else if (emotion === "Angry") {
      inf[dict.browDownLeft] = 0.5;
      inf[dict.browDownRight] = 0.5;
      inf[dict.eyeSquintLeft] = 0.3;
      inf[dict.eyeSquintRight] = 0.3;
    }
  }, [emotion]);

  useEffect(() => {
    let lipInterval;

    if (isSpeaking) {
      lipInterval = setInterval(() => {
        for (let key in dict) {
          if (key.startsWith("viseme_")) inf[dict[key]] = 0;
        }

        const randomViseme = visemes[Math.floor(Math.random() * visemes.length)];
        if (dict[randomViseme] !== undefined) {
          inf[dict[randomViseme]] = Math.random();
        }
      }, 120);
    } else {
      visemes.forEach((v) => {
        if (dict[v]) inf[dict[v]] = 0;
      });
    }

    if (stopSignal && lipInterval) clearInterval(lipInterval);
    return () => clearInterval(lipInterval);
  }, [isSpeaking, stopSignal]);

  useEffect(() => {
    let blinkInterval;

    const blink = () => {
      if (dict.eyeBlinkLeft && dict.eyeBlinkRight) {
        inf[dict.eyeBlinkLeft] = 1;
        inf[dict.eyeBlinkRight] = 1;

        setTimeout(() => {
          inf[dict.eyeBlinkLeft] = 0;
          inf[dict.eyeBlinkRight] = 0;
        }, 200);
      }
    };

    blinkInterval = setInterval(blink, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (head) {
      head.rotation.y = Math.sin(t) * 0.08;
      head.rotation.x = Math.cos(t * 0.5) * 0.05;
    }

    if (leftHand) {
      leftHand.rotation.z = Math.sin(t * 1.5) * 0.2;
    }

    if (rightHand) {
      rightHand.rotation.z = Math.cos(t * 1.3) * 0.15;
    }
  });

  return (
    <group ref={group} position={[0, -2.3, 0]} scale={[1.5, 1.5, 1.5]}>
      <primitive object={scene} />
    </group>
  );
}
