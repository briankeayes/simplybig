import React from "react";
import { Button, Card } from "@nextui-org/react";
import { ArrowLeftIcon, MessageCircleIcon } from "./Icons";

const steps = [
    "Welcome",
    "Select SIM Type",
    "Select Number Type",
    "Account Details",
    "Company Info",
    "Plans",
    "Select Number",
    "Results"
];

export default function Sidebar({ currentStep, handlePrevStep, setCurrentStep, completedSteps, isSidebarOpen, setIsSidebarOpen }) {
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
                    fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-800 to-purple-900 p-6
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0 md:w-1/4
        `}>
            <button
                className="absolute top-4 right-4 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            >
                Close
            </button>
            <h2 className="text-2xl font-bold mb-2">Simply Big</h2>
            <p className="text-sm text-gray-400 mb-8">Get a unique, physical U.S address and virtual mailbox.</p>
            <ol className="space-y-6">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={`flex items-start cursor-pointer ${currentStep === index ? "text-white" : "text-gray-400"
                            }`}
                        onClick={() => handleStepClick(index)}
                    >
                        <span
                            className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 transition-all duration-300 text-center ${isStepCompleted(index)
                                ? "bg-green-500 text-white"
                                : currentStep === index
                                    ? "bg-white text-black"
                                    : "bg-gray-700 text-gray-400"
                                }`}
                        >
                            <span className="inline-block w-4 text-center">
                                {isStepCompleted(index) ? "✓" : index + 1}
                            </span>
                        </span>
                        <div>
                            <h3 className="font-bold">{step}</h3>
                            <p className="text-sm text-gray-400">
                                {getStepDescription(index)}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
            <Card className="mt-10 p-4 bg-gray-800">
                <div className="flex items-center">
                    <p className="ml-4 text-sm">We're here to answer your questions.</p>
                    <MessageCircleIcon className="ml-auto w-5 h-5" />
                </div>
            </Card>
        </aside>
    );
}

function getStepDescription(index) {
    const descriptions = [
        "Get started with Simply Big",
        "Choose between physical SIM or eSIM",
        "Choose between new number or existing number",
        "Enter your personal information",
        "Tell us about your business",
        "Choose your plan",
        "Choose your phone number",
        "Your registration is complete"
    ];
    return descriptions[index];
}