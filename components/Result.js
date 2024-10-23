const Result = ({correctAnswers}) => (
  <div className="flex flex-col items-center justify-center h-screen text-center p-8 font-rubik">
    <p className="text-xl mb-4">
      You got {correctAnswers} out of 3 questions correct.
    </p>
    <p className="text-red-600 text-8xl mb-8 font-creepster">
      Result: {correctAnswers >= 2 ? 'Pass' : 'Fail'}
    </p>
  </div>
);

export default Result;