import { useRouter } from 'next/navigation';

const Status = ({ currentQuestion, timeRemaining, correctAnswers }) => {
  const router = useRouter();

  return (
    <header className="flex justify-between font-rubik">
      <div className="text-left">
        <div>Question: {currentQuestion}</div>
        {timeRemaining !== 0 && <div className='text-red-600'>Time Remaining: {timeRemaining} seconds</div>}
      </div>
      <div className="text-right">
        <div>Correct Answers: {correctAnswers}</div>
      </div>
    </header>
  );
};

export default Status;