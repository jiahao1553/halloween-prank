import Link from "next/link";
import { useEffect, useRef } from "react";

const Result = ({ correctAnswers }) => {
  const evilLaugh = useRef(null);

  useEffect(() => {
    evilLaugh.current.play();
  })

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8 font-rubik">
      <audio src="/assets/evil_laugh.mp3" ref={evilLaugh} />
      <p className="text-xl mb-4">
        You got {correctAnswers} out of 5 questions correct.
      </p>
      <p className="text-red-600 text-8xl mb-8 font-creepster">
        Result: {correctAnswers >= 4 ? 'Pass' : 'Fail'}
      </p>
      <Link className="bg-blue-500 hover:bg-blue-700 text-white font-rubik my-4 py-2 px-4 rounded" href="/">Go Home</Link>
    </div>
  )
};

export default Result;