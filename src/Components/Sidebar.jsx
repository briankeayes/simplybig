import { Card } from "@nextui-org/react";
import { MessageCircleIcon } from "./Icons";
import { getVisibleSteps } from "./stepConfig";
import PropTypes from 'prop-types';

export default function Sidebar({ formData, currentStep, setCurrentStep, completedSteps, isSidebarOpen, setIsSidebarOpen }) {
    const steps = getVisibleSteps(formData);

    const handleStepClick = (index) => {
        if (completedSteps[index] || index <= currentStep) {
            setCurrentStep(index);
        }
    };

    const isStepCompleted = (index) => {
        return completedSteps[index] || index < currentStep;
    };

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-ocean to-midnight p-6
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 md:w-1/4
        `}>
            <button
                className="absolute top-4 right-4 md:hidden text-white hover:text-indigo"
                onClick={() => setIsSidebarOpen(false)}
            >
                Close
            </button>
            <img src="/logo.svg" alt="Logo" className="max-w-[50%] mb-10"/>
            <ol className="space-y-6">
                {steps.map((step, index) => (
                    <li
                        key={step.key}
                        className={`flex items-start cursor-pointer ${currentStep === index ? "text-white" : "text-cloud-nine"}`}
                        onClick={() => handleStepClick(index)}
                    >
                        <span
                            className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 transition-all duration-300 text-center ${
                                isStepCompleted(index)
                                    ? "bg-aqua text-white"
                                    : currentStep === index
                                    ? "bg-white text-midnight"
                                    : "bg-indigo text-white"
                            }`}
                        >
                            <span className="inline-block w-4 text-center">
                                {isStepCompleted(index) ? "✓" : index + 1}
                            </span>
                        </span>
                        <div>
                            <h3 className="font-bold">{step.title}</h3>
                            <p className="text-sm text-cloud-nine">
                                {step.description}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
            <Card className="mt-10 p-4 bg-ocean bg-opacity-30">
                <div className="flex items-center">
                    <p className="ml-4 text-sm text-white">We are here to answer your questions.</p>
                    <MessageCircleIcon className="ml-auto w-5 h-5 text-indigo" />
                </div>
            </Card>
        </aside>
    );
}
Sidebar.propTypes = {
    currentStep: PropTypes.number.isRequired,
    completedSteps: PropTypes.object.isRequired,
    setIsSidebarOpen: PropTypes.func,
    setCurrentStep: PropTypes.func,
    formData: PropTypes.shape({
        sign: PropTypes.string
    }).isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
}
