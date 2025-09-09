import { Button } from "@nextui-org/react";
import PropTypes from 'prop-types';

export default function SelectSimType({ updateFormData, formData, handleNextStep, isFormSubmitted }) {
    const handleSimTypeChange = (type) => {
        console.log("type", type);
        updateFormData("simType", type);
        handleNextStep();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
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