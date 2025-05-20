//App.jsx
import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Components/Sidebar";
import MainContent from "./Components/MainContent";
import { getVisibleSteps } from "./Components/stepConfig";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    // SIM selection
    simType: "physical",
    simNumber: "",

    // Number selection
    numberType: "",
    newNumber: "",
    existingNumber: "",
    availableNumbers: [],
    // Account details
    firstName: "",
    surname: "",
    email: "",
    sal: "",
    preferredContactMethod: "Email",
    dob: "",
    custType: "R",
    suburb: "",
    state: "",
    postcode: "",
    phoneNumber: "",
    // Plan selection
    selectedPlan: null,
    isUpgraded: false,
    provider: "",
    paymentToken: "",
    isNumberVerified: false,

    // Number selection (if new number)
    selectedNumber: null,


    // Tracking Data
    numType: "",
    custNo: "",
    sign: "",
    portingNumber: "",
    arn: "",
    dob_port: "",
    orderNo: "",
  });
  const [steps, setSteps] = useState(() => getVisibleSteps(formData));
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  const handleNextStep = () => {
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    setCurrentStep(prevStep => prevStep + 1);
    sendStepDataToAPI(currentStep, formData);
  };

  const handlePrevStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setSteps(getVisibleSteps(formData));
  }, [formData]);

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substring(2, 9);
  };

  const [sessionId, setSessionId] = useState(localStorage.getItem('simplyBigSessionId') || generateSessionId());

  const sendStepDataToAPI = useCallback(async (stepKey, data) => {
    if (!data) return;
    try {
      const response = await fetch(`https://hook.eu2.make.com/u8f97r2gc7geixmf35x8h6uaiyjebgl9`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({
          sessionId,
          stepKey,
          data
        }),
      });

      if (!response.ok) throw new Error('Failed to track step');
    } catch (error) {
      console.error('Error tracking step:', error);
    }
  }, [sessionId]);

  //convert to useCallback
  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    setInactivityTimeout(setTimeout(() => {
      console.log('Session expired due to inactivity');
      localStorage.removeItem('simplyBigSessionId');
      setSessionId(generateSessionId());
    }, 30 * 60 * 1000)); // 30 minutes
  }, [inactivityTimeout]);

  useEffect(() => {
    localStorage.setItem('simplyBigSessionId', sessionId);
  }, [sessionId]);

  // useEffect(() => {
  //   sendStepDataToAPI(currentStep, formData);
  // }, [formData, currentStep, sendStepDataToAPI]);

  useEffect(() => {
    resetInactivityTimeout();
    window.addEventListener('mousemove', resetInactivityTimeout);
    window.addEventListener('keypress', resetInactivityTimeout);
    return () => {
      window.removeEventListener('mousemove', resetInactivityTimeout);
      window.removeEventListener('keypress', resetInactivityTimeout);
    };
  }, [resetInactivityTimeout]);





  return (
    <div className="flex flex-col min-h-screen bg-ocean text-white">
      <div className="flex flex-1">
        <Sidebar
          steps={steps}
          formData={formData}
          currentStep={currentStep}
          handlePrevStep={handlePrevStep}
          setCurrentStep={setCurrentStep}
          completedSteps={completedSteps}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <MainContent
          steps={steps}
          currentStep={currentStep}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>
    </div>
  );
}