"use client";
import DetectFace from "@/components/DetectFace";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import normalImage from "@/public/assets/normal_image.png";
import frame from "@/public/assets/frame.png";

export default function Home() {
  const [humanDetected, setHumanDetected] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

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

  return <>
    <DetectFace onDetect={handleFaceDetect} />
    <div className="flex justify-center items-center h-screen">
      <Image className={!humanDetected ? '' : 'hidden'} src={normalImage} alt="Normal Image" width={500} height={500} priority={true} />
      <video
        ref={videoRef}
        className={humanDetected ? '' : 'hidden'}
        width="500"
        autoPlay
        onPlaying={() => setIsVideoPlaying(true)}
        onEnded={() => setIsVideoPlaying(false)}
      >
        <source src="assets/normal_to_ghost.mp4" type="video/mp4" />
      </video>
      <Image src={frame} alt="Frame" width={500} priority={true} style={{
        position: "absolute", left: 0, right: 0, marginInline: "auto",
        width: "fit-content", zIndex: 1
      }} />
    </div>
  </>;

}
