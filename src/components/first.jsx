"use client";
import React from 'react'

const First = () => {
  const scrollToQuiz = () => {
    const quizSection = document.getElementById('quiz');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className='bg-gradient-to-r from-blue-500 to-blue-900 h-60 flex justify-center items-center text-cyan-50 rounded-3xl'>
      <div className="content flex flex-col">
        <h2 className='text-4xl flex justify-center items-center p-4'>Ace Your Exams with ExamAce</h2>
        <p className='text-center px-4'>Comprehensive exam preparation tools to help you study smarter, not harder. Interactive quizzes, study resources, and time management tools all in one place.</p>
        <button onClick={scrollToQuiz} className='bg-cyan-50 text-blue-700 py-2 px-6 rounded-full mt-4 hover:bg-blue-700 hover:text-cyan-50 transition duration-300'>Take a Quiz</button>
      </div>
    </div>
  )
}

export default First;
