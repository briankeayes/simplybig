import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../constants";
// import { getVisibleSteps } from "./stepConfig";
import PropTypes, { bool } from 'prop-types';
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


export default function MainContent({ steps, currentStep, handleNextStep, handlePrevStep, formData, updateFormData }) {
    const [isAccountDetailsValid, setIsAccountDetailsValid] = useState(false);
    const [isSimNumberValid, setIsSimNumberValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [custNo, setCustNo] = useState(null);
    const [createdOrder, setOrderCreated] = useState({});
    const [isFormSubmitted, setFormSubmitted] = useState(false);


    const handleAccountDetailsSubmit = useCallback(async () => {
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
                dob_port: formData.dob_port,
                firstName: formData.firstName,
                surname: formData.surname,
                preferredContactMethod: formData.preferredContactMethod,
                sal: formData.sal,
                orderNotificationEmail: formData.email,
                abn: formData.abn
            };

            // const response = await fetch(`${API_URL}/addCustomer`, {
            const response = await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer: customerData }),
            });

            if (!response.ok) throw new Error('Failed to add customer');

            const res = await response.json();
            console.log('API Response:', res);

            setCustNo(res.data.custNo);
            setIsSubmitted(true);
            updateFormData('custNo', res.data.custNo);
            console.log(custNo, res.data.custNo)
            handleNextStep();
        } catch (error) {
            console.error('Error adding customer:', error);
            // Handle error (you might want to show an error message to the user)
        } finally {
            setIsLoading(false);
        }
    }, [formData, handleNextStep, updateFormData, isAccountDetailsValid, isSubmitted, custNo]);

    const handleSelectNumber = useCallback(() => {
        // console.log(formData.selectedNumber)
        // const response = 

        // fetch(`${API_URL}/selectNumber`, {
        fetch(`${API_URL}/numbers/select`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                number: formData.selectedNumber,
            }),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data)
            }).catch((err) => {
                console.error(err)
            })
        return handleNextStep();

    }, [formData.selectedNumber, handleNextStep]);

    const handleSubmit = useCallback(async () => {
        handleNextStep();
        setIsLoading(true);
        try {
            const [year, month, day] = formData.dob_port.split('-'); // Split the date into components
            const formattedDate = `${day}/${month}/${year}`; // Reformat to "dd/mm/yyyy"
    
            const payload = formData.numberType == 'new' ? {
                "number": formData.selectedNumber,
                "planNo": formData.isUpgraded ? "11145178" : "11144638",
                "simNo":formData.simNumber,
                "cust": {
                    "custNo": formData.custNo,
                    "suburb": formData.suburb,
                    "postcode": formData.postcode,
                    "address": formData.address,
                    "email": formData.email
                },
            } : {
                "number": formData.portingNumber,
                "simNo":formData.simNumber,
                "numType": formData.numType,
                "cust": {
                    "custNo": formData.custNo,
                    "suburb": formData.suburb,
                    "postcode": formData.postcode,
                    "address": formData.address,
                    "email": formData.email,
                    // "dob": formData.dob_port,
                    "dob": formattedDate,
                    "arn": formData.arn
                },
                "planNo": formData.isUpgraded ? "11145178" : "11144638"
            };
            const response = await fetch(`${API_URL}/orders/activate${formData.numberType == "new" ? '' : '/port'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            
            const res = await response.json();
            // if (!response.ok) throw new Error(res.message);
            console.log('API Response:', res);
            if (res.status == 'success') {
                setOrderCreated({ success: true, orderId: res.data.orderId });
                setFormSubmitted(true);
                await fetch(`https://hook.eu2.make.com/u8f97r2gc7geixmf35x8h6uaiyjebgl9`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors',
                    body: JSON.stringify({
                        sessionId: localStorage.getItem('simplyBigSessionId'),
                        formData: { ...formData, 'orderNo': res.data.orderId }
                    }),
                });
                localStorage.removeItem('simplyBigSessionId');
                localStorage.setItem('simplyBigSessionId', 'session_' + Math.random().toString(36).substring(2, 9));
            }else{
                console.log({success: false, message: res.message})
            setOrderCreated({success: false, message: res.message});

            }
        } catch (error) {
            // console.log(error);
            // Handle error (you might want to show an error message to the user)
        } finally {
            setIsLoading(false);
        }
    }, [formData, handleNextStep]);

    const getNextButtonDisabledState = useMemo(() => ({
        simNumber: !isSimNumberValid,
        numberType: !formData.numberType,
        accountDetails: !isAccountDetailsValid || isLoading,
        selectNumber: formData.numberType === 'new' ? !formData.selectedNumber : !formData.isNumberVerified,
        payment: !formData.paymentToken,
        consent: !formData.sign
    }), [formData, isAccountDetailsValid, isLoading, isSimNumberValid]);

    const getNextButtonHandler = useMemo(() => ({
        accountDetails: handleAccountDetailsSubmit,
        selectNumber: handleSelectNumber,
        consent: handleSubmit,
    }), [handleAccountDetailsSubmit, handleSubmit, handleSelectNumber]);

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
                                {(currentStepConfig.key == 'accountDetails') && (
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
                            createdOrder={createdOrder}
                        />

                    </div>
                </CardBody>
            </Card>

        ) : (<Welcome />);
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
        </main>
    );
}

MainContent.propTypes = {
    currentStep: PropTypes.number.isRequired,
    handleNextStep: PropTypes.func.isRequired,
    handlePrevStep: PropTypes.func.isRequired,
    updateFormData: PropTypes.func.isRequired,
    steps: PropTypes.any.isRequired,
    formData: PropTypes.shape({
        isUpgraded: bool,
        simNumber: PropTypes.string,
        numberType: PropTypes.string,
        sign: PropTypes.string,
        custNo: PropTypes.string,
        numType: PropTypes.string,
        portingNumber: PropTypes.string,
        selectedNumber: PropTypes.string,
        paymentToken: PropTypes.string,
        firstName: PropTypes.string,
        surname: PropTypes.string,
        email: PropTypes.string,
        arn: PropTypes.string,
        provider: PropTypes.string,
        phoneNumber: PropTypes.string,
        isNumberVerified: bool,
        sal: PropTypes.string,
        dob: PropTypes.string,
        dob_port: PropTypes.string,
        address: PropTypes.string,
        suburb: PropTypes.string,
        state: PropTypes.string,
        postcode: PropTypes.string,
        preferredContactMethod: PropTypes.oneOf(['EMAIL', 'SMS', '']),
        custType: PropTypes.oneOf(['B', 'R', '']),
        abn: PropTypes.string,
    }).isRequired,
}