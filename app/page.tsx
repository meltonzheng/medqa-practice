// app/page.tsx
'use client'; // Convert to client component

import { useEffect, useState } from 'react';

interface Question {
  _id: string;
  question: string;
  answer: string;
  options: Record<string, string>;
  meta_info: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Fetch questions on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/questions');
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    }
    loadQuestions();
  }, []);

  const handleAnswerSelect = (questionId: string, selectedOption: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const getOptionState = (question: Question, optionKey: string) => {
    const selected = selectedAnswers[question._id];
    if (!selected) return 'neutral';
    if (optionKey === question.answer) return 'correct';
    if (optionKey === selected) return 'incorrect';
    return 'neutral';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Medical Practice Questions</h1>
      <div className="grid gap-6">
        {questions.map((q) => (
          <div key={q._id} className="bg-gray rounded-lg shadow-md p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-500">{q.meta_info.toUpperCase()}</span>
              <h2 className="text-xl mt-2">{q.question}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(q.options).map(([letter, text]) => {
                const state = getOptionState(q, letter);
                return (
                  <div
                    key={letter}
                    onClick={() => !selectedAnswers[q._id] && handleAnswerSelect(q._id, letter)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      state === 'correct'
                        ? 'bg-green-50 border-green-300'
                        : state === 'incorrect'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${!selectedAnswers[q._id] ? 'hover:bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        state === 'correct'
                          ? 'text-green-600'
                          : state === 'incorrect'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-gray-800">{text}</span>
                      {state === 'correct' && <span className="ml-auto text-green-600">✓</span>}
                      {state === 'incorrect' && <span className="ml-auto text-red-600">✗</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedAnswers[q._id] && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                {selectedAnswers[q._id] === q.answer ? (
                  <span className="text-green-600">Correct! Well done.</span>
                ) : (
                  <span className="text-red-600">
                    Incorrect. The correct answer is {q.answer}.
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Question ID: {q._id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}