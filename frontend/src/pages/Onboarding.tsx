import React from 'react'
import img1 from '../assets/Ellipse 9.png'
import img2 from '../assets/Group 24.png'
import { Link } from 'react-router-dom';

const Onboarding = () => {

    
  return (
    // Main Container: Full viewport height, blue background is set here. 
    // Removed 'justify-center' from the parent so the content can be fixed to the bottom.
    <div className="w-full min-h-screen bg-indigo-600 relative overflow-hidden pt-16">

      {/* Floating Shapes remain absolutely positioned on the blue background */}
      <div className="absolute -top-10 right-8 md:-top-10 md:right-20 w-24 h-24 md:w-32 md:h-32 opacity-50">
        <img src={img1} alt="Ellipse 9" className="w-full h-full object-contain" />
      </div>

      <div className="absolute top-1/4 left-0 md:top-1/3 md:left-10 w-20 h-20 md:w-24 md:h-24 opacity-80">
        <img src={img2} alt="Group 24" className="w-full h-full object-contain" />
      </div>

      {/* --- White Bottom Panel (The Content Area) --- */}
      {/* FIX: This div is now absolutely positioned at the bottom (bottom-0), 
         has a fixed height (h-[40vh] or h-2/5), a white background, and rounded top corners. */}
      <div className="absolute bottom-0 w-full h-2/5 md:h-1/3 bg-white rounded-t-3xl p-6 flex flex-col  justify-center text-center">
        
        {/* Text Section */}
        <h1 className="text-2xl font-extrabold text-left text-gray-800 mb-2">
          Manage What To Do
        </h1>
        
        <p className="text-sm text-gray-500 max-w-xs text-left mb-8">
          The best way to manage what you have to do, and mange your plans.
        </p>

        {/* Get Started Button */}
        <Link to={'/home'}>
            <button type={'button'} className="w-full max-w-sm py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition transition-colors duration-200 hover:bg-indigo-700">
            Get Started
            </button>
        </Link>
        
      </div>

    </div>
  )
}

export default Onboarding;