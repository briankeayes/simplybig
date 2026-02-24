import { useState } from "react";
import PropTypes from "prop-types";
import { Input, Spinner } from "@nextui-org/react";
import { API_URL } from "../../constants";
export default function SimNumber({
  updateFormData,
  setIsSimNumberValid,
  formData,
  isFormSubmitted,
}) {
  const [errors, setErrors] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const verifySIMNumber = async (simNumber) => {
    setIsVerifying(true);
    setErrors("");
    try {
      const response = await fetch(`${API_URL}/numbers/check/${simNumber}`);
      const result = await response.json();

      if (!result.data?.success) {
        const errorMsg =
          result.data?.errorMessage === "No resource record found"
            ? "SIM number not found. Please confirm you have entered the correct number and try again."
            : result.data?.errorMessage || "SIM number verification failed";
        setErrors(errorMsg);
        setIsSimNumberValid(false);
      } else if (
        result.data?.queryPooledResources?.[0]?.internalStatus === "IN_USE"
      ) {
        setErrors(
          "This SIM number is already in use by another customer. Please enter a different number.",
        );
        setIsSimNumberValid(false);
      } else {
        setErrors("");
        setIsSimNumberValid(true);
      }
    } catch (error) {
      setErrors("Unable to verify SIM number. Please try again.");
      setIsSimNumberValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Remove any non-digit characters
    const numericValue = value.replace(/\D/g, "");

    // Validate input to allow only numbers and check length
    if (/^\d*$/.test(numericValue)) {
      if (numericValue.length > 13) {
        setErrors("Please enter exactly 13 digits");
        setIsSimNumberValid(false);
      } else if (numericValue.length === 13) {
        updateFormData(name, numericValue);
        // Keep invalid until API verification completes
        setIsSimNumberValid(false);
        verifySIMNumber(numericValue);
      } else {
        setIsSimNumberValid(false);
        setErrors(`Please enter ${13 - numericValue.length} more digit(s)`);
        updateFormData(name, numericValue);
      }
    } else {
      setIsSimNumberValid(false);
      setErrors("Please enter numbers only");
    }
  };

  return (
    <div>
      {/* <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
                    <p className="text-center mb-6">{description}</p> */}
      <Input
        isDisabled={isFormSubmitted || isVerifying}
        className="mb-4"
        isRequired
        label="SIM Number"
        name="simNumber"
        value={formData.simNumber}
        onChange={handleInputChange}
        variant="bordered"
        errorMessage={errors}
        isInvalid={!!errors}
        type="text"
        placeholder="Enter your SIM number"
        endContent={isVerifying && <Spinner size="sm" />}
      />
    </div>
  );
}

SimNumber.propTypes = {
  // title: PropTypes.string.isRequired,
  // description: PropTypes.string.isRequired,
  updateFormData: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    simNumber: PropTypes.string,
  }).isRequired,
  isFormSubmitted: PropTypes.bool.isRequired,
  setIsSimNumberValid: PropTypes.func.isRequired,
};

// import React, { useState } from "react";
// import { Input, Button } from "@nextui-org/react";

// export default function SimNumber({ title,description, updateFormData, formData, handleNextStep }) {

//     const [errors, setErrors] = useState("");
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         updateFormData(name, value);
//     };

//     return (
//         <div className="w-full max-w-2xl mx-auto p-6 rounded-lg">
//             <h1 className="text-3xl font-bold text-center mb-4 text-white">{title}</h1>
//             <p className="text-center text-ocean mb-6">{description}</p>
//             <Input
//                 className="mb-4"
//                 isRequired
//                 label={"SIM Number"}
//                 name={"simNumber"}
//                 value={formData.simNumber}
//                 onChange={handleInputChange}
//                 variant="bordered"
//                 errorMessage={errors}
//                 isInvalid={!!errors || formData["simNumber"] === ''}
//                 // isDisabled={isSubmitted || isLoading}
//                 type={"text"}
//                 placeholder={"Enter your SIM number"}
//             />
//         </div>
//     );
// }
