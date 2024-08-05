import React from "react";
import { Button, Input } from "@nextui-org/react";

export default function AccountDetails({ updateFormData, formData, NavigationButtons }) {
    const handleInputChange = (e) => {
        updateFormData(e.target.name, e.target.value);
    };

    const handleContactMethod = (method) => {
        updateFormData("preferredContactMethod", method);
    }
    const handleSalutation = (sal) => {
        updateFormData("sal", sal);
    }
    const handleCustType = (cust) => {
        updateFormData("custType", cust);
    }

    console.log(formData)

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
                        name="surname"
                        placeholder="Type your last name here"
                        value={formData.surname}
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
                <h1 className="text-xs font-light text-neutral-200 tracking-wider">Preferred Contact Type</h1>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                        color={formData.preferredContactMethod === "email" ? "primary" : "default"}
                        className="px-6 py-3 rounded-full"
                        onClick={() => handleContactMethod("email")}
                    >
                        Email
                    </Button>
                    <Button
                        color={formData.preferredContactMethod === "phone" ? "primary" : "default"}
                        className="px-6 py-3 rounded-full"
                        onClick={() => handleContactMethod("phone")}
                    >
                        Phone
                    </Button>
                </div>
                <h1 className="text-xs font-light text-neutral-200 tracking-wide">Salutation</h1>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                        color={formData.sal === "he" ? "primary" : "default"}
                        className="px-6 py-3 rounded-full"
                        onClick={() => handleSalutation("he")}
                    >
                        He
                    </Button>
                    <Button
                        color={formData.sal === "she" ? "primary" : "default"}
                        className="px-6 py-3 rounded-full"
                        onClick={() => handleSalutation("she")}
                    >
                        She
                    </Button>
                </div>
                <Input
                    label="Date of Birth"
                    name="dob"
                    placeholder="Phone or Email"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                />
                <h1 className="text-xs font-light text-neutral-200 tracking-wide">Customer Type</h1>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                        color={formData.custType === "B" ? "primary" : "default"}
                        className="px-6 py-3 rounded-full"
                        onClick={() => handleCustType("B")}
                    >
                        Business
                    </Button>
                    <Button
                        color={formData.custType === "I" ? "primary" : "default"}
                        className="px-6 py-3 rounded-full"
                        onClick={() => handleCustType("I")}
                    >
                        Individual
                    </Button>
                </div>
            </form>
            {NavigationButtons}
        </div>
    );
}