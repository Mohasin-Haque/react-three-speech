  import React, { useState, useRef } from "react";
  import { Canvas } from "@react-three/fiber";
  import Model from "./components/Model";
  import "./App.css";

  function App() {
    const [text, setText] = useState("");
    const [emotion, setEmotion] = useState("Happy");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [stopSignal, setStopSignal] = useState(false);
    const synthRef = useRef(window.speechSynthesis);

    const speak = () => {
      if (!text.trim()) return;

      const utterance = new SpeechSynthesisUtterance(text);
      setStopSignal(false);

      if (emotion === "Happy") {
        utterance.pitch = 1.5;
        utterance.rate = 1.1;
      } else if (emotion === "Sad") {
        utterance.pitch = 0.7;
        utterance.rate = 0.8;
      } else if (emotion === "Angry") {
        utterance.pitch = 1.2;
        utterance.rate = 1.5;
      }

      utterance.onend = () => setIsSpeaking(false);

      setIsSpeaking(true);
      synthRef.current.cancel(); // Just in case
      synthRef.current.speak(utterance);
    };

    const stop = () => {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setStopSignal(true); // triggers stop of viseme animation
    };

    return (
      <main className="main">
        <div className="container">
          <Canvas camera={{ position: [0, -0.5, 2.5], fov: 30 }}>
            <ambientLight />
            <Model emotion={emotion} isSpeaking={isSpeaking} stopSignal={stopSignal} />
          </Canvas>

          <div className="controls">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text here..."
              rows={4}
            />
            <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
              <option value="Happy">😊 Happy</option>
              <option value="Sad">😢 Sad</option>
              <option value="Angry">😠 Angry</option>
            </select>
            <div className="button-row">
              <button onClick={speak}>Speak</button>
              <button onClick={stop} style={{ background: "#f44336", color: "#fff" }}>
                Stop
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  export default App;
