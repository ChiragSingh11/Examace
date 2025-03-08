import React from 'react';

const EducationalFeatureCards = () => {
  return (
    <div id='features' className="w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Practice Quizzes Card */}
        <div className="bg-gray-50 p-8 rounded-md shadow-sm flex flex-col items-center text-center">
          <div className="mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="6" width="24" height="28" rx="2" fill="#f0f0f0" stroke="#666" strokeWidth="1.5"/>
              <path d="M14 14H26M14 20H26M14 26H20" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="28" cy="28" r="6" fill="#FF5757"/>
              <path d="M26 28L30 28M28 26L28 30" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Practice Quizzes</h2>
          <p className="text-gray-700">
            Test your knowledge with our extensive collection of practice quizzes across various subjects and topics.
          </p>
        </div>
        
        {/* Study Timer Card */}
        <div className="bg-gray-50 p-8 rounded-md shadow-sm flex flex-col items-center text-center">
          <div className="mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="14" fill="#f0f0f0" stroke="#666" strokeWidth="1.5"/>
              <path d="M20 12V20L25 25" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="18" y="6" width="4" height="2" rx="1" fill="#666"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Study Timer</h2>
          <p className="text-gray-700">
            Manage your study sessions effectively with our customizable study timer and track your progress.
          </p>
        </div>
        
        {/* Study Resources Card */}
        <div className="bg-gray-50 p-8 rounded-md shadow-sm flex flex-col items-center text-center">
          <div className="mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="16" height="20" rx="1" fill="#7ED957" stroke="#666" strokeWidth="0.5"/>
              <rect x="14" y="14" width="16" height="20" rx="1" fill="#3F9BFF" stroke="#666" strokeWidth="0.5"/>
              <rect x="18" y="18" width="16" height="20" rx="1" fill="#FF5757" stroke="#666" strokeWidth="0.5"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Quiz on Specific topic</h2>
          <p className="text-gray-700">
          Access a wide range of quizzes on your desired topic.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default EducationalFeatureCards;