import { useState, useEffect, useRef, useCallback } from "react";
import {
    Button, Input, Spinner, Modal, ModalContent, ModalHeader, ModalBody,
    Link,
    // Dropdown, DropdownTrigger, DropdownMenu, DropdownItem 
} from "@nextui-org/react";
import { API_URL } from "../../constants";
import PropTypes from 'prop-types';

const OtpInput = ({ value, onChange, length = 5 }) => {
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const newValue = e.target.value;
        if (newValue.length <= 1 && /^[0-9]*$/.test(newValue)) {
            const newOtp = value.split('');
            newOtp[index] = newValue;
            onChange(newOtp.join(''));
            if (newValue && index < length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex justify-center gap-2">
            {[...Array(length)].map((_, index) => (
                <Input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    className="w-12 h-12 text-center"
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    size="lg"
                />
            ))}
        </div>
    );
};
export default function SelectNumber({ updateFormData, formData, isFormSubmitted, handleNextStep }) {
    const [availableNumbers, setAvailableNumbers] = useState(formData.availableNumbers || []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const initialFetchMade = useRef(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [transactionId, setTransactionId] = useState(null);
    const [phErrors, setPhErrors] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const providers = ["Telstra", "Optus", "Vodafone"];

    const fetchNumbers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/numbers/reserve`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch numbers');
            }
            const data = await response.json();

            if (!data.status == "success") throw new Error('Failed to fetch numbers', data.message);

            if (data.data.numbers.length == 0) {
                setAvailableNumbers(prevNumbers => {
                    const newNumbers = [...prevNumbers, { id: "das", number: "90909090" }, { id: "da", number: "90909090" }];
                    updateFormData("availableNumbers", newNumbers);
                    return newNumbers;
                });
                setError(null);
                // throw new Error('No numbers available right now.')
            }
            // setAvailableNumbers(prevNumbers => {
            //     const newNumbers = [...data.numbers, ...prevNumbers];
            //     updateFormData("availableNumbers", newNumbers);
            //     return newNumbers;
            // });
            setAvailableNumbers(() => {
                updateFormData("availableNumbers", data.data.numbers);
                return data.data.numbers;
            });
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [updateFormData]);

    const handleGetOtp = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    custNo: formData.custNo,
                    destination: formData.portingNumber,
                }),
            });
            if (!response.ok) throw new Error('Failed to get OTP');
            const data = await response.json();
            // const data = {return:{getOtp:{transactionId:"ewewew"}}}
            setTransactionId(data.data.getOtp.transactionId);
            // console.log(data,transactionId)
            setShowOtpModal(true);
            setTimer(300); // Reset timer to 5 minutes
            setOtp(''); // Clear previous OTP
            setOtpError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to get OTP. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: otp,
                    transactionId: transactionId,
                }),
            });
            if (!response.ok) throw new Error('Failed to verify OTP');
            const data = await response.json();
            console.log(data);
            // const data = {verified:true}
            if (data.data.verifyOtp.valid) {
                setShowOtpModal(false);
                updateFormData("isNumberVerified", true);
                handleNextStep();
                // Handle successful verification (e.g., update formData or move to next step)
            } else {
                throw new Error('Failed to verify OTP');
                // setOtpError('Invalid OTP. Please try again.');
            }
        } catch (err) {
            setOtpError(err);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatResendTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleNumberSelect = (number) => {
        updateFormData("selectedNumber", number.number);
    };

    const handleGetMoreNumbers = () => {
        fetchNumbers();
    };

    const handleExistingNumberChange = (e) => {
        // if (!phoneRegex.test(e.target.value)) {
        //     setPhErrors("Invalid Australian phone number format");
        // } else {
            setPhErrors("");
            updateFormData("portingNumber", e.target.value);
        // }
    };

    const handleARNChange = (e) => {
        updateFormData("arn", e.target.value);
    };

    const handleDobChange = (e) => {
        updateFormData("dob_port", e.target.value);
    };

    // const handleProviderChange = (selectedKeys) => {
    //     updateFormData("provider", Array.from(selectedKeys)[0]);
    // };
    const handleProviderChange = (e) => {
        updateFormData("provider", e.target.value);
    };

    useEffect(() => {
        if (formData.numberType === "new" && availableNumbers.length === 0 && !initialFetchMade.current) {
            initialFetchMade.current = true;
            fetchNumbers();
        }
    }, [formData.numberType, availableNumbers.length, fetchNumbers]);

    useEffect(() => {
        let interval;
        if (showOtpModal && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showOtpModal, timer]);

    const renderNumberButtons = () => {
        const buttons = availableNumbers.map((number, i) => (
            <Button
                isDisabled={isFormSubmitted}
                key={number.id + i}
                color={formData.selectedNumber === number.number ? "primary" : "default"}
                onClick={() => handleNumberSelect(number)}
                className="py-6 text-lg font-semibold"
            >
                {number.number}
            </Button>
        ));

        if (buttons.length > 8) {
            return (
                <div className="max-h-96 overflow-y-scroll pr-2 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {buttons}
                    </div>
                </div>
            );
        }

        return <div className="grid grid-cols-2 gap-4 mb-6">{buttons}</div>;
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* <h1 className="text-3xl font-bold text-center text-white mb-4">{title}</h1>
            <p className="text-center mb-6">{description}</p> */}
            {formData.numberType === "new" ? (
                <>
                    {isLoading && availableNumbers.length === 0 ? (
                        <div className="flex justify-center mb-6">
                            <Spinner label="Loading numbers..." />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 mb-6">{error}</div>
                    ) : (
                        renderNumberButtons()
                    )}
                    <Button
                        isDisabled={isFormSubmitted}
                        // color="secondary"
                        onClick={handleGetMoreNumbers}
                        className="w-full mb-6 bg-aqua"
                        isLoading={isLoading}
                    // isDisabled={!!error}
                    >
                        {isLoading ? "Loading More Numbers..." : "Get More Numbers"}
                    </Button>
                    <div className="text-sm text-white-200">
                        Total numbers available: {availableNumbers.length}
                    </div>
                </>
            ) : (
                <>
                    <Input
                        label="Existing mobile number to be ported to this SIM card"
                        placeholder="Enter your existing number"
                        // value={formData.portingNumber}
                        isRequired={true}
                        onChange={handleExistingNumberChange}
                        className="mb-6"
                        isInvalid={!!phErrors}
                        errorMessage={phErrors}
                        description="Important: This is not your contact number for billing, that is provided below. Only provide an existing mobile number if you want us to contact the provider for this mobile number and transfer it to us, so you can use it on this SIM card."
                    />
                    <div className="flex gap-3">
                        {/* <Dropdown size={"md"} className="mb-6  bg-white">
                            <DropdownTrigger className="min-h-14 bg-gray-100">
                                <Button
                                    isDisabled={isFormSubmitted}
                                    variant="bordered"
                                    className={`w-2/4 justify-start`}
                                >
                                    {formData.provider || "Select Provider"}
                                    {!formData.provider && (<span className='text-red-500'>*</span>)}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Provider selection *"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={formData.provider ? [formData.provider] : []}
                                onSelectionChange={handleProviderChange}
                            >
                                {providers.map((provider) => (
                                    <DropdownItem key={provider}>{provider}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown> */}
                        <Input
                            label="Current Provider"
                            placeholder="Enter your current provider"
                            value={formData.provider}
                            onChange={handleProviderChange}
                            className="mb-6"
                            isDisabled={isFormSubmitted}
                        />
                        <Input
                            label="Account Number"
                            placeholder="Enter your account number"
                            value={formData.arn}
                            description="Found on your invoice from your existing provider"
                            onChange={handleARNChange}
                            className="mb-6"
                            isDisabled={isFormSubmitted}
                        />
                        <Input
                            label="Date of Birth"
                            value={formData.dob_port}
                            onChange={handleDobChange}
                            isDisabled={isLoading || isFormSubmitted}
                            type="date"
                            isRequired
                            description="Enter Date of birth registered with existing provider"
                        />
                    </div>
                    <Button
                        isDisabled={isFormSubmitted || !formData.provider || !formData.arn || !formData.dob_port}
                        color="primary"
                        onClick={handleGetOtp}
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Get OTP
                    </Button>
                    <Link onPress={() => setIsModalOpen(true)} className="text-sm underline w-full justify-center mt-2 cursor-pointer">Cant recieve OTP?</Link>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} >
                        <ModalContent>
                            <>
                                <ModalHeader className="flex flex-col gap-1">Cant Receive OTP</ModalHeader>
                                <ModalBody className="p-5">
                                    <p>
                                        If you are not able to receive the OTP we will need you to provide identity documents
                                        to verify your identity before we can port your number,
                                        please complete this
                                        <Link href="https://www.emailmeform.com/builder/form/k79Dq4ccdL23">form</Link>.


                                    </p>
                                </ModalBody>
                            </>
                            {/* )} */}
                        </ModalContent>
                    </Modal>

                </>
            )}
            <Modal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                className="max-w-[400px]"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold">Enter Your OTP</h3>
                        <p className="text-sm text-gray-500 text-center mt-2">
                            Please enter the 6-digit one-time password sent to your device.
                        </p>
                    </ModalHeader>
                    <ModalBody className="flex flex-col items-center">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            length={6}
                        />
                        {otpError && <p className="text-red-500 mt-4 text-center">{otpError}</p>}
                        {/* {!otpError && otp.length === 5 && (
                            <p className="text-green-500 mt-4 text-center">OTP entered successfully!</p>
                        )} */}
                        <div className="flex flex-col items-center w-full mt-6">
                            <Button
                                color="primary"
                                onClick={handleVerifyOtp}
                                isLoading={isLoading}
                                isDisabled={otp.length !== 6 || isFormSubmitted}
                                className="w-full mb-4"
                            >
                                Confirm OTP
                            </Button>
                            <Button
                                color="secondary"
                                onClick={handleGetOtp}
                                // isLoading={isLoading}
                                isDisabled={timer > 0 || isFormSubmitted}
                                className="w-full"
                            >
                                {timer > 0 ? `Resend OTP (${formatResendTime()})` : 'Resend OTP'}
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}

SelectNumber.propTypes = {
    updateFormData: PropTypes.func.isRequired,
    handleNextStep: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        // numberType: PropTypes.oneOf(['new','existing'])
        availableNumbers: PropTypes.array,
        custNo: PropTypes.string,
        phoneNumber: PropTypes.string,
        selectedNumber: PropTypes.string,
        arn: PropTypes.string,
        provider: PropTypes.string,
        dob: PropTypes.any,
        dob_port: PropTypes.any,
        portingNumber: PropTypes.string,
        numberType: PropTypes.oneOf(["new", "existing"])
    }).isRequired,
    isFormSubmitted: PropTypes.bool.isRequired
};

OtpInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    length: PropTypes.number
};

OtpInput.defaultProps = {
    length: 5
};
