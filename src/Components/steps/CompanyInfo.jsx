import React from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";

export default function CompanyInfo({ updateFormData, formData, NavigationButtons }) {
    const handleInputChange = (e) => {
        updateFormData(e.target.name, e.target.value);
    };

    const handleSelectChange = (value) => {
        updateFormData("companySize", value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Company Information</h1>
            <p className="text-center text-gray-400 mb-6">Tell us about your business.</p>
            <form className="space-y-4">
                <Input
                    label="Company Name"
                    name="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                />
                <Select
                    label="Company Size"
                    placeholder="Select company size"
                    value={formData.companySize}
                    onChange={handleSelectChange}
                >
                    <SelectItem key="1-10" value="1-10">
                        1-10 employees
                    </SelectItem>
                    <SelectItem key="11-50" value="11-50">
                        11-50 employees
                    </SelectItem>
                    <SelectItem key="51-200" value="51-200">
                        51-200 employees
                    </SelectItem>
                    <SelectItem key="201+" value="201+">
                        201+ employees
                    </SelectItem>
                </Select>
            </form>
            {NavigationButtons}
        </div>
    );
}