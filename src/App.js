// src/App.js

import React, { useState, useEffect } from 'react';
import WebcamCapture from './components/WebcamCapture.js';
import normalImage from './assets/normal_image.png';
import ghostImage from './assets/ghost_image.png';
import ghostSound from './assets/ghost_sound.mp3';
import './App.css';

function App() {
  const [isHumanDetected, setIsHumanDetected] = useState(false);
  const [audio] = useState(new Audio(ghostSound));

  useEffect(() => {
    if (isHumanDetected) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isHumanDetected, audio]);

  return (
    <div className="App">
      <WebcamCapture onDetect={setIsHumanDetected} />
      <img
        src={isHumanDetected ? ghostImage : normalImage}
        alt="Display"
        className="display-image"
      />
    </div>
  );
}

export default App;