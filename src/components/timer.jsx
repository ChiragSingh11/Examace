'use client';

import React, { useState, useEffect } from 'react';

const StudyTimer = () => {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Helper function to safely get from localStorage
  const getFromStorage = (key, defaultValue) => {
    if (!isBrowser) return defaultValue;
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    
    try {
      // Handle boolean strings first
      if (stored === 'true') return true;
      if (stored === 'false') return false;
      
      // Try to parse as number if it looks like a number
      if (!isNaN(stored) && stored.trim() !== '') {
        return Number(stored);
      }
      // Try to parse as JSON if it starts with [ or {
      if (stored.startsWith('[') || stored.startsWith('{')) {
        return JSON.parse(stored);
      }
      // Otherwise return as is
      return stored;
    } catch (e) {
      console.error(`Error parsing localStorage item ${key}:`, e);
      return defaultValue;
    }
  };

  // Timer states with safe localStorage initialization
  const [timerMode, setTimerMode] = useState('focus'); // Default without localStorage
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  
  // Settings states with default values
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  
  // Progress tracking states with default values
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(120); // Minutes
  const [studyHistory, setStudyHistory] = useState([]);

  // Initialize values from localStorage after component mounts
  useEffect(() => {
    if (isBrowser) {
      setTimerMode(getFromStorage('timerMode', 'focus'));
      setTimeLeft(getFromStorage('timeLeft', 25 * 60));
      setInitialTime(getFromStorage('initialTime', 25 * 60));
      setFocusTime(getFromStorage('focusTime', 25));
      setBreakTime(getFromStorage('breakTime', 5));
      setSessionsCompleted(getFromStorage('sessionsCompleted', 0));
      setTotalStudyTime(getFromStorage('totalStudyTime', 0));
      setDailyGoal(getFromStorage('dailyGoal', 120));
      setStudyHistory(getFromStorage('studyHistory', []));
    }
  }, [isBrowser]);

  // Save states to local storage whenever they change
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('timerMode', timerMode);
    }
  }, [timerMode, isBrowser]);

  useEffect(() => {
    if (isBrowser && timeLeft) {
      localStorage.setItem('timeLeft', timeLeft.toString());
    }
  }, [timeLeft, isBrowser]);

  useEffect(() => {
    if (isBrowser && initialTime) {
      localStorage.setItem('initialTime', initialTime.toString());
    }
  }, [initialTime, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('focusTime', focusTime.toString());
    }
  }, [focusTime, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('breakTime', breakTime.toString());
    }
  }, [breakTime, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('sessionsCompleted', sessionsCompleted.toString());
    }
  }, [sessionsCompleted, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('totalStudyTime', totalStudyTime.toString());
    }
  }, [totalStudyTime, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('dailyGoal', dailyGoal.toString());
    }
  }, [dailyGoal, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('studyHistory', JSON.stringify(studyHistory));
    }
  }, [studyHistory, isBrowser]);

  // Check if it's a new day and reset daily counters
  useEffect(() => {
    if (!isBrowser) return;
    
    const checkNewDay = () => {
      const lastDate = localStorage.getItem('lastActiveDate');
      const today = new Date().toDateString();
      
      if (lastDate && lastDate !== today) {
        // It's a new day, reset daily counters
        setTotalStudyTime(0);
        setSessionsCompleted(0);
        setStudyHistory([]);
      }
      
      localStorage.setItem('lastActiveDate', today);
    };
    
    checkNewDay();
    
    // Also check when the window becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkNewDay();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isBrowser]);

  // Effect for timer countdown
  useEffect(() => {
    if (!isBrowser) return;
    
    let intervalId;
    
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // If focus mode is running, increment total study time
          if (timerMode === 'focus') {
            setTotalStudyTime(prev => prev + 1/60);
          }
          
          // Add to study history every minute
          if (prevTime % 60 === 0 && timerMode === 'focus') {
            const now = new Date();
            setStudyHistory(prev => [...prev, {
              timestamp: now.toISOString(),
              mode: timerMode
            }]);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalId);
      
      // Switch modes when timer ends
      if (timerMode === 'focus') {
        setSessionsCompleted(prev => prev + 1);
        setTimerMode('break');
        setTimeLeft(breakTime * 60);
        setInitialTime(breakTime * 60);
      } else {
        setTimerMode('focus');
        setTimeLeft(focusTime * 60);
        setInitialTime(focusTime * 60);
      }
    }
    
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, timerMode, focusTime, breakTime, isBrowser]);

  // Format time for display
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };
  
  // Calculate daily goal progress
  const calculateDailyProgress = () => {
    return Math.min((totalStudyTime / dailyGoal) * 100, 100);
  };
  
  // Timer controls
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerMode === 'focus' ? focusTime * 60 : breakTime * 60);
  };
  
  // Switch between focus and break modes
  const switchMode = () => {
    setIsRunning(false);
    if (timerMode === 'focus') {
      setTimerMode('break');
      setTimeLeft(breakTime * 60);
      setInitialTime(breakTime * 60);
    } else {
      setTimerMode('focus');
      setTimeLeft(focusTime * 60);
      setInitialTime(focusTime * 60);
    }
  };

  // Apply settings
  const applySettings = () => {
    setTimeLeft(timerMode === 'focus' ? focusTime * 60 : breakTime * 60);
    setInitialTime(timerMode === 'focus' ? focusTime * 60 : breakTime * 60);
    setShowSettings(false);
  };

  // Reset all data in local storage
  const resetAllData = () => {
    if (!isBrowser) return;
    
    const confirmReset = window.confirm('Are you sure you want to reset all your study data and settings?');
    if (confirmReset) {
      // Stop the timer
      setIsRunning(false);
      
      // Reset all states to defaults
      setTimerMode('focus');
      setTimeLeft(25 * 60);
      setInitialTime(25 * 60);
      setFocusTime(25);
      setBreakTime(5);
      setSessionsCompleted(0);
      setTotalStudyTime(0);
      setDailyGoal(120);
      setStudyHistory([]);
      
      // Clear all localStorage items related to the timer
      localStorage.removeItem('timerMode');
      localStorage.removeItem('timeLeft');
      localStorage.removeItem('initialTime');
      localStorage.removeItem('focusTime');
      localStorage.removeItem('breakTime');
      localStorage.removeItem('sessionsCompleted');
      localStorage.removeItem('totalStudyTime');
      localStorage.removeItem('dailyGoal');
      localStorage.removeItem('studyHistory');
      
      // Keep track of the last active date
      localStorage.setItem('lastActiveDate', new Date().toDateString());
    }
  };

  return (
    <div id='timer' className="flex flex-col w-full max-w-md mx-auto p-6 bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-sky-700 text-center mb-4">Study Timer</h2>
      
      {/* Timer Display */}
      <div className="relative bg-white rounded-full h-48 w-48 mx-auto mb-6 flex items-center justify-center shadow-md">
        {/* Progress Circle */}
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#e6f7ff" 
            strokeWidth="8"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={timerMode === 'focus' ? '#38bdf8' : '#4ade80'} 
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * calculateProgress() / 100)}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="z-10 flex flex-col items-center">
          <span className="text-4xl font-mono font-bold text-sky-800">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm uppercase font-bold text-sky-600 mt-2">
            {timerMode === 'focus' ? 'Focus' : 'Break'}
          </span>
        </div>
      </div>
      
      {/* Timer Controls */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button 
          onClick={startTimer} 
          disabled={isRunning}
          className={`py-2 px-4 rounded-lg transition duration-200 focus:outline-none ${
            isRunning 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
        >
          Start
        </button>
        <button 
          onClick={pauseTimer} 
          disabled={!isRunning}
          className={`py-2 px-4 rounded-lg transition duration-200 focus:outline-none ${
            !isRunning 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-sky-400 hover:bg-sky-500 text-white'
          }`}
        >
          Pause
        </button>
        <button 
          onClick={resetTimer}
          className="bg-sky-300 hover:bg-sky-400 text-white py-2 px-4 rounded-lg transition duration-200 focus:outline-none"
        >
          Reset
        </button>
      </div>
      
      {/* Mode Switch */}
      <button 
        onClick={switchMode} 
        className={`mb-6 py-2 px-4 rounded-lg transition duration-200 focus:outline-none ${
          timerMode === 'focus' 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Switch to {timerMode === 'focus' ? 'Break' : 'Focus'} Mode
      </button>
      
      {/* Progress Tracking */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-sky-700 mb-3">Today's Progress</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Daily Goal: {Math.round(totalStudyTime)} / {dailyGoal} minutes</span>
              <span>{Math.round(calculateDailyProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-sky-600 h-2.5 rounded-full" 
                style={{ width: `${calculateDailyProgress()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-700">{sessionsCompleted}</p>
              <p className="text-xs text-gray-600">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-700">{Math.round(totalStudyTime)}</p>
              <p className="text-xs text-gray-600">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-700">{studyHistory.length}</p>
              <p className="text-xs text-gray-600">Intervals</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="text-sky-700 hover:text-sky-900 font-medium flex items-center justify-center mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Settings
      </button>
      
      {/* Reset Data Button */}
      <button 
        onClick={resetAllData}
        className="text-red-600 hover:text-red-800 font-medium flex items-center justify-center mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Reset All Data
      </button>
      
      {showSettings && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-sky-700 mb-3">Timer Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Time (minutes): {focusTime}
              </label>
              <input 
                type="range" 
                min="5" 
                max="60" 
                value={focusTime} 
                onChange={(e) => setFocusTime(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break Time (minutes): {breakTime}
              </label>
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={breakTime} 
                onChange={(e) => setBreakTime(parseInt(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Goal (minutes): {dailyGoal}
              </label>
              <input 
                type="range" 
                min="30" 
                max="360" 
                step="30"
                value={dailyGoal} 
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <button 
              onClick={applySettings}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition duration-200 focus:outline-none"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;