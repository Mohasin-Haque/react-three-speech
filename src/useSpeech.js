import { useState } from 'react';

export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  return [isSpeaking, speak];
}
