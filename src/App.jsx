import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./components/Model";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("Happy");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Set pitch/rate based on emotion
    if (emotion === "Happy") {
      utterance.pitch = 1.5;
      utterance.rate = 1.1;
    }
    if (emotion === "Sad") {
      utterance.pitch = 0.7;
      utterance.rate = 0.8;
    }
    if (emotion === "Angry") {
      utterance.pitch = 1.2;
      utterance.rate = 1.5;
    }

    setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  return (
    <main className="main">
      <div className="container">
        <Canvas camera={{ position: [0, -0.5, 2.5], fov: 30 }}>
          <ambientLight />
          <Model emotion={emotion} isSpeaking={isSpeaking} />
        </Canvas>

        <div className="controls">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            rows={4}
          />
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
          >
            <option value="Happy">😊 Happy</option>
            <option value="Sad">😢 Sad</option>
            <option value="Angry">😠 Angry</option>
          </select>
          <button onClick={speak}>Speak</button>
        </div>
      </div>
    </main>
  );
}

export default App;
