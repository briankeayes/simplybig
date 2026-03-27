import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
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
    preferredContactMethod: PropTypes.oneOf(["Email", "SMS", ""]),
    custType: PropTypes.oneOf(["B", "R", ""]),
    abn: PropTypes.string,
    custNo: PropTypes.string, // For the success message
  }).isRequired,
  onValidationChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
};

export default function AccountDetails({
  updateFormData,
  formData,
  onValidationChange,
  isLoading,
  isSubmitted,
}) {
  const salutations = ["Mr", "Mrs", "Ms", "Mstr", "Miss", "Dr", "Mx", "Other"];
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
          newErrors[name] =
            `${name === "firstName" ? "First" : "Last"} name is required`;
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
          newErrors.preferredContactMethod =
            "Preferred contact method is required";
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
          newErrors.abn =
            "Valid 11-digit ABN is required for business customers";
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
          newErrors.phoneNumber =
            "Phone number must be 10 digits (e.g. 0412345678)";
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
      const requiredFields = [
        "firstName",
        "surname",
        "email",
        "address",
        "postcode",
        "state",
        "suburb",
        "custType",
        "dob",
        "preferredContactMethod",
        "sal",
      ];
      const isValid =
        requiredFields.every((field) => formData[field]) &&
        Object.keys(errors).length === 0;
      onValidationChange(isValid);
      return isValid;
    };

    validateForm();
  }, [formData, errors, onValidationChange]);

  const renderField = (
    name,
    label,
    placeholder,
    type = "text",
    description = "",
  ) => (
    <Input
      label={label}
      name={name}
      value={formData[name]}
      onChange={handleInputChange}
      variant="bordered"
      errorMessage={errors[name]}
      isInvalid={!!errors[name] || formData[name] === ""}
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
              <h2 className="text-2xl font-bold mb-4 text-midnight">
                Account Created Successfully!
              </h2>
              <p className="mb-4 text-ocean">Your customer number is:</p>
              <p className="text-3xl font-bold mb-6 text-indigo">
                {formData.custNo}
              </p>
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
          {renderField(
            "email",
            "Email",
            "email@company.com",
            "email",
            "We will send your monthly invoice to this email address",
          )}

          {renderField(
            "phoneNumber",
            "Phone Number",
            "0412345678",
            "tel",
            "Australian mobile number starting with 04",
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Dropdown size={"md"}>
            <DropdownTrigger className="min-h-14">
              <Button
                isDisabled={isSubmitted || isLoading}
                variant="bordered"
                className={`w-full justify-start ${errors.sal ? "border-red-500" : ""}`}
              >
                {formData.sal || "Select Salutation"}
                {!formData.sal && <span className="text-red-500">*</span>}
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

          {renderField(
            "dob",
            "Date of Birth",
            "Select your date of birth",
            "date",
          )}
        </div>
        <div>
          <p className="text-default-500 text-xs mb-2">
            <b>Australian address required.</b> This is the address also
            provided to emergency services for the end user.
          </p>
          <Input
            isRequired
            label="Address"
            name="address"
            placeholder="Enter your street address"
            value={formData.address}
            onChange={handleInputChange}
            variant="bordered"
            errorMessage={errors.address}
            isDisabled={isSubmitted || isLoading}
            isInvalid={!!errors.address}
            description="Enter your full Australian street address"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input
            label="Suburb"
            name="suburb"
            value={formData.suburb}
            onChange={handleInputChange}
            variant="bordered"
            isDisabled={isSubmitted || isLoading}
            isRequired
            placeholder="Enter suburb"
          />
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            variant="bordered"
            isDisabled={isSubmitted || isLoading}
            isRequired
            placeholder="Enter state"
          />
          <Input
            label="Postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            variant="bordered"
            isDisabled={isSubmitted || isLoading}
            isRequired
            placeholder="Enter postcode"
          />
        </div>
      </form>
    </div>
  );
}
