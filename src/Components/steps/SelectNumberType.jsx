import PropTypes from 'prop-types';
import { Button } from "@nextui-org/react";

SelectNumberType.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    updateFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        numberType: PropTypes.oneOf(['new','existing',''])
    }).isRequired,
    handleNextStep: PropTypes.func.isRequired,
    isFormSubmitted: PropTypes.bool.isRequired,
};
export default function SelectNumberType({ title, description, updateFormData, formData, handleNextStep, isFormSubmitted }) {
    const handleNumberTypeChange = (type) => {
        updateFormData("numberType", type);
        handleNextStep();
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-4 text-white">{title}</h1>
            <p className="text-center mb-6">{description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    isDisabled={isFormSubmitted}
                    color={formData.numberType === "new" ? "primary" : "default"}
                    className={`px-6 py-3 rounded-full ${formData.numberType === "new"
                        ? "bg-ocean text-white"
                        : "bg-white text-midnight "
                        }`}
                    onClick={() => handleNumberTypeChange("new")}
                >
                    New Number
                </Button>
                <Button
                    isDisabled={isFormSubmitted}
                    color={formData.numberType === "existing" ? "primary" : "default"}
                    className={`px-6 py-3 rounded-full ${formData.numberType === "existing"
                        ? "bg-ocean text-white"
                        : "bg-white text-midnight "
                        }`}
                    onClick={() => handleNumberTypeChange("existing")}
                >
                    Existing Number
                </Button>
            </div>
        </div>
    );
}
