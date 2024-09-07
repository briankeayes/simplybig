import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Card, CardBody, Spinner } from "@nextui-org/react";

AccountDetails.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    updateFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        firstName: PropTypes.string,
        surname: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        sal: PropTypes.string,
        dob: PropTypes.string,
        address: PropTypes.string,
        suburb: PropTypes.string,
        state: PropTypes.string,
        postcode: PropTypes.string,
        preferredContactMethod: PropTypes.oneOf(['EMAIL', 'SMS', '']),
        custType: PropTypes.oneOf(['B', 'R', '']),
        abn: PropTypes.string,
        custNo: PropTypes.string // For the success message
    }).isRequired,
    onValidationChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
    isFormSubmitted: PropTypes.bool.isRequired,
};

export default function AccountDetails({ title, description, updateFormData, formData, onValidationChange, isLoading, isSubmitted, isFormSubmitted }) {
    const salutations = ["Mr", "Mrs", "Ms", "Mstr", "Miss", "Dr", "Mx", "Other"];
    const autocompleteInput = useRef(null);
    const [errors, setErrors] = useState({});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/; // Basic Australian phone number regex

    const initAutocomplete = () => {
        if (!autocompleteInput.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.current, {
            componentRestrictions: { country: "au" },
            fields: ["address_components", "formatted_address"],
            types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.address_components) return;

            let postcode = "";
            let state = "";
            let suburb = "";

            for (const component of place.address_components) {
                const componentType = component.types[0];
                switch (componentType) {
                    case "postal_code":
                        postcode = component.long_name;
                        break;
                    case "administrative_area_level_1":
                        state = component.short_name;
                        break;
                    case "locality":
                        suburb = component.long_name;
                        break;
                }
            }

            updateFormData("address", place.formatted_address);
            updateFormData("postcode", postcode);
            updateFormData("state", state);
            updateFormData("suburb", suburb);
        });
    };

    useEffect(() => {
        // Load Google Maps JavaScript API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAUKRbwl61ZS5CfzHB5L_KQeOdLAG2gFV8&libraries=places`;
        script.async = true;
        script.onload = initAutocomplete;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [initAutocomplete]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value);
        validateField(name, value);
    };

    const handleContactMethod = (method) => {
        updateFormData("preferredContactMethod", method);
        validateField("preferredContactMethod", method);
    }

    const handleCustType = (cust) => {
        updateFormData("custType", cust);
        validateField("custType", cust);
    }

    const handleSelectionChange = (field) => (selectedKeys) => {
        const selectedValue = Array.from(selectedKeys)[0];
        updateFormData(field, selectedValue);
        validateField(field, selectedValue);
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };
        switch (name) {
            case "firstName":
            case "surname":
                if (!value.trim()) {
                    newErrors[name] = `${name === "firstName" ? "First" : "Last"} name is required`;
                } else {
                    delete newErrors[name];
                }
                break;
            case "email":
                if (!value.trim()) {
                    newErrors.email = "Email is required";
                } else if (!emailRegex.test(value)) {
                    newErrors.email = "Invalid email format";
                } else {
                    delete newErrors.email;
                }
                break;
            case "sal":
                if (!value) {
                    newErrors.sal = "Salutation is required";
                } else {
                    delete newErrors.sal;
                }
                break;
            case "dob":
                if (!value) {
                    newErrors.dob = "Date of Birth is required";
                } else {
                    const dobDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - dobDate.getFullYear();
                    if (age < 18) {
                        newErrors.dob = "Must be at least 18 years old";
                    } else {
                        delete newErrors.dob;
                    }
                }
                break;
            case "address":
                if (!value.trim()) {
                    newErrors.address = "Address is required";
                } else {
                    delete newErrors.address;
                }
                break;
            case "preferredContactMethod":
                if (!value) {
                    newErrors.preferredContactMethod = "Preferred contact method is required";
                } else {
                    delete newErrors.preferredContactMethod;
                }
                break;
            case "custType":
                if (!value) {
                    newErrors.custType = "Customer type is required";
                } else {
                    delete newErrors.custType;
                }
                break;
            case "abn":
                if (formData.custType === "B" && (!value || value.length !== 11)) {
                    newErrors.abn = "Valid 11-digit ABN is required for business customers";
                } else {
                    delete newErrors.abn;
                }
                break;
            case "phoneNumber":
                if (!value.trim()) {
                    newErrors.phoneNumber = "Phone number is required";
                } else if (!phoneRegex.test(value)) {
                    newErrors.phoneNumber = "Invalid Australian phone number format";
                } else {
                    delete newErrors.phoneNumber;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };


    useEffect(() => {
        const validateForm = () => {
            const requiredFields = ['firstName', 'surname', 'email', 'address', 'postcode', 'state', 'suburb', 'custType', 'dob', 'preferredContactMethod', 'sal'];
            const isValid = requiredFields.every(field => formData[field]) && Object.keys(errors).length === 0;
            onValidationChange(isValid);
            return isValid;
        };

        validateForm();
    }, [formData, errors, onValidationChange]);

    const renderField = (name, label, placeholder, type = "text") => (
        <Input
            label={label}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            variant="bordered"
            errorMessage={errors[name]}
            isInvalid={!!errors[name] || formData[name] === ''}
            isDisabled={isSubmitted || isLoading || isFormSubmitted}
            type={type}
            placeholder={placeholder}
            isRequired
        />
    );

    return (
        <Card className="w-full max-w-2xl mx-auto">
            {isLoading && (
                <div className="fixed inset-0 bg-midnight bg-opacity-50 flex text-white items-center justify-center z-50">
                    <Spinner label="Adding customer..." className="text-white" color="white" />
                </div>
            )}
            {isSubmitted && (
                <div className="fixed inset-0 bg-midnight bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-96 bg-white">
                        <CardBody className="text-center">
                            <h2 className="text-2xl font-bold mb-4 text-midnight">Account Created Successfully!</h2>
                            <p className="mb-4 text-ocean">Your customer number is:</p>
                            <p className="text-3xl font-bold mb-6 text-indigo">{formData.custNo}</p>
                        </CardBody>
                    </Card>
                </div>
            )}
            <CardBody className="p-8 ">
                <h1 className="text-3xl font-bold text-center mb-2 text-midnight">{title}</h1>
                <p className="text-center mb-8">{description}</p>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderField("firstName", "First Name", "Type your first name here")}
                        {renderField("surname", "Last Name", "Type your last name here")}
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderField("email", "Email", "email@company.com", 'email')}

                        {renderField("phoneNumber", "Phone Number", "Enter your phone number", 'text')}

                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Dropdown size={"md"}>
                            <DropdownTrigger>
                                <Button
                                    isDisabled={isSubmitted || isLoading || isFormSubmitted}
                                    variant="bordered"
                                    className={`w-full justify-start ${errors.sal ? 'border-red-500' : ''}`}
                                >
                                    {formData.sal || "Select Salutation"}
                                    {!formData.sal && (<span className='text-red-500'>*</span>)}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Salutation selection *"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={formData.sal ? [formData.sal] : []}
                                onSelectionChange={handleSelectionChange("sal")}
                            >
                                {salutations.map((salutation) => (
                                    <DropdownItem key={salutation}>{salutation}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {errors.sal && <p className="text-red-500 text-sm">{errors.sal}</p>}

                        {renderField("dob", "Date of Birth", "Select your date of birth", "date")}

                    </div>
                    <Input
                        isRequired
                        ref={autocompleteInput}
                        label="Address"
                        name="address"
                        placeholder="Start typing your address"
                        value={formData.address}
                        onChange={handleInputChange}
                        variant="bordered"
                        errorMessage={errors.address}
                        isDisabled={isSubmitted || isLoading || isFormSubmitted}
                        isInvalid={!!errors.address}
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("suburb", "Suburb", "Enter your Suburb")}
                        {renderField("state", "State", "Enter your State")}
                        {renderField("postcode", "Postcode", "Enter your Postcode")}

                    </div>
                    <div className="space-y-2">
                        <h2 className="text-sm font-medium text-gray-600">Preferred Contact Method<span className='text-red-500'>*</span></h2>
                        <div className="flex gap-4">
                            <Button
                                color={formData.preferredContactMethod === "EMAIL" ? "primary" : "default"}
                                variant={formData.preferredContactMethod === "EMAIL" ? "solid" : "bordered"}
                                isDisabled={isSubmitted || isLoading || isFormSubmitted}
                                className="flex-1"
                                onClick={() => handleContactMethod("EMAIL")}
                            >
                                Email
                            </Button>
                            <Button
                                isDisabled={isSubmitted || isLoading || isFormSubmitted}
                                color={formData.preferredContactMethod === "SMS" ? "primary" : "default"}
                                variant={formData.preferredContactMethod === "SMS" ? "solid" : "bordered"}
                                className="flex-1"
                                onClick={() => handleContactMethod("SMS")}
                            >
                                SMS
                            </Button>
                        </div>
                        {errors.preferredContactMethod && <p className="text-red-500 text-sm">{errors.preferredContactMethod}</p>}
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-sm font-medium text-gray-600">Customer Type<span className='text-red-500'>*</span></h2>
                        <div className="flex gap-4">
                            <Button
                                isDisabled={isSubmitted || isLoading || isFormSubmitted}
                                color={formData.custType === "B" ? "primary" : "default"}
                                variant={formData.custType === "B" ? "solid" : "bordered"}
                                className="flex-1"
                                onClick={() => handleCustType("B")}
                            >
                                Business
                            </Button>
                            <Button
                                color={formData.custType === "R" ? "primary" : "default"}
                                isDisabled={isSubmitted || isLoading || isFormSubmitted}
                                variant={formData.custType === "R" ? "solid" : "bordered"}
                                className="flex-1"
                                onClick={() => handleCustType("R")}
                            >
                                Individual
                            </Button>
                        </div>
                        {errors.custType && <p className="text-red-500 text-sm">{errors.custType}</p>}
                    </div>
                    {formData.custType === "B" && (
                        renderField("abn", "Australian Business Number (ABN)", "Enter your ABN")
                    )}
                </form>
            </CardBody>
        </Card>
    );
}