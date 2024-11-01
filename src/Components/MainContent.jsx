import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../constants";
// import { getVisibleSteps } from "./stepConfig";
import PropTypes from 'prop-types';
import { CardBody, Card, Link } from "@nextui-org/react";

// Import all step components
import Welcome from "./steps/Welcome";
import SelectNumberType from "./steps/SelectNumberType";
import AccountDetails from "./steps/AccountDetails";
import SelectPlan from "./steps/SelectPlan";
import SelectNumber from "./steps/SelectNumber";
import Payment from "./steps/Payment";
import Results from "./steps/Results";
import NavigationButtons from "./NavigationButtons";
import SimNumber from "./steps/SIMNumber";
import Consent from "./steps/Consent";

const STEP_COMPONENTS = {
    Welcome,
    SimNumber,
    SelectNumberType,
    AccountDetails,
    SelectPlan,
    SelectNumber,
    Payment,
    Consent,
    Results,
};


export default function MainContent({ steps, currentStep, handleNextStep, handlePrevStep, formData, updateFormData, handleSubmit, isFormSubmitted }) {
    const [isAccountDetailsValid, setIsAccountDetailsValid] = useState(false);
    const [isSimNumberValid, setIsSimNumberValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [custNo, setCustNo] = useState(null);

    // const steps = useMemo(() => getVisibleSteps(formData), [formData]);

    const handleAccountDetailsSubmit = async () => {
        if (isSubmitted) return handleNextStep();
        if (!isAccountDetailsValid) return;

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
                sal: formData.sal,
                orderNotificationEmail: formData.email,
                abn: formData.abn
            };

            const response = await fetch(`${API_URL}/addCustomer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer: customerData }),
            });

            if (!response.ok) throw new Error('Failed to add customer');

            const data = await response.json();
            console.log('API Response:', data);

            setCustNo(data.return.custNo);
            setIsSubmitted(true);
            updateFormData('custNo', data.return.custNo);
            console.log(custNo)
        } catch (error) {
            console.error('Error adding customer:', error);
            // Handle error (you might want to show an error message to the user)
        } finally {
            setIsLoading(false);
        }
    };

    const getNextButtonDisabledState = useMemo(() => ({
        simNumber: !isSimNumberValid,
        numberType: !formData.numberType,
        accountDetails: !isAccountDetailsValid || isLoading,
        selectNumber: formData.numberType === 'new' ? !formData.selectedNumber : (!formData.arn || !formData.provider),
        payment: !formData.paymentToken,
        consent: !formData.sign
    }), [formData, isAccountDetailsValid, isLoading, isSimNumberValid]);

    const getNextButtonHandler = useMemo(() => ({
        accountDetails: handleAccountDetailsSubmit,
        // results: handleSubmit,
        consent: handleSubmit,
        // payment: handleSubmit,
    }), [handleAccountDetailsSubmit, handleSubmit]);

    const isLastStep = currentStep === steps.length - 2;

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

    const renderStep = () => {
        const currentStepConfig = steps[currentStep];
        const StepComponent = STEP_COMPONENTS[currentStepConfig.component];

        if (currentStepConfig.key == "selectNumber" && formData.numberType === "existing") {
            currentStepConfig.title = 'Existing Number Details'
            currentStepConfig.description = 'Enter your current provider and account number.'
        }

        return (currentStepConfig.key !== 'welcome') ? (
            <Card className="w-full max-w-2xl mx-auto">
                <CardBody>
                    <div className="w-full max-w-2xl mx-auto p-6 rounded-lg">
                        {(currentStepConfig.key !== 'selectPlan') && (
                            <>
                                <h1 className="text-3xl font-bold text-midnight text-center mb-4">{currentStepConfig.title}</h1>
                                <p className="text-center mb-6 text-aqua">{currentStepConfig.description}</p>
                                {(currentStepConfig.key == 'accountDetails' ) && (
                                    <p className="text-center mt-0 mb-6 text-[0.7rem]"> If you wish to add an additional authorised representative to act on your behalf, please contact us at <Link className="text-[0.7rem]" href="mailto:contact@simplybig.com.au">contact@simplybig.com.au</Link>. We will provide you with our Authorised Representatives form to complete.</p>
                                )}
                            </>
                        )}

                        <StepComponent
                            title={currentStepConfig.title}
                            description={currentStepConfig.description}
                            handleNextStep={handleNextStep}
                            handlePrevStep={handlePrevStep}
                            updateFormData={updateFormData}
                            formData={formData}
                            isLoading={isLoading}
                            isSubmitted={isSubmitted}
                            isFormSubmitted={isFormSubmitted}
                            setIsSimNumberValid={setIsSimNumberValid}
                            onValidationChange={setIsAccountDetailsValid}
                        />

                    </div>
                </CardBody>
            </Card>

        ):(<Welcome />);
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-brand-gradient bg-opacity-20">
            <div className="w-full max-w-4xl flex flex-col min-h-[80vh] justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="flex-grow flex flex-col justify-center bg-white bg-opacity-10 text-black backdrop-blur-sm rounded-lg p-6"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
                <NavigationButtons
                    currentStep={currentStep}
                    handlePrevStep={handlePrevStep}
                    handleNextStep={getNextButtonHandler[steps[currentStep].key] || handleNextStep}
                    isNextDisabled={getNextButtonDisabledState[steps[currentStep].key] || false}
                    nextButtonText={(!isFormSubmitted && isLastStep) ? "Submit" : (currentStep === 2 && isLoading ? "Submitting..." : "Next")}
                    showNextButton={currentStep != steps.length - 1}
                />
            </div>
            {/* {showSuccessOverlay && (
                <SuccessOverlay custNo={custNo} onClose={handleCloseSuccessOverlay} />
            )} */}
        </main>
    );
}

MainContent.propTypes = {
    currentStep: PropTypes.number.isRequired,
    handleNextStep: PropTypes.func.isRequired,
    handlePrevStep: PropTypes.func.isRequired,
    updateFormData: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    steps: PropTypes.any.isRequired,
    formData: PropTypes.shape({
        simNumber: PropTypes.string,
        numberType: PropTypes.string,
        sign: PropTypes.string,
        selectedNumber: PropTypes.string,
        paymentToken: PropTypes.string,
        firstName: PropTypes.string,
        surname: PropTypes.string,
        email: PropTypes.string,
        arn: PropTypes.string,
        provider: PropTypes.string,
        phoneNumber: PropTypes.string,
        sal: PropTypes.string,
        dob: PropTypes.string,
        address: PropTypes.string,
        suburb: PropTypes.string,
        state: PropTypes.string,
        postcode: PropTypes.string,
        preferredContactMethod: PropTypes.oneOf(['EMAIL', 'SMS', '']),
        custType: PropTypes.oneOf(['B', 'R', '']),
        abn: PropTypes.string,
    }).isRequired,
    isFormSubmitted: PropTypes.bool.isRequired,
}

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Welcome from "./steps/Welcome";
// import SelectSimType from "./steps/SelectSimType";
// import SelectNumberType from "./steps/SelectNumberType";
// import AccountDetails from "./steps/AccountDetails";
// import SelectPlan from "./steps/SelectPlan";
// import SelectNumber from "./steps/SelectNumber";
// import Results from "./steps/Results";
// import NavigationButtons from "./NavigationButtons";
// import { API_URL } from "../constants";
// import { Button, Card, CardBody } from "@nextui-org/react";


// const SuccessOverlay = ({ custNo, onClose }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <Card className="w-96">
//             <CardBody className="text-center">
//                 <h2 className="text-2xl font-bold mb-4">Account Created Successfully!</h2>
//                 <p className="mb-4">Your customer number is:</p>
//                 <p className="text-3xl font-bold mb-6">{custNo}</p>
//                 <Button color="primary" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500" onClick={onClose}>Continue</Button>
//             </CardBody>
//         </Card>
//     </div>
// );

// export default function MainContent({ currentStep, handleNextStep, handlePrevStep, formData, updateFormData, handleSubmit }) {
//     const [isAccountDetailsValid, setIsAccountDetailsValid] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
//     const [custNo, setCustNo] = useState(null);


//     const handleAccountDetailsSubmit = async () => {
//         if (isSubmitted) {
//             return handleNextStep();
//         }
//         if (isAccountDetailsValid) {
//             setIsLoading(true);
//             try {
//                 const customerData = {
//                     address: formData.address,
//                     postcode: formData.postcode,
//                     state: formData.state,
//                     suburb: formData.suburb,
//                     custType: formData.custType,
//                     email: formData.email,
//                     phone: formData.phoneNumber,
//                     dob: formData.dob,
//                     firstName: formData.firstName,
//                     surname: formData.surname,
//                     preferredContactMethod: formData.preferredContactMethod,
//                     sal: formData.sal,
//                     orderNotificationEmail: formData.email,
//                 };

//                 const response = await fetch(`${API_URL}/addCustomer`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ customer: customerData }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to add customer');
//                 }

//                 const data = await response.json();
//                 console.log('API Response:', data);

//                 // Save the customer number in the state
//                 setCustNo(data.return.custNo);
//                 setIsSubmitted(true);
//                 updateFormData('custNo', data.return.custNo);

//                 // Show the success overlay
//                 setShowSuccessOverlay(true);
//             } catch (error) {
//                 console.error('Error adding customer:', error);
//                 // Handle error (you might want to show an error message to the user)
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     };

//     const handleCloseSuccessOverlay = () => {
//         setShowSuccessOverlay(false);
//         handleNextStep(); // Proceed to the next step
//     };

//     const renderStep = () => {
//         const props = {
//             handleNextStep,
//             handlePrevStep,
//             updateFormData,
//             formData
//         };
//         switch (currentStep) {
//             case 0: return <Welcome {...props} />;
//             // case 1: return <SelectSimType {...props} />;
//             case 1: return <SelectNumberType {...props} />;
//             case 2: return <AccountDetails
//                 {...props}
//                 isLoading={isLoading}
//                 isSubmitted={isSubmitted}
//                 onValidationChange={setIsAccountDetailsValid}
//             />;
//             case 3: return <SelectPlan {...props} />;
//             case 4: return <SelectNumber {...props} />;
//             case 5: return <Results {...props} />;

//             default: return <div>Step not implemented yet</div>;
//         }
//     };

//     const getNextButtonDisabledState = (step, formData) => {
//         switch (step) {
//             case 0: return false; // Welcome screen
//             // case 1: return !formData.simType;
//             case 1: return !formData.numberType;
//             case 2: return !isAccountDetailsValid || isLoading;
//             // case 3: return !formData.selectedPlan;
//             case 4: return !formData.selectedNumber && formData.numberType === 'new';
//             default: return false;
//         }
//     };

//     const getNextButtonHandler = (step) => {
//         switch (step) {
//             case 2: return handleAccountDetailsSubmit;
//             case 5: return handleSubmit;
//             default: return handleNextStep;
//         }
//     };

//     const isLastStep = currentStep === 6; // Now the last step is 5 (SelectNumber)

//     const pageVariants = {
//         initial: { opacity: 0, x: "-100%" },
//         in: { opacity: 1, x: 0 },
//         out: { opacity: 0, x: "100%" }
//     };

//     const pageTransition = {
//         type: "tween",
//         ease: "anticipate",
//         duration: 0.5
//     };

//     return (
//         <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-brand-gradient bg-opacity-20">
//             <div className="w-full max-w-4xl flex flex-col min-h-[80vh] justify-center">
//                 <AnimatePresence mode="wait">
//                     <motion.div
//                         key={currentStep}
//                         initial="initial"
//                         animate="in"
//                         exit="out"
//                         variants={pageVariants}
//                         transition={pageTransition}
//                         className="flex-grow flex flex-col justify-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
//                     >
//                         {renderStep()}
//                     </motion.div>
//                 </AnimatePresence>
//                 <NavigationButtons
//                     currentStep={currentStep}
//                     handlePrevStep={handlePrevStep}
//                     handleNextStep={getNextButtonHandler(currentStep)}
//                     isNextDisabled={getNextButtonDisabledState(currentStep, formData)}
//                     nextButtonText={isLastStep ? "Submit" : (currentStep === 3 && isLoading ? "Submitting..." : "Next")}
//                     showNextButton={true}
//                 />
//             </div>
//             {showSuccessOverlay && (
//                 <SuccessOverlay custNo={custNo} onClose={handleCloseSuccessOverlay} />
//             )}
//         </main>
//     );
// }