//App.jsx
import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Components/Sidebar";
import MainContent from "./Components/MainContent";
import { getVisibleSteps } from "./Components/stepConfig";
import { sendWebhook } from "./utils/fetcher";
import { sendStepData, sendStepStarted } from "./utils/tracking";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    // SIM selection
    simType: "",
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

  const handleNextStep = (updatedData = null) => {
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    sendStepDataToAPI(steps[currentStep].key, updatedData || formData);
    
    // Send step_started for the next step with a small delay to ensure proper ordering
    if (nextStep > 0 && steps[nextStep]) {
      setTimeout(() => {
        sendStepStartedToAPI(steps[nextStep].key, updatedData || formData);
      }, 500);
    }
  };

  const handlePrevStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    
    // Send step_started for the previous step with a small delay
    if (prevStep >= 0 && steps[prevStep]) {
      setTimeout(() => {
        sendStepStartedToAPI(steps[prevStep].key, formData);
      }, 500);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setSteps(getVisibleSteps(formData));
    console.log("formData", formData);
  }, [formData]);

  const generateSessionId = () => {
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 9);

    return sessionId;
  };

  const [sessionId, setSessionId] = useState(localStorage.getItem('simplyBigSessionId') || generateSessionId());

  useEffect(() => {
    if (sessionId) {
      sendWebhook('session_started', sessionId, 'welcome');
    }
  }, [sessionId]);

  // Simple wrappers that pass sessionId to utils functions
  const sendStepDataToAPI = (stepKey, data, eventType = 'step_completed') => {
    sendStepData(stepKey, data, sessionId, eventType);
  };

  const sendStepStartedToAPI = (stepKey, data) => {
    sendStepStarted(stepKey, data, sessionId);
  };

  //convert to useCallback
  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    setInactivityTimeout(setTimeout(() => {
      console.log('Session expired due to inactivity');
      localStorage.removeItem('simplyBigSessionId');
      setSessionId(generateSessionId());
    }, 30 * 60 * 1000)); // 30 minutes
  }, []);

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
          sendStepDataToAPI={sendStepDataToAPI}
        />
      </div>
    </div>
  );
}