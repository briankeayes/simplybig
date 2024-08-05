import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";

export default function SelectNumber({ updateFormData, formData, NavigationButtons }) {
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [wait, setWait] = useState(false);

    const generateNumbers = (count) => {
        return Array.from({ length: count }, () => {
            const areaCode = Math.floor(Math.random() * 900) + 100;
            const prefix = Math.floor(Math.random() * 900) + 100;
            const lineNumber = Math.floor(Math.random() * 9000) + 1000;
            return `${areaCode}-${prefix}-${lineNumber}`;
        });
    };

    useEffect(() => {
        setWait(true);
        axios.post('http://localhost:3000/getAvailableNumbers').then((res) => { setAvailableNumbers(generateNumbers(4)) }).catch(error => { console.error(error) });
        setWait(false);
    }, [])


    // useEffect(() => {
    //     setAvailableNumbers(generateNumbers(4));
    // }, []);

    const handleNumberSelect = (number) => {
        updateFormData("selectedNumber", number);
    };

    const handleGetMoreNumbers = () => {
        setAvailableNumbers([...availableNumbers, ...generateNumbers(3)]);
    };

    const handleExistingNumberChange = (e) => {
        updateFormData("existingNumber", e.target.value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Select Your Number</h1>
            <p className="text-center text-gray-400 mb-6">Choose your new phone number or enter your existing one.</p>
            {formData.numberType === "new" ? (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {
                            availableNumbers.map((number) => (
                                <Button
                                    key={number}
                                    color={formData.selectedNumber === number ? "primary" : "default"}
                                    onClick={() => handleNumberSelect(number)}
                                    className="py-6 text-lg font-semibold"
                                >
                                    {number}
                                </Button>
                            ))
                        }
                    </div>
                    <Button
                        color="secondary"
                        onClick={handleGetMoreNumbers}
                        className="w-full mb-6"
                    >
                        Get More Numbers
                    </Button>
                </>
            ) : (
                <Input
                    label="Your Existing Number"
                    placeholder="Enter your existing number"
                    value={formData.existingNumber}
                    onChange={handleExistingNumberChange}
                    className="mb-6"
                />
            )}
            {NavigationButtons}
        </div>
    );
}