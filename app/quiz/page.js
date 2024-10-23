"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import quizData from '@/data/quiz.json';
import Status from '@/components/Status';
import Image from 'next/image';
import Result from '@/components/Result';
import BloodTrailCursor from '@/components/BloodTrailCursor';

const Quiz = () => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Function to get random question of specific difficulty
  const getRandomQuestionByDifficulty = (difficulty) => {
    const questionsOfDifficulty = quizData.filter(q => q.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * questionsOfDifficulty.length);
    return questionsOfDifficulty[randomIndex];
  };

  // Initialize questions on component mount
  useEffect(() => {
    const selectedQuestions = [
      getRandomQuestionByDifficulty('easy'),
      getRandomQuestionByDifficulty('medium'),
      getRandomQuestionByDifficulty('hard')
    ];
    setQuestions(selectedQuestions);
    loadQuestion(selectedQuestions[0]);
  }, []);

  const loadQuestion = (question) => {
    setCurrentQuestion(question);
    setTimeRemaining(question.duration);
    setShowChoices(false);
    setTimeout(() => {
      setShowChoices(true);
    }, question.duration * 1000);
  };
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (imageLoaded && timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeRemaining, imageLoaded]);

  const handleAnswer = (choice) => {
    if (choice === currentQuestion.answer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < 3) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        loadQuestion(questions[currentQuestionIndex + 1]);
      } else {
        setShowResult(true);
        setTimeout(() => {
          router.push('/');
        }, 10000);
      }
    }, 2000);
  };

  if (showResult) {
    return <Result correctAnswers={correctAnswers} />;
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="relative h-screen overflow-hidden">
      <BloodTrailCursor/>
      <div className="bg-gray-800 h-16 sticky top-0 p-2">
        <Status
          currentQuestion={`${currentQuestionIndex + 1} (ID: ${currentQuestion.image.replace('/images/', '').replace('.png', '')})`}
          correctAnswers={correctAnswers}
          timeRemaining={timeRemaining}
        />
      </div>
      <div className="flex flex-col justify-center items-center h-full">
        {!showChoices ? (
          <div className="flex-grow flex items-center justify-center w-full p-4">
            <div className="relative w-full" style={{ height: '90vh' }}>
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