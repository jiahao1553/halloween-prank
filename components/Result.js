import Link from "next/link";
import { useEffect, useRef } from "react";

const imagePaths = [
  "/pranks/Babadook.jpg",
  "/pranks/Clown.jpg",
  "/pranks/Demon.jpg",
  "/pranks/Ghost.jpg",
  "/pranks/Girl.jpg",
  "/pranks/Happy.jpg",
  "/pranks/Jeff.jpg",
  "/pranks/Jinn.jpg",
  "/pranks/Nun.jpg",
  "/pranks/Regan.jpg"]

const audioPaths = ["/prank_audios/Burp Scream.mp3",
  "/prank_audios/Laugh 01.mp3",
  "/prank_audios/Laugh 02.mp3",
  "/prank_audios/Laugh 03.mp3",
  "/prank_audios/Laugh 04.mp3",
  "/prank_audios/Laugh 05.mp3",
  "/prank_audios/Laugh 06.mp3",
  "/prank_audios/Scream 01.mp3",
  "/prank_audios/Scream 02.mp3",
  "/prank_audios/Scream 03.mp3",
  "/prank_audios/Scream 04.mp3",
  "/prank_audios/Scream 05.mp3",
  "/prank_audios/Scream 06.mp3",
  "/prank_audios/Scream 08.mp3",
  "/prank_audios/Scream 10.mp3",
  "/prank_audios/Scream 13.mp3"]

const Result = ({ result, correctAnswers, totalQuestions }) => {
  const evilLaugh = useRef(null);
  const imageUrl = imagePaths[Math.floor(Math.random() * imagePaths.length)];
  const audioUrl = audioPaths[Math.floor(Math.random() * audioPaths.length)];
  useEffect(() => {
    evilLaugh.current.play();
  })

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8 font-rubik">
      <audio src="/assets/evil_laugh.mp3" ref={evilLaugh} />
      <p className="text-xl mb-4">
        You got {correctAnswers} out of {totalQuestions} questions correct.
      </p>
      <audio src={audioUrl} autoPlay />
      <div className="relative-parent flex justify-center items-center h-screen">
      <img className={`w-9/12 sm:h-6/12`} src={imageUrl} alt="Normal Image" priority={true} objectFit="contain" layout={'fill'} />
        {/* <Image className={`w-9/12 sm:h-screen`} src={imageUrl} alt="Normal Image" priority={true} objectFit="contain" layout={'fill'} /> */}
      </div>
      <p className="text-red-600 text-8xl mb-8 font-creepster">
        Result: {result ? 'Pass' : 'Fail'}
      </p>
      <Link className="bg-blue-500 hover:bg-blue-700 text-white font-rubik my-4 py-2 px-4 rounded" href="/">Go Home</Link>
    </div>
  )
};

export default Result;