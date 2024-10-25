import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const DetectFace = ({ onDetect }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadModelsAndStartDetection = async () => {
      try {
        // Load face-api models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);

        // Access webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        // Set up video element (hidden)
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Start detection loop
        setInterval(async () => {
          if (videoRef.current) {
            const detections = await faceapi.detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            );

            if (detections.length > 0) {
              onDetect(true)
            } else {
              onDetect(false);
            }
            // console.log(`${detections.length} face(s) detected`);
          }
        }, 2000);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadModelsAndStartDetection();

    // Cleanup
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="hidden">
      <video ref={videoRef} width="0" height="0" />
    </div>
  );
};

export default DetectFace;