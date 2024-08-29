import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

export default function SelectNumberType({ updateFormData, formData, handleNextStep }) {
    const handleNumberTypeChange = (type) => {
        updateFormData("numberType", type);
        handleNextStep();
    };

    const [errors, setErrors] = useState("");
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // let newErrors=''
        // const phoneRegex = /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/; // Basic Australian phone number regex
        // if (!value.trim()) {
        //     newErrors = "Phone number is required";
        // } else if (!phoneRegex.test(value)) {
        //     newErrors = "Invalid Australian phone number format";
        // } else {
        //     newErrors = null;
        // }
        // setErrors(newErrors)
        updateFormData(name, value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-4 text-white">Select Number Type</h1>
            <p className="text-center text-ocean mb-6">Choose between new number or existing number</p>
            <Input
                className="mb-4"
                isRequired
                label={"SIM Number"}
                name={"simNumber"}
                value={formData.simNumber}
                onChange={handleInputChange}
                variant="bordered"
                errorMessage={errors}
                isInvalid={!!errors || formData["simNumber"] === ''}
                // isDisabled={isSubmitted || isLoading}
                type={"text"}
                placeholder={"Enter your SIM number"}
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    color={formData.numberType === "new" ? "primary" : "default"}
                    className={`px-6 py-3 rounded-full ${formData.numberType === "new"
                        ? "bg-ocean text-white"
                        : "bg-white text-midnight "
                        }`}
                    onClick={() => handleNumberTypeChange("new")}
                >
                    New Number
                </Button>
                <Button
                    color={formData.numberType === "existing" ? "primary" : "default"}
                    className={`px-6 py-3 rounded-full ${formData.numberType === "existing"
                        ? "bg-ocean text-white"
                        : "bg-white text-midnight "
                        }`}
                    onClick={() => handleNumberTypeChange("existing")}
                >
                    Existing Number
                </Button>
            </div>
        </div>
    );
}