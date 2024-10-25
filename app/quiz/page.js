"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import quizData from '@/data/quiz.json';
import Status from '@/components/Status';
import Image from 'next/image';
import Result from '@/components/Result';
import BloodTrailCursor from '@/components/BloodTrailCursor';
import { Logtail } from "@logtail/browser";
const debugMode = false;
const logtail = new Logtail("xnwpQrt6L7BK3o5nyn2xsdc4");

const getQuizID = () => {
  return new Date().toISOString().replace(/-| |:|\.|T|Z/g, '');
}

const quizID = getQuizID();

const Quiz = () => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showChoiceTime, setShowChoiceTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const tick = useRef(null);
  const laugh1 = useRef(null);
  const laugh2 = useRef(null);

  // Function to get random question of specific difficulty
  const getRandomQuestionByDifficulty = (difficulty, questionsToExclude = []) => {
    const questionsOfDifficulty = quizData.filter(q => q.difficulty === difficulty && !questionsToExclude.includes(q));
    const randomIndex = Math.floor(Math.random() * questionsOfDifficulty.length);
    return questionsOfDifficulty[randomIndex];
  };

  // Initialize questions on component mount
  useEffect(() => {
    const selectedQuestions = [
      getRandomQuestionByDifficulty('easy'),
      getRandomQuestionByDifficulty('easy'),
      getRandomQuestionByDifficulty('easy'),
      getRandomQuestionByDifficulty('medium'),
      getRandomQuestionByDifficulty('hard')
    ];

    // Check for duplicate questions
    while (new Set(selectedQuestions).size !== 5) {
      const duplicates = selectedQuestions.filter((item, index) => selectedQuestions.indexOf(item) !== index);
      const duplicateIndex = selectedQuestions.indexOf(duplicates[0]);
      const newQuestion = getRandomQuestionByDifficulty(selectedQuestions[duplicateIndex].difficulty, selectedQuestions);
      selectedQuestions[duplicateIndex] = newQuestion;
    }

    setQuestions(selectedQuestions);
    loadQuestion(selectedQuestions[0]);
  }, []);

  const loadQuestion = (question) => {
    setCurrentQuestion(question);
    setTimeRemaining(question.duration);
    setShowChoices(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setTimeout(() => {
      setShowChoiceTime(new Date().toISOString());
      setShowChoices(true);
    }, !debugMode ? currentQuestion.duration * 1000 : 1000);
  };

  const getResult = (correctAnswers, totalQuestions) => {
    return correctAnswers > totalQuestions * 0.6;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (imageLoaded && timeRemaining > 1) {
        tick.current.play();
      }
      if (imageLoaded && timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeRemaining, imageLoaded]);

  const handleAnswer = (choice) => {
    setImageLoaded(false)
    if (Math.random() > 0.5) {
      laugh1.current.play();
    } else {
      laugh2.current.play();
    }

    setTimeout(() => {
      const logData = {
        quizID,
        currentQuestionIndex,
        questionImage: currentQuestion.image,
        question: currentQuestion.question,
        choice,
        correctAnswer: currentQuestion.answer,
        showChoiceTime,
        timestamp: new Date().toISOString()
      };
      if (choice === currentQuestion.answer) {
        logtail.info({ ...logData, isCorrect: true });
        setCorrectAnswers(correctAnswers + 1);
      } else {
        logtail.info({ ...logData, isCorrect: false });
      }
      if (currentQuestionIndex + 1 < 5) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        loadQuestion(questions[currentQuestionIndex + 1]);
      } else {
        setShowResult(true);
        logtail.info({ quizID, correctAnswers, totalQuestions: questions.length, result: getResult(correctAnswers, questions.length) });
        setTimeout(() => {
          router.push('/');
        }, 10000);
      }
    }, 2000);
    logtail.flush();
  };

  if (showResult) {
    return <Result result={getResult(correctAnswers, questions.length)} correctAnswers={correctAnswers} totalQuestions={questions.length} />;
  }

  if (!currentQuestion) return <p className='text-center m-5'>Loading...</p>;

  return (
    <div className="relative h-screen overflow-hidden">
      <audio src='/assets/tick.mp3' ref={tick} />
      <audio src='/assets/laugh1.mp3' ref={laugh1} />
      <audio src='/assets/laugh2.mp3' ref={laugh2} />
      <BloodTrailCursor />
      <div className="bg-gray-800 h-16 sticky top-0 p-2">
        <Status
          currentQuestion={currentQuestionIndex + 1}
          correctAnswers={`${correctAnswers}/${currentQuestionIndex}`}
          timeRemaining={timeRemaining}
        />
      </div>
      <div className="flex flex-col justify-center items-center h-full">
        {!showChoices ? (
          <div className="flex-grow flex items-center justify-center w-full p-4">
            <div className="relative w-full" style={{ height: '80vh' }}>
              {!imageLoaded && <p className='text-center m-5'>Loading your eerie drawing...</p>}
              <Image
                src={currentQuestion.image}
                alt="Quiz Image"
                priority
                layout='fill'
                objectFit='contain'
                onLoad={handleImageLoad}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen text-center p-8 font-rubik">
            <h2 className="text-4xl mb-4">
              {currentQuestion.question}
            </h2>
            <ul className="space-y-3">
              {currentQuestion.choices.map((choice, index) => (
                <li
                  key={index}
                  onClick={() => handleAnswer(choice)}
                  className="text-red-600 p-4 bg-black rounded cursor-pointer hover:bg-gray-700 transition-colors text-lg border-2 border-red-600"
                  style={{ minWidth: '300px' }}
                >
                  {choice}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;