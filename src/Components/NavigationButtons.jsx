//NavigationButtons.jsx
import React from "react";
import { Button } from "@nextui-org/react";

export default function NavigationButtons({
  currentStep,
  handlePrevStep,
  handleNextStep,
  isNextDisabled = false,
  nextButtonText = "Next",
  showNextButton = true
}) {
  return (
    <div className="flex justify-between mt-8 w-full">
      {currentStep > 0 && (
        <Button
          onClick={handlePrevStep}
          className="px-6 py-2 bg-indigo text-white 
                     hover:bg-iris
                     transition-all duration-300
                     border-2 border-transparent hover:border-cloud-nine"
        >
          Back
        </Button>
      )}
      {showNextButton && (
        <Button
          onClick={handleNextStep}
          isDisabled={isNextDisabled}
          className={`px-6 py-2 bg-indigo text-white 
                      hover:bg-iris
                      transition-all duration-300
                      border-2 border-transparent hover:border-cloud-nine
                      ${currentStep === 0 ? 'ml-auto' : ''}
                      ${isNextDisabled ? 'opacity-50 cursor-not-allowed hover:bg-ocean hover:border-transparent' : ''}`}
        >
          {nextButtonText}
        </Button>
      )}
    </div>
  );
}