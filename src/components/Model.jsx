// // import React, { useRef } from "react";
// // import { useGLTF } from "@react-three/drei";
// // import { useFrame } from "@react-three/fiber";

// // export default function Model({ emotion }) {
// //   const group = useRef();
// //   const { scene } = useGLTF("/model.glb"); // Ensure this model exists in public/

// //   // Animate slight floating effect or react to emotion (optional)
// //   useFrame(() => {
// //     if (group.current) {
// //       group.current.rotation.y += 0.002; // slow rotation
// //     }
// //   });

// //   return (
// //     <group ref={group} position={[0, -1.5, 0]} scale={[1, 1, 1]}>
// //       <primitive object={scene} />
// //     </group>
// //   );
// // }
// import React, { useEffect } from "react";
// import { useGLTF } from "@react-three/drei";

// export default function Model({ emotion }) {
//   const { scene, nodes } = useGLTF("/model.glb");

//   useEffect(() => {
//     const mesh = scene.getObjectByProperty("type", "SkinnedMesh") || scene.children[0];

//     if (mesh?.morphTargetDictionary && mesh?.morphTargetInfluences) {
//       const dictionary = mesh.morphTargetDictionary;
//       const influences = mesh.morphTargetInfluences;

//       // Reset all expressions
//       for (let key in dictionary) {
//         influences[dictionary[key]] = 0;
//       }

//       // Set expression based on emotion
//       if (emotion && dictionary[emotion]) {
//         influences[dictionary[emotion]] = 1; // full expression
//       }
//     }
//   }, [emotion, scene]);

//   return (
//     <group position={[0, -1.5, 0]} scale={[1, 1, 1]}>
//       <primitive object={scene} />
//     </group>
//   );
// // }
// import React, { useEffect, useRef } from "react";
// import { useGLTF } from "@react-three/drei";

// export default function Model({ emotion, isSpeaking }) {
//   const group = useRef();
//   const { scene } = useGLTF("/model.glb");

//   useEffect(() => {
//     const mesh = scene.getObjectByProperty("type", "SkinnedMesh");

//     if (mesh?.morphTargetDictionary && mesh?.morphTargetInfluences) {
//       const dict = mesh.morphTargetDictionary;
//       const inf = mesh.morphTargetInfluences;

//       // Reset expressions
//       for (let key in dict) inf[dict[key]] = 0;

//       if (emotion && dict[emotion]) {
//         inf[dict[emotion]] = 1;
//       }
//     }
//   }, [emotion, scene]);

//   // Lip sync while speaking
//   useEffect(() => {
//     let interval;
//     const mesh = scene.getObjectByProperty("type", "SkinnedMesh");
//     const mouthIndex = mesh?.morphTargetDictionary?.MouthOpen;

//     if (isSpeaking && mouthIndex !== undefined) {
//       interval = setInterval(() => {
//         mesh.morphTargetInfluences[mouthIndex] = Math.random();
//       }, 100);
//     } else if (mouthIndex !== undefined) {
//       mesh.morphTargetInfluences[mouthIndex] = 0;
//     }

//     return () => clearInterval(interval);
//   }, [isSpeaking, scene]);

//   // Periodic eye blinking
//   useEffect(() => {
//     const mesh = scene.getObjectByProperty("type", "SkinnedMesh");
//     const leftEye = mesh?.morphTargetDictionary?.eyeBlinkLeft;
//     const rightEye = mesh?.morphTargetDictionary?.eyeBlinkRight;

//     let blinkInterval = setInterval(() => {
//       if (leftEye !== undefined && rightEye !== undefined) {
//         mesh.morphTargetInfluences[leftEye] = 1;
//         mesh.morphTargetInfluences[rightEye] = 1;

//         setTimeout(() => {
//           mesh.morphTargetInfluences[leftEye] = 0;
//           mesh.morphTargetInfluences[rightEye] = 0;
//         }, 200); // eye closed for 200ms
//       }
//     }, 4000); // blink every 4 seconds

//     return () => clearInterval(blinkInterval);
//   }, [scene]);

//   return (
//     <group ref={group} position={[0, -1.5, 0]} scale={[1, 1, 1]}>
//       <primitive object={scene} />
//     </group>
//   );
// }
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";


export default function Model({ emotion, isSpeaking }) {
  const group = useRef();
  const { scene } = useGLTF("/model.glb");

  const mesh = scene.getObjectByProperty("type", "SkinnedMesh");
  const headBone = scene.getObjectByName("Head");
  const leftHandBone = scene.getObjectByName("LeftHand");
  const rightHandBone = scene.getObjectByName("RightHand");

  // Set morph targets for emotion
  useEffect(() => {
    if (mesh?.morphTargetDictionary && mesh?.morphTargetInfluences) {
      const dict = mesh.morphTargetDictionary;
      const inf = mesh.morphTargetInfluences;

      // Reset all influences
      for (let key in dict) {
        inf[dict[key]] = 0;
      }

      if (emotion && dict[emotion]) {
        inf[dict[emotion]] = 1;
      }
    }
  }, [emotion, mesh]);

  // Lip sync morph target
  useEffect(() => {
    let interval;
    if (!mesh?.morphTargetDictionary || !mesh.morphTargetInfluences) return;

    const mouthIndex = mesh.morphTargetDictionary["mouthOpen"];

    if (isSpeaking && mouthIndex !== undefined) {
      interval = setInterval(() => {
        mesh.morphTargetInfluences[mouthIndex] = Math.random();
      }, 100);
    } else if (mouthIndex !== undefined) {
      mesh.morphTargetInfluences[mouthIndex] = 0;
    }

    return () => clearInterval(interval);
  }, [isSpeaking, mesh]);

  // Periodic eye blinking
  useEffect(() => {
    let blinkInterval;
    if (!mesh?.morphTargetDictionary || !mesh.morphTargetInfluences) return;

    const leftEye = mesh.morphTargetDictionary["eyeBlinkLeft"];
    const rightEye = mesh.morphTargetDictionary["eyeBlinkRight"];

    if (leftEye === undefined || rightEye === undefined) return;

    const blink = () => {
      mesh.morphTargetInfluences[leftEye] = 1;
      mesh.morphTargetInfluences[rightEye] = 1;

      setTimeout(() => {
        mesh.morphTargetInfluences[leftEye] = 0;
        mesh.morphTargetInfluences[rightEye] = 0;
      }, 200);
    };

    blinkInterval = setInterval(() => {
      blink();
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, [mesh]);

  // Animate simple body language (head and hands)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (headBone) {
      headBone.rotation.y = Math.sin(t) * 0.1;
      headBone.rotation.x = Math.sin(t * 0.5) * 0.05;
    }
    if (leftHandBone) {
      leftHandBone.rotation.z = Math.sin(t * 1.5) * 0.2;
    }
    if (rightHandBone) {
      rightHandBone.rotation.z = Math.cos(t * 1.3) * 0.15;
    }
  });

  return (
    <group ref={group} position={[0, -2.3, 0]} scale={[1.5, 1.5, 1.5]}>
      <primitive object={scene} />
    </group>
  );
}
