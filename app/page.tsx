'use client'

import { useState, useEffect } from "react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const questionsData: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris"
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4"
  }
];

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  const handleAnswer = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    if (questions.length > 0 && selectedOption === questions[currentQuestionIndex]?.answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestionIndex(nextQuestion);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold">Practice Exam</h1>
      {showResults ? (
        <div className="text-xl mt-4">Final Score: {score}/{questions.length}</div>
      ) : (
        <div className="mt-4 p-4 border rounded-lg shadow-lg">
          {questions.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold">{questions[currentQuestionIndex]?.question}</h2>
              <div className="mt-4 space-y-2">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`block w-full p-2 border rounded-lg hover:bg-gray-200 ${selectedOption === option ? (option === questions[currentQuestionIndex]?.answer ? 'bg-green-300' : 'bg-red-300') : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-between w-full">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  className="p-2 border rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
}
