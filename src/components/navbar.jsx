"use client";
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(76);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Function to handle smooth scrolling with offset
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Get navbar height to adjust scroll position (add extra padding)
      const offset = navHeight + 24; // Adding extra padding so content is clearly visible
      
      // Calculate position
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      // Scroll smoothly
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      if (isOpen) {
        setIsOpen(false);
      }
    }
  };
  
  // Use useEffect to measure actual navbar height after render
  useEffect(() => {
    const updateNavHeight = () => {
      const navElement = document.getElementById('main-navbar');
      if (navElement) {
        setNavHeight(navElement.offsetHeight);
      }
    };
    
    // Initial measurement
    updateNavHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateNavHeight);
    
    return () => {
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);
  
  return (
    <>
      <header id="main-navbar" className="fixed w-full top-4 z-50 px-4">
        <div className="container mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg">
          <div className="flex justify-between items-center py-3 px-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              ExamAce
            </div>
            
            <div className="hidden md:flex">
              <div className="bg-gray-100 rounded-full px-3 py-2">
                <div className="flex space-x-1">
                  <a 
                    href="#home" 
                    onClick={(e) => handleScrollTo(e, 'home')}
                    className="px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700"
                  >
                    Home
                  </a>
                  <a 
                    href="#features" 
                    onClick={(e) => handleScrollTo(e, 'features')}
                    className="px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700"
                  >
                    Features
                  </a>
                  <a 
                    href="#quiz" 
                    onClick={(e) => handleScrollTo(e, 'quiz')}
                    className="px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700"
                  >
                    Quiz
                  </a>
                  <a 
                    href="#timer" 
                    onClick={(e) => handleScrollTo(e, 'timer')}
                    className="px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700"
                  >
                    Timer
                  </a>
                </div>
              </div>
            </div>
            
            <div className="md:hidden">
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300"
                onClick={toggleMenu}
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div
          className={`mt-2 md:hidden mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-72 opacity-100 p-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-2">
            <a 
              href="#home" 
              onClick={(e) => handleScrollTo(e, 'home')}
              className="px-4 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700 text-center"
            >
              Home
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleScrollTo(e, 'features')}
              className="px-4 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700 text-center"
            >
              Features
            </a>
            <a 
              href="#quiz" 
              onClick={(e) => handleScrollTo(e, 'quiz')}
              className="px-4 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700 text-center"
            >
              Quiz
            </a>
            <a 
              href="#timer" 
              onClick={(e) => handleScrollTo(e, 'timer')}
              className="px-4 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-700 text-center"
            >
              Timer
            </a>
          </div>
        </div>
      </header>
      
      {/* Dynamic spacer div that matches the actual navbar height plus some extra space */}
      <div style={{ height: `${navHeight + 32}px` }}></div>
    </>
  );
};

export default Navbar;