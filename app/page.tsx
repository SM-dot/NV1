"use client";

import { useState } from 'react';

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [level, setLevel] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [mode, setMode] = useState('');

  const startQuiz = async () => {
    setQuizStarted(true);
    try {
      const response = await fetch('/api/assess', { method: 'POST', body: JSON.stringify({}) });
      const data = await response.json();
      setQuestion(data.question);
      setOptions(data.options);
    } catch (error) {
      setQuestion('Sample: What is the time complexity of array access?');
      setOptions(['O(1)', 'I have no idea about this topic', 'If I quickly look it up, I can probably remember']);
    }
  };

  const submitAnswer = async (answer) => {
    try {
      const response = await fetch('/api/assess-feedback', {
        method: 'POST',
        body: JSON.stringify({ question, answer }),
      });
      const data = await response.json();
      setLevel(data.level);
      setQuizCompleted(true);
    } catch (error) {
      setLevel(answer === 'I have no idea about this topic' ? 'beginner' : answer === 'If I quickly look it up, I can probably remember' ? 'intermediate' : 'advanced');
      setQuizCompleted(true);
    }
  };

  const startMode = async (selectedMode) => {
    setMode(selectedMode);
    setQuizCompleted(false);
    setQuizStarted(true);
    setFeedback('');
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        body: JSON.stringify({ level, mode: selectedMode }),
      });
      const data = await response.json();
      setQuestion(data.question);
      setOptions(data.options);
    } catch (error) {
      setQuestion('Sample: Reverse a string');
      setOptions(['Loop from end', 'I have no idea about this topic', 'If I quickly look it up, I can probably remember']);
    }
  };

  const submitModeAnswer = async (answer) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ question, answer }),
      });
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      setFeedback('Sample explanation: To reverse a string, iterate from the end to the start.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Gamified DSA Quiz Platform</h1>
      {!quizStarted && !quizCompleted && (
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          onClick={startQuiz}
        >
          Start Level Assessment
        </button>
      )}
      {quizStarted && !quizCompleted && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{question || 'Loading...'}</h2>
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => (mode ? submitModeAnswer(option) : submitAnswer(option))}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-800">Explanation:</h3>
              <p className="text-gray-700">{feedback}</p>
            </div>
          )}
        </div>
      )}
      {quizCompleted && !mode && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Level: {level}</h2>
          <div className="space-y-3">
            <button
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              onClick={() => startMode('1-hour')}
            >
              1-Hour Interview Prep
            </button>
            <button
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              onClick={() => startMode('1-day')}
            >
              1-Day Interview Prep
            </button>
            <button
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              onClick={() => startMode('consistency')}
            >
              Build Consistency
            </button>
          </div>
        </div>
      )}
    </div>
  );
}