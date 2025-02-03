import PropTypes from 'prop-types';
import { Button } from "@nextui-org/react";

SelectNumberType.propTypes = {
    updateFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        numberType: PropTypes.oneOf(['new', 'existing', '']),
        numType: PropTypes.oneOf(['prepaid', 'postpaid', ''])
    }).isRequired,
    handleNextStep: PropTypes.func.isRequired,
    isFormSubmitted: PropTypes.bool.isRequired,
};
export default function SelectNumberType({ updateFormData, formData, handleNextStep, isFormSubmitted }) {
    const handleNumberTypeChange = (type) => {
        updateFormData("numberType", type);
        if ("new" == type) {
            handleNextStep();
        }
    };
    const handlePaidTypeChange = (type) => {
        updateFormData("numType", type);
        handleNextStep();
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    isDisabled={isFormSubmitted}
                    color={formData.numberType === "new" ? "primary" : "default"}
                    className={`px-6 py-3 rounded-full ${formData.numberType === "new"
                        ? "bg-ocean text-white"
                        : "bg-ocean/30 text-midnight "
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
                        : "bg-ocean/30 text-midnight "
                        }`}
                    onClick={() => handleNumberTypeChange("existing")}
                >
                    Existing Number
                </Button>
                {formData.numberType === "existing" && (
                    <>
                        <h2 className="col-span-2 pt-2 text-xl font-bold text-midnight text-center mb-4">Please specify if its a Prepaid or a Postpaid number</h2>
                        <Button
                            isDisabled={isFormSubmitted}
                            color={formData.numberType === "prepaid" ? "primary" : "default"}
                            className={`px-6 py-3 rounded-full ${formData.numType === "prepaid"
                                ? "bg-ocean text-white"
                                : "bg-ocean/30 text-midnight "
                                }`}
                            onClick={() => handlePaidTypeChange("prepaid")}
                        >
                            Prepaid
                        </Button>
                        <Button
                            isDisabled={isFormSubmitted}
                            color={formData.numberType === "postpaid" ? "primary" : "default"}
                            className={`px-6 py-3 rounded-full ${formData.numType === "postpaid"
                                ? "bg-ocean text-white"
                                : "bg-ocean/30 text-midnight "
                                }`}
                            onClick={() => handlePaidTypeChange("postpaid")}
                        >
                            Postpaid
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
