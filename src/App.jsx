import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import MainContent from "./Components/MainContent";
import { API_URL } from "./constants";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    // SIM selection
    simType: null,

    // Number selection
    numberType: null,
    newNumber: null,
    existingNumber: null,

    // Account details
    firstName: "",
    surname: "",
    email: "",
    sal: "",
    preferredContactMethod: "",
    dob: "",
    custType: "",

    // Company info (if needed)
    companyName: "",
    companySize: "",

    // Plan selection
    selectedPlan: null,

    // Number selection (if new number)
    selectedState: null,
    selectedNumber: null,
  });
  const handleNextStep = () => {
    // if (formData.custType === "I" && currentStep === 3) {
    //   setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    //   setCurrentStep(prevStep => prevStep + 2);
    //   return;
    // }
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePrevStep = () => {
    // if (formData.custType === "I" && currentStep === 5) {
    //   setCurrentStep(prevStep => prevStep - 2);
    //   return;
    // }
    setCurrentStep(prevStep => prevStep - 1);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Here you would typically send the formData to your server
      const response = await fetch(`${API_URL}/addcustomer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Submission successful:', result);
      // Handle successful submission (e.g., show a success message, redirect user)
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-1">
        <Sidebar
          currentStep={currentStep}
          handlePrevStep={handlePrevStep}
          setCurrentStep={setCurrentStep}
          completedSteps={completedSteps}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <MainContent
          currentStep={currentStep}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          formData={formData}
          updateFormData={updateFormData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}