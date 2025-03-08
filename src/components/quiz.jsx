"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function QuizPage() {
  return (
    <div id='quiz' className="quiz-page">
      <Head>
        <title>Test Your Knowledge - General Quiz</title>
        <meta name="description" content="Test your general knowledge with our interactive quiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="page-title">Test Your Knowledge</h1>
        <p className="page-description">
          Challenge yourself with these true/false general knowledge questions!
        </p>

        <GeneralKnowledgeQuiz />
      </main>

      <style jsx>{`
        .quiz-page {
          padding: 0 1rem;
        }

        main {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem 0;
        }

        .page-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .page-description {
          text-align: center;
          color: #666;
          margin-bottom: 3rem;
        }

        footer {
          text-align: center;
          padding: 2rem 0;
          color: #888;
        }
      `}</style>
    </div>
  );
}

// Sample questions to use as fallback if API fails
const FALLBACK_QUESTIONS = [
  {
    question: "The Great Wall of China is visible from the Moon.",
    correct_answer: "False",
    category: "General Knowledge",
    difficulty: "medium"
  },
  {
    question: "The capital of Australia is Sydney.",
    correct_answer: "False",
    category: "General Knowledge",
    difficulty: "easy"
  },
  {
    question: "Water boils at 100 degrees Celsius at sea level.",
    correct_answer: "True",
    category: "General Knowledge",
    difficulty: "easy"
  },
  {
    question: "Mount Everest is the tallest mountain in the world.",
    correct_answer: "True",
    category: "General Knowledge",
    difficulty: "easy"
  },
  {
    question: "The Mona Lisa has no eyebrows.",
    correct_answer: "True",
    category: "General Knowledge",
    difficulty: "medium"
  },
  {
    question: "Humans can distinguish between over one trillion different smells.",
    correct_answer: "True",
    category: "General Knowledge",
    difficulty: "hard"
  },
  {
    question: "The shortest war in history lasted for 38 minutes.",
    correct_answer: "True",
    category: "General Knowledge",
    difficulty: "medium"
  },
  {
    question: "The Big Apple is a nickname given to Washington D.C.",
    correct_answer: "False",
    category: "General Knowledge",
    difficulty: "easy"
  },
  {
    question: "Goldfish have a memory span of three seconds.",
    correct_answer: "False",
    category: "General Knowledge",
    difficulty: "medium"
  },
  {
    question: "The element with the chemical symbol 'Au' is silver.",
    correct_answer: "False",
    category: "General Knowledge",
    difficulty: "medium"
  }
];

// GeneralKnowledgeQuiz component
const GeneralKnowledgeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buttonsEnabled, setButtonsEnabled] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // Improved fetch with timeout function
        const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
          return new Promise(async (resolve, reject) => {
            // Create abort controller for timeout
            const controller = new AbortController();
            const { signal } = controller;
            
            // Set timeout to abort fetch if it takes too long
            const timeoutId = setTimeout(() => {
              controller.abort();
              reject(new Error('Request timed out'));
            }, timeout);
            
            try {
              // Attempt the fetch with the abort signal
              const response = await fetch(url, { ...options, signal });
              clearTimeout(timeoutId);
              resolve(response);
            } catch (error) {
              clearTimeout(timeoutId);
              reject(error);
            }
          });
        };

        // Use a short delay before fetching to ensure component is fully mounted
        const fetchTimer = setTimeout(async () => {
          try {
            const response = await fetchWithTimeout(
              'https://opentdb.com/api.php?amount=10&category=9&type=boolean',
              {},
              8000 // 8 second timeout
            );

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.response_code !== 0 || !data.results || data.results.length === 0) {
              throw new Error('Invalid response from API');
            }

            setQuestions(data.results);
            setLoading(false);
          } catch (fetchError) {
            console.error('Error fetching questions from API:', fetchError);
            // Use fallback questions instead
            setQuestions(FALLBACK_QUESTIONS);
            setUsingFallback(true);
            setLoading(false);
          }
        }, 1000);

        // Cleanup function to clear timers if component unmounts
        return () => clearTimeout(fetchTimer);
        
      } catch (mainError) {
        console.error('Error in main fetch function:', mainError);
        setError('Failed to load questions. Using local questions instead.');
        setQuestions(FALLBACK_QUESTIONS);
        setUsingFallback(true);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = async (selectedValue) => {
    if (!buttonsEnabled || quizCompleted) return;

    setButtonsEnabled(false);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedValue === currentQuestion.correct_answer.toLowerCase();

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    // Wait for "animation" (simulating your delay)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Move to next question
    if (currentQuestionIndex + 1 >= questions.length) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }

    setButtonsEnabled(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setButtonsEnabled(true);
    setLoading(true);

    // If we previously used fallback questions, just reuse them instead of trying API again
    if (usingFallback) {
      // Shuffle the fallback questions for variety
      const shuffled = [...FALLBACK_QUESTIONS].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setLoading(false);
      return;
    }

    // Improved fetch logic for restarting the quiz
    let fetchTimerId = null;
    
    try {
      // Fetch new questions
      fetchTimerId = setTimeout(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const response = await fetch(
            'https://opentdb.com/api.php?amount=10&category=9&type=boolean', 
            { signal: controller.signal }
          );
          
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          if (data.response_code !== 0 || !data.results || data.results.length === 0) {
            throw new Error('Invalid response from API');
          }

          setQuestions(data.results);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching questions:', error);
          setError('Failed to load online questions. Using local questions instead.');
          // Use fallback questions
          setQuestions(FALLBACK_QUESTIONS);
          setUsingFallback(true);
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Error in restart quiz:', error);
      setQuestions(FALLBACK_QUESTIONS);
      setUsingFallback(true);
      setLoading(false);
    }

    // Return cleanup function
    return () => {
      if (fetchTimerId) clearTimeout(fetchTimerId);
    };
  };

  // Decode HTML entities (the API sometimes returns encoded HTML)
  const decodeHTML = (html) => {
    if (typeof document === 'undefined') {
      // Server-side rendering fallback
      return html?.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'") || '';
    }

    const textarea = document.createElement('textarea');
    textarea.innerHTML = html || '';
    return textarea.value;
  };

  return (
    <div className="quiz-container">
      <h2>Test Your Knowledge</h2>
      {usingFallback && (
        <div className="fallback-notice">
          Using offline questions due to connection issues.
        </div>
      )}
      <div className="score-display">
        Score: <span>{score}</span>
      </div>

      <div className="question-container">
        {loading ? (
          <div className="loading">Loading questions...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : quizCompleted ? (
          <div className="quiz-completed">
            <h3>Quiz Completed!</h3>
            <p>Final Score: {score}/{questions.length}</p>
            <button
              className="restart-button"
              onClick={restartQuiz}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="question">
              <h3>Question {currentQuestionIndex + 1}:</h3>
              <p>{questions[currentQuestionIndex] && decodeHTML(questions[currentQuestionIndex].question)}</p>
            </div>

            <div className="options">
              <button
                className={`option-button true-button`}
                onClick={() => handleAnswerClick('true')}
                disabled={!buttonsEnabled}
              >
                True
              </button>
              <button
                className={`option-button false-button`}
                onClick={() => handleAnswerClick('false')}
                disabled={!buttonsEnabled}
              >
                False
              </button>
            </div>

            <div className="question-progress">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="foot flex justify-between items-center flex-col pt-10">
              <p>Want Quiz on Specific Topic</p>
              <a href="https://chiragsingh11.github.io/Quiz/">
              <button className="before:ease relative h-12 w-40 overflow-hidden border border-blue-500 bg-blue-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-blue-500 hover:before:-translate-x-40 cursor-pointer">
                <span relative="relative z-10">Click Here</span>
              </button></a>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .quiz-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .fallback-notice {
          background-color: #fff3cd;
          color: #856404;
          padding: 8px 12px;
          margin-bottom: 15px;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
        }
        
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        
        .score-display {
          text-align: right;
          padding: 10px;
          font-size: 18px;
          font-weight: bold;
        }
        
        .question-container {
          margin: 20px 0;
          min-height: 200px;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          font-style: italic;
        }
        
        .error-message {
          color: red;
          text-align: center;
          padding: 20px;
        }
        
        .question {
          margin-bottom: 20px;
        }
        
        .question h3 {
          color: #555;
          margin-bottom: 10px;
        }
        
        .question p {
          font-size: 18px;
          line-height: 1.5;
        }
        
        .options {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }
        
        .option-button {
          padding: 10px 30px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
        }
        
        .option-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .true-button {
          background-color: #4caf50;
          color: white;
        }
        
        .false-button {
          background-color: #f44336;
          color: white;
        }
        
        .option-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .question-progress {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        
        .quiz-completed {
          text-align: center;
          padding: 20px;
        }
        
        .quiz-completed h3 {
          color: #2196f3;
          margin-bottom: 10px;
        }
        
        .quiz-completed p {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        
        .restart-button {
          padding: 10px 25px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .restart-button:hover {
          background-color: #0b7dda;
        }
      `}</style>
    </div>
  );
};