//App.jsx
import { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import MainContent from "./Components/MainContent";
import { API_URL } from "./constants";
import { getVisibleSteps } from "./Components/stepConfig";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // SIM selection
    simType: "physical",
    simNumber: "",

    // Number selection
    numberType: "",
    // numberType: "new",
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
    paymentToken: '',
    isNumberVerified: false,

    // Number selection (if new number)
    // selectedState: null,
    selectedNumber: null,
  });
  const [steps, setSteps] = useState(() => getVisibleSteps(formData));

  const handleNextStep = () => {
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    setCurrentStep(prevStep => prevStep + 1);
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

  const handleFinalSubmit = async () => {

    try {
      if (isFormSubmitted) return;
      // Here you would typically send the formData to your server
      // const response = await fetch(`${API_URL}/activateNewNumber`, {
      const response = await fetch(`${API_URL}/orders/activate${formData.numberType == "new" ? '' : '/port'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: formData.selectedNumber,
          planNo: formData.isUpgraded ? "11145178" : "11144638",
          cust: {
            suburb: formData.suburb,
            custNo: formData.custNo,
            postcode: formData.postcode,
            address: formData.address,
            email: formData.email
          }
        }),
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
    } finally {
      setFormSubmitted(true)
      handleNextStep()
    }
  };

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
          handleSubmit={handleFinalSubmit}
          isFormSubmitted={isFormSubmitted}
        />
      </div>
    </div>
  );
}