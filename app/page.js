"use client";
import DetectFace from "@/components/DetectFace";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import normalImage from "@/public/assets/normal_image.png";
import frame from "@/public/assets/frame.png";
import useWindowSize from "@/hooks/useWindowSize";
import Link from 'next/link'

export default function Home() {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
      <div>
        <div className="relative-parent flex flex-col justify-center items-center h-screen">
          <h1 className="text-red-600 text-8xl p-4 mb-8 font-creepster">Long Lost Memory</h1>
          <p className="font-rubik text-slate-400">Recall the hidden details from ancient, eerie drawings. Answer 2 out of 3 questions correctly to escape.</p>
          <br></br>
          <p><b>How to Play:</b> You will glimpse 5 drawings, one by one. Each image will disappear after a brief. After each image vanishes, a question will emerge, probing your memory for details lost to time. No second chances—rely on your wits alone. Answer at least 4 questions correctly to survive the trial.</p>
          <Link className="bg-blue-500 hover:bg-blue-700 text-white font-rubik my-4 py-2 px-4 rounded" href="/quiz">Play Game</Link>
        </div>
      </div>
    </div>
  </div>;

}
