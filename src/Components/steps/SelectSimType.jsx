import { Button } from "@nextui-org/react";
import PropTypes from 'prop-types';

export default function SelectSimType({ updateFormData, formData, handleNextStep, isFormSubmitted }) {
    const handleSimTypeChange = (type) => {
        updateFormData("simType", type);
        handleNextStep();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Select SIM Type</h1>
            <p className="text-center text-gray-400 mb-6">Choose between physical SIM or eSIM</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    isDisabled={isFormSubmitted}
                    color={formData.simType === "physical" ? "primary" : "default"}
                    className="px-6 py-3 rounded-full"
                    onClick={() => handleSimTypeChange("physical")}
                >
                    Physical SIM
                </Button>
                <Button
                    isDisabled={isFormSubmitted}
                    color={formData.simType === "esim" ? "primary" : "default"}
                    className="px-6 py-3 rounded-full"
                    onClick={() => handleSimTypeChange("esim")}
                >
                    eSIM
                </Button>
            </div>
        </div>
    );
}

SelectSimType.propTypes = {
    updateFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        simType: PropTypes.string
    }).isRequired,
    handleNextStep: PropTypes.func.isRequired,
    isFormSubmitted: PropTypes.bool.isRequired
};