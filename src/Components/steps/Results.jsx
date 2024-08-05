import React from "react";
import { Button } from "@nextui-org/react";

export default function Results({ handlePrevStep, formData, handleSubmit }) {

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-4">Review Your Information</h1>
            <div className="w-full max-w-md">
                <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <p><strong>SIM Type:</strong> {formData.simType}</p>
                    <p><strong>Number Type:</strong> {formData.numberType}</p>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Company:</strong> {formData.companyName}</p>
                    <p><strong>Selected Plan:</strong> {formData.selectedPlan}</p>
                    <p><strong>Selected Number:</strong> {formData.selectedNumber}</p>
                </div>
            </div>
        </>
    );
}