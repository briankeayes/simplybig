import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Welcome from "./steps/Welcome";
import SelectSimType from "./steps/SelectSimType";
import SelectNumberType from "./steps/SelectNumberType";
import AccountDetails from "./steps/AccountDetails";
import CompanyInfo from "./steps/CompanyInfo";
import SelectPlan from "./steps/SelectPlan";
import SelectNumber from "./steps/SelectNumber";
import Results from "./steps/Results";
import NavigationButtons from "./NavigationButtons";


export default function MainContent({ currentStep, handleNextStep, handlePrevStep, formData, updateFormData, handleSubmit }) {
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
            case 3: return <AccountDetails {...props} />;
            case 4: return <CompanyInfo {...props} />;
            case 5: return <SelectPlan {...props} />;
            case 6: return <SelectNumber {...props} />;
            case 7: return <Results {...props} />;
            default: return <div>Step not implemented yet</div>;
        }
    };

    const getNextButtonDisabledState = (step, formData) => {
        switch (step) {
            case 1: return !formData.simType;
            case 2: return !formData.numberType;
            case 3: return !formData.firstName || !formData.lastName || !formData.email;
            case 4: return !formData.companyName || !formData.companySize;
            case 5: return !formData.selectedPlan;
            case 6: return !formData.selectedNumber && formData.numberType === 'new';
            default: return false;
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
                    handleNextStep={isLastStep ? handleSubmit : handleNextStep}
                    isNextDisabled={getNextButtonDisabledState(currentStep, formData)}
                    nextButtonText={isLastStep ? "Submit" : "Next"}
                    showNextButton={true}
                />
            </div>
        </main>
    );
}