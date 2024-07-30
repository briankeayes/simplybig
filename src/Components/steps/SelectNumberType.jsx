import React from "react";
import { Button } from "@nextui-org/react";

export default function SelectNumberType({ updateFormData, formData, handleNextStep }) {
    const handleNumberTypeChange = (type) => {
        updateFormData("numberType", type);
        handleNextStep();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Select Number Type</h1>
            <p className="text-center text-gray-400 mb-6">Choose between new number or existing number</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    color={formData.numberType === "new" ? "primary" : "default"}
                    className="px-6 py-3 rounded-full"
                    onClick={() => handleNumberTypeChange("new")}
                >
                    New Number
                </Button>
                <Button
                    color={formData.numberType === "existing" ? "primary" : "default"}
                    className="px-6 py-3 rounded-full"
                    onClick={() => handleNumberTypeChange("existing")}
                >
                    Existing Number
                </Button>
            </div>
        </div>
    );
}