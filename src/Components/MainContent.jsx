import React, {useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Welcome from "./steps/Welcome";
import SelectSimType from "./steps/SelectSimType";
import SelectNumberType from "./steps/SelectNumberType";
import AccountDetails from "./steps/AccountDetails";
import SelectPlan from "./steps/SelectPlan";
import SelectNumber from "./steps/SelectNumber";
import Results from "./steps/Results";
import NavigationButtons from "./NavigationButtons";
import { API_URL } from "../constants";
import { Button, Card, CardBody } from "@nextui-org/react";


const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};
const SuccessOverlay = ({ custNo, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardBody className="text-center">
          <h2 className="text-2xl font-bold mb-4">Account Created Successfully!</h2>
          <p className="mb-4">Your customer number is:</p>
          <p className="text-3xl font-bold mb-6">{custNo}</p>
          <Button color="primary" onClick={onClose}>Continue</Button>
        </CardBody>
      </Card>
    </div>
  );
  
export default function MainContent({ currentStep, handleNextStep, handlePrevStep, formData, updateFormData, handleSubmit }) {
    const [isAccountDetailsValid, setIsAccountDetailsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [custNo, setCustNo] = useState(null);


    const handleAccountDetailsSubmit = async () => {
        if (isSubmitted){
            return handleNextStep();
        }
        if (isAccountDetailsValid) {
            setIsLoading(true);
            try {
                const customerData = {
                    address: formData.address,
                    postcode: formData.postcode,
                    state: formData.state,
                    suburb: formData.suburb,
                    custType: formData.custType,
                    email: formData.email,
                    phone: formData.phoneNumber,
                    dob: formData.dob,
                    firstName: formData.firstName,
                    surname: formData.surname,
                    preferredContactMethod: formData.preferredContactMethod,
                    sal: formData.sal
                };

                const response = await fetch(`${API_URL}/addCustomer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customer: customerData }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add customer');
                }

                const data = await response.json();
                console.log('API Response:', data);
                
                // Save the customer number in the state
                setCustNo(data.return.custNo);
                setIsSubmitted(true);
                updateFormData('custNo', data.return.custNo);
                
                // Show the success overlay
                setShowSuccessOverlay(true);
            } catch (error) {
                console.error('Error adding customer:', error);
                // Handle error (you might want to show an error message to the user)
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCloseSuccessOverlay = () => {
        setShowSuccessOverlay(false);
        handleNextStep(); // Proceed to the next step
    };
    const renderStep = () => {
        const props = {
            handleNextStep,
            handlePrevStep,
            updateFormData,
            formData
        };

        switch (currentStep) {
            case 0: return <Welcome {...props} />;
            case 1: return <SelectSimType {...props} />;
            case 2: return <SelectNumberType {...props} />;
            case 3: return <AccountDetails
                {...props}
                isLoading={isLoading}
                isSubmitted={isSubmitted}
                onValidationChange={setIsAccountDetailsValid}
            />;
            // case 4: return <CompanyInfo {...props} />;
            case 4: return <SelectPlan {...props} />;
            case 5: return <SelectNumber {...props} />;
            case 6: return <Results {...props} />;
            default: return <div>Step not implemented yet</div>;
        }
    };

    const getNextButtonDisabledState = (step, formData) => {
        switch (step) {
            case 1: return !formData.simType;
            case 2: return !formData.numberType;
            case 3: return !isAccountDetailsValid || isLoading
            // case 4: return !formData.companyName || !formData.companySize;
            case 4: return !formData.selectedPlan;
            case 5: return !formData.selectedNumber && formData.numberType === 'new';
            default: return false;
        }
    };

    const getNextButtonHandler = (step) => {
        switch (step) {
            case 3: return handleAccountDetailsSubmit;
            default: return handleNextStep;
        }
    };

    const isLastStep = currentStep === 7;
    const pageVariants = {
        initial: { opacity: 0, x: "-100%" },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: "100%" }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <div className="w-full max-w-4xl flex flex-col min-h-[80vh] justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="flex-grow flex flex-col justify-center"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
                <NavigationButtons
                    currentStep={currentStep}
                    handlePrevStep={handlePrevStep}
                    handleNextStep={getNextButtonHandler(currentStep)}
                    isNextDisabled={getNextButtonDisabledState(currentStep, formData)}
                    nextButtonText={isLastStep ? "Submit" : (currentStep === 3 && isLoading ? "Submitting..." : "Next")}
                    showNextButton={true}
                />
            </div>
            {showSuccessOverlay && (
                <SuccessOverlay custNo={custNo} onClose={handleCloseSuccessOverlay} />
            )}
        </main>
    );
}