import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { API_URL } from "../../constants";

export default function SelectNumber({ updateFormData, formData, NavigationButtons }) {
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const initialFetchMade = useRef(false);

    const fetchNumbers = async () => {
        console.log("Fetching numbers...");
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/reserveNumber`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch numbers');
            }
            const data = await response.json();
            setAvailableNumbers(prevNumbers => {
                const newNumbers = [...prevNumbers, ...data.numbers];
                console.log("Updated numbers:", newNumbers);
                return newNumbers;
            });
        } catch (err) {
            setError('Failed to load numbers. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Effect running. numberType:", formData.numberType, "availableNumbers:", availableNumbers.length, "initialFetchMade:", initialFetchMade.current);
        if (formData.numberType === "new" && availableNumbers.length === 0 && !initialFetchMade.current) {
            console.log("Initiating initial fetch");
            initialFetchMade.current = true;
            fetchNumbers();
        }
    }, [formData.numberType, availableNumbers.length]);

    const handleNumberSelect = (number) => {
        updateFormData("selectedNumber", number.number);
    };

    const handleGetMoreNumbers = () => {
        fetchNumbers();
    };

    const handleExistingNumberChange = (e) => {
        updateFormData("existingNumber", e.target.value);
    };

    const renderNumberButtons = () => {
        console.log("Rendering number buttons. Count:", availableNumbers.length);
        const buttons = availableNumbers.map((number) => (
            <Button
                key={number.id}
                color={formData.selectedNumber === number.number ? "primary" : "default"}
                onClick={() => handleNumberSelect(number)}
                className="py-6 text-lg font-semibold"
            >
                {number.number}
            </Button>
        ));

        if (buttons.length > 8) {
            return (
                <div className="max-h-96 overflow-y-auto pr-2 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {buttons}
                    </div>
                </div>
            );
        }

        return <div className="grid grid-cols-2 gap-4 mb-6">{buttons}</div>;
    };
console.log(formData)
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Select Your Number</h1>
            <p className="text-center text-gray-400 mb-6">Choose your new phone number or enter your existing one.</p>
            {formData.numberType === "new" ? (
                <>
                    {isLoading && availableNumbers.length === 0 ? (
                        <div className="flex justify-center mb-6">
                            <Spinner label="Loading numbers..." />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 mb-6">{error}</div>
                    ) : (
                        renderNumberButtons()
                    )}
                    <Button
                        color="secondary"
                        onClick={handleGetMoreNumbers}
                        className="w-full mb-6"
                        isLoading={isLoading}
                    >
                        {isLoading ? "Loading More Numbers..." : "Get More Numbers"}
                    </Button>
                    <div className="text-sm text-gray-500">
                        Total numbers available: {availableNumbers.length}
                    </div>
                </>
            ) : (
                <Input
                    label="Your Existing Number to get OTP"
                    placeholder="Enter your existing number"
                    value={formData.phoneNumber}
                    onChange={handleExistingNumberChange}
                    className="mb-6"
                />
            )}
            {NavigationButtons}
        </div>
    );
}