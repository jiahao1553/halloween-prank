"use client";
import DetectFace from "@/components/DetectFace";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import normalImage from "@/public/assets/normal_image.png";
import frame from "@/public/assets/frame.png";
import useWindowSize from "@/hooks/useWindowSize";

export default function Display() {
  const [humanDetected, setHumanDetected] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const { width } = useWindowSize();

  const handleFaceDetect = (face) => {
    setHumanDetected(face);
  };

  useEffect(() => {
    if (humanDetected && !isVideoPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [humanDetected, isVideoPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = humanDetected ? 1 : 0.3;
    }
  }, [humanDetected]);

  return <div className="bg-black">
    <DetectFace onDetect={handleFaceDetect} />
    <div className="relative-parent flex justify-center items-center h-screen">
        <Image className={`${!humanDetected ? '' : 'hidden'} w-9/12 sm:h-screen`} src={normalImage} alt="Normal Image" priority={true} objectFit="contain" layout={width > 640 ? 'fill' : null} />
        <video
          ref={videoRef}
          className={`${humanDetected ? '' : 'hidden'} w-9/12 sm:h-screen`}
          autoPlay
          // muted
          onPlaying={() => setIsVideoPlaying(true)}
          onEnded={() => setIsVideoPlaying(false)}
        >
          <source src="assets/normal_to_ghost.mp4" type="video/mp4" />
        </video>
        <Image src={frame} alt="Frame" priority={true} className="center-absolute w-full sm:h-full sm:w-auto" />
      </div>
  </div>;
}
