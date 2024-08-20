import React from "react";
import { Button, Card } from "@nextui-org/react";

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: "$10/month",
        features: ["1GB Data", "100 Minutes", "100 SMS"],
        color: "from-blue-400 to-blue-600"
    },
    {
        id: "standard",
        name: "Standard",
        price: "$20/month",
        features: ["5GB Data", "Unlimited Minutes", "Unlimited SMS"],
        color: "from-purple-400 to-purple-600"
    },
    {
        id: "premium",
        name: "Premium",
        price: "$30/month",
        features: ["Unlimited Data", "Unlimited Minutes", "Unlimited SMS", "International Roaming"],
        color: "from-pink-400 to-pink-600"
    },
];

export default function SelectPlan({ updateFormData, formData, NavigationButtons }) {
    const handlePlanSelect = (planId) => {
        updateFormData("selectedPlan", planId);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-white mb-4">Select Your Plan</h1>
            <p className="text-center text-ocean mb-6">Choose the plan that best fits your needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`p-6 bg-gradient-to-br ${plan.color} hover:shadow-lg transition-shadow duration-300 flex flex-col`}
                    >
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
                            <p className="text-3xl font-semibold mb-4 text-white">{plan.price}</p>
                            <ul className="mb-6 text-white">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center mb-2">
                                        <CheckIcon className="w-5 h-5 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            color={formData.selectedPlan === plan.id ? "success" : "default"}
                            onClick={() => handlePlanSelect(plan.id)}
                            className={`w-full transition-all duration-300 ${formData.selectedPlan === plan.id
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-white text-gray-800 hover:bg-gray-100"
                                }`}
                        >
                            {formData.selectedPlan === plan.id ? "Selected" : "Select Plan"}
                        </Button>
                    </Card>
                ))}
            </div>
            {NavigationButtons}
        </div>
    );
}

function CheckIcon(props) {
    return (
        <svg
            {...props}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}