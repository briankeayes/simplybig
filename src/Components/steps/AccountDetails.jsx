import React from "react";
import { Input } from "@nextui-org/react";

export default function AccountDetails({ updateFormData, formData, NavigationButtons }) {
    const handleInputChange = (e) => {
        updateFormData(e.target.name, e.target.value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Create Your Account</h1>
            <p className="text-center text-gray-400 mb-6">Enter your personal information.</p>
            <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="First Name"
                        name="firstName"
                        placeholder="Type your first name here"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        placeholder="Type your last name here"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <Input
                    label="Email"
                    name="email"
                    placeholder="john.doe@gmail.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </form>
            {NavigationButtons}
        </div>
    );
}