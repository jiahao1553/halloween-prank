// src/components/WebcamCapture.js

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const WebcamCapture = ({ onDetect }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `http://localhost:3000/models`;
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (
        modelsLoaded &&
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

        if (detections.length > 0) {
          onDetect(true);
        } else {
          onDetect(false);
        }
      }
    };

    const intervalId = setInterval(detect, 1000);

    return () => clearInterval(intervalId);
  }, [modelsLoaded, onDetect]);

  return (
    <div>
      <Webcam ref={webcamRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;