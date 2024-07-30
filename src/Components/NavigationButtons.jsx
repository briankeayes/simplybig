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
          color="default"
          onClick={handlePrevStep}
          className="px-6 py-2"
        >
          Back
        </Button>
      )}
      {showNextButton && (
        <Button
          color="primary"
          onClick={handleNextStep}
          disabled={isNextDisabled}
          className={`px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 ${currentStep === 0 ? 'ml-auto' : ''}`}
        >
          {nextButtonText}
        </Button>
      )}
    </div>
  );
}