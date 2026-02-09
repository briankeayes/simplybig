import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Card, CardBody, Spinner } from "@nextui-org/react";
AccountDetails.propTypes = {
    // title: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
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
        preferredContactMethod: PropTypes.oneOf(['Email', 'SMS', '']),
        custType: PropTypes.oneOf(['B', 'R', '']),
        abn: PropTypes.string,
        custNo: PropTypes.string // For the success message
    }).isRequired,
    onValidationChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
};

export default function AccountDetails({ updateFormData, formData, onValidationChange, isLoading, isSubmitted }) {
    const salutations = ["Mr", "Mrs", "Ms", "Mstr", "Miss", "Dr", "Mx", "Other"];
    const autocompleteInput = useRef(null);
    const scriptLoadedRef = useRef(false);
    const [errors, setErrors] = useState({});
    const [addressSelectedFromAutocomplete, setAddressSelectedFromAutocomplete] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const initAutocomplete = useCallback(() => {
        if (!autocompleteInput.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.current, {
            componentRestrictions: { country: "au" },
            fields: ["address_components", "formatted_address", "geometry"],
            types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.address_components) return;

            let postcode = "";
            let state = "";
            let suburb = "";
            let route = "";
            let street_number = "";
            let formatted_address = place.formatted_address;

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
                    case "street_number":
                        street_number = component.long_name;
                        break;
                    case "route":
                        route = component.long_name;
                        break;
                }
            }
            // Check if the formatted address includes the street number
            if (street_number && !formatted_address.startsWith(street_number)) {
                // Extract the parts of the address
                const addressParts = formatted_address.split(',');

                // Check if the first part contains just the route
                if (addressParts[0].trim() === route) {
                    // Replace the first part with street number + route
                    addressParts[0] = `${street_number} ${route}`;
                    formatted_address = addressParts.join(',');
                }
            }
            // If we still don't have a street number in the formatted address,
            // check if it's in the user's input
            if (street_number === "") {
                const userInput = autocompleteInput.current.value;
                const potentialStreetNumber = userInput.split(' ')[0];
                if (/^\d+$/.test(potentialStreetNumber)) {
                    street_number = potentialStreetNumber;
                    formatted_address = `${street_number} ${formatted_address}`;
                }
            }

            updateFormData("address", formatted_address);
            updateFormData("postcode", postcode);
            updateFormData("state", state);
            updateFormData("suburb", suburb);
            setAddressSelectedFromAutocomplete(true);
        });
    }, [autocompleteInput, updateFormData]);

    useEffect(() => {
        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            initAutocomplete();
            return;
        }

        // Check if script is already being loaded
        if (scriptLoadedRef.current) {
            return;
        }

        // Check if script tag already exists
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
            scriptLoadedRef.current = true;
            existingScript.addEventListener('load', initAutocomplete);
            return;
        }

        // Load Google Maps JavaScript API script
        scriptLoadedRef.current = true;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = initAutocomplete;
        document.body.appendChild(script);

        return () => {
            // Clean up event listener if we added one to existing script
            if (existingScript) {
                existingScript.removeEventListener('load', initAutocomplete);
            }
        };
    }, [initAutocomplete]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            updateFormData(name, digitsOnly);
            validateField(name, digitsOnly);
            return;
        }

        updateFormData(name, value);
        validateField(name, value);

        if (name === "address") {
            setAddressSelectedFromAutocomplete(false);
            updateFormData("suburb", "");
            updateFormData("state", "");
            updateFormData("postcode", "");
        }
    };

    // const handleContactMethod = (method) => {
    //     updateFormData("preferredContactMethod", method);
    //     validateField("preferredContactMethod", method);
    // }

    // const handleCustType = (cust) => {
    //     updateFormData("custType", cust);
    //     validateField("custType", cust);
    // }

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
                } else if (!addressSelectedFromAutocomplete) {
                    newErrors.address = "Please select an address from the dropdown suggestions";
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
                if (!value) {
                    newErrors.phoneNumber = "Phone number is required";
                } else if (!value.startsWith("04")) {
                    newErrors.phoneNumber = "Phone number must start with 04";
                } else if (value.length !== 10) {
                    newErrors.phoneNumber = "Phone number must be 10 digits (e.g. 0412345678)";
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
            const isValid = requiredFields.every(field => formData[field]) && addressSelectedFromAutocomplete && Object.keys(errors).length === 0;
            onValidationChange(isValid);
            return isValid;
        };

        validateForm();
    }, [formData, errors, onValidationChange, addressSelectedFromAutocomplete]);

    const renderField = (name, label, placeholder, type = "text", description = '') => (
        <Input
            label={label}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            variant="bordered"
            errorMessage={errors[name]}
            isInvalid={!!errors[name] || formData[name] === ''}
            isDisabled={isSubmitted || isLoading}
            type={type}
            placeholder={placeholder}
            isRequired
            // description={name == 'phoneNumber' ? 'Your best number for us to contact you about your account e.g. 0412345678' : ''}
            description={description}
        />
    );

    return (
        <div>

            {/* <Card className="w-full max-w-2xl mx-auto"> */}
            {/* {isLoading && (
                <div className="fixed inset-0 bg-midnight bg-opacity-50 flex text-white items-center justify-center z-50">
                    <Spinner label="Adding customer..." className="text-white" color="white" />
                </div>
            )} */}
            {isLoading && (
                <div className="fixed inset-0 bg-midnight bg-opacity-50 flex text-white items-center justify-center z-50">
                    <div className="bg-midnight rounded p-2 flex items-center bg-opacity-90 px-24 py justify-center align-middle">
                        <Spinner size="lg" color="white" />
                        <p className="mt-2 text-white">Adding customer ...</p>
                    </div>
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
            {/* <CardBody className="p-8 "> */}
            {/* <h1 className="text-3xl font-bold text-center mb-2 text-midnight">{title}</h1>
                <p className="text-center mb-8">{description}</p> */}
            <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {renderField("firstName", "First Name", "Type your first name here")}
                    {renderField("surname", "Last Name", "Type your last name here")}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {renderField("email", "Email", "email@company.com", 'email', 'We will send your monthly invoice to this email address')}

                    {renderField("phoneNumber", "Phone Number", "0412345678", 'tel', 'Australian mobile number starting with 04')}

                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Dropdown size={"md"}>
                        <DropdownTrigger className="min-h-14">
                            <Button
                                isDisabled={isSubmitted || isLoading}
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
                <div>
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
                        isDisabled={isSubmitted || isLoading}
                        isInvalid={!!errors.address}
                        description="Start typing and select your Australian address from the dropdown"
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Input
                        label="Suburb"
                        name="suburb"
                        value={formData.suburb}
                        variant="bordered"
                        isDisabled
                        isRequired
                        placeholder="Auto-filled from address"
                    />
                    <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        variant="bordered"
                        isDisabled
                        isRequired
                        placeholder="Auto-filled from address"
                    />
                    <Input
                        label="Postcode"
                        name="postcode"
                        value={formData.postcode}
                        variant="bordered"
                        isDisabled
                        isRequired
                        placeholder="Auto-filled from address"
                    />
                </div>
            </form>
        </div>

    );
}