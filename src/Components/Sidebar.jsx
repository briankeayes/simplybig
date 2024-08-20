//Sidebar.jsx
import React from "react";
import { Card } from "@nextui-org/react";
import { MessageCircleIcon } from "./Icons";

export default function Sidebar({ formData, currentStep, handlePrevStep, setCurrentStep, completedSteps, isSidebarOpen, setIsSidebarOpen }) {
    const getSteps = () => {
        const baseSteps = [
            "Welcome",
            "Select Number Type",
            "Account Details",
            "Plans",
        ];

        // if (formData && formData.numberType === "new") {
            baseSteps.push("Select Number");
        // }

        baseSteps.push("Results");
        return baseSteps;
    };

    const steps = getSteps();
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
            <h2 className="text-2xl font-bold mb-2 text-white">Simply Big</h2>
            <p className="text-sm text-cloud-nine mb-8">Get a unique, physical U.S address and virtual mailbox.</p>
            <ol className="space-y-6">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={`flex items-start cursor-pointer ${currentStep === index ? "text-white" : "text-cloud-nine"
                            }`}
                        onClick={() => handleStepClick(index)}
                    >
                        <span
                            className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 transition-all duration-300 text-center ${isStepCompleted(index)
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
                            <h3 className="font-bold">{step}</h3>
                            <p className="text-sm text-cloud-nine">
                                {getStepDescription(index)}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
            <Card className="mt-10 p-4 bg-ocean bg-opacity-30">
                <div className="flex items-center">
                    <p className="ml-4 text-sm text-white">We're here to answer your questions.</p>
                    <MessageCircleIcon className="ml-auto w-5 h-5 text-indigo" />
                </div>
            </Card>
        </aside>
    );

}

function getStepDescription(index) {
    const descriptions = [
        "Get started with Simply Big",
        "Choose between new number or existing number",
        "Enter your personal information",
        // "Tell us about your business",
        "Choose your plan",
        "Choose your phone number",
        "Your registration is complete"
    ];
    return descriptions[index];
}