import { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, Link, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Spinner, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { LockIcon } from "lucide-react";
import { API_URL } from "../../constants";
import PropTypes from 'prop-types';

const CheckIcon = ({
    size = 18,
    height = 24,
    width = 24,
    ...props
}) => {
    return (
        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor" />
        </svg>
    );
};

export default function Payment({ title, description, updateFormData, formData, isFormSubmitted }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const creditCardFrameRef = useRef(null);
    const bankAccountFrameRef = useRef(null);
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isBankSelected, setIsBankSelected] = useState(false);
    const [isBankNote, setIsBankNote] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);

    const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

    const mode = "test";
    const publishableApiKey = mode === "test"
        ? "QUICKSTREAMDEMO_PUB"
        : "TIAB_PUB_jqiyv6fcvvskukbm96reinkd2g97d8g8pip6tf7mazu8u6kyxds2gme5z5aa";
    const scriptUrl = mode === "test"
        ? "https://api.quickstream.support.qvalent.com/rest/v1/quickstream-api-1.0.min.js"
        : "https://api.quickstream.westpac.com.au/rest/v1/quickstream-api-1.0.min.js";

    const supplierBusinessCode = "QUICKSTREAMDEMO";



    useEffect(() => {

        if (formData.paymentToken) return setIsScriptLoaded(true);

        const loadScript = (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = url;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initializeQuickstream = async () => {
            if (!window.QuickstreamAPI) {
                try {
                    await loadScript(scriptUrl);
                    window.QuickstreamAPI.init({ publishableApiKey: publishableApiKey });
                    setIsScriptLoaded(true);
                } catch (error) {
                    console.error("Error loading Quickstream script:", error);
                }
            } else {
                setIsScriptLoaded(true);
            }
        };

        initializeQuickstream();
    }, [scriptUrl, publishableApiKey, formData.paymentToken]);

    useEffect(() => {
        if (!isScriptLoaded) return;

        if (formData.paymentToken) return;

        const options = {
            config: {
                supplierBusinessCode: supplierBusinessCode,
            },
            iframe: {
                width: "100%",
                height: "100%",
                style: {
                    "font-size": "14px",
                    "line-height": "24px",
                    "min-height": "22rem",
                    width: "300px",
                    color: 'white'
                },
            },
        };

        const createTrustedFrames = () => {
            setIsSubmitting(true);

            window.QuickstreamAPI.creditCards.createTrustedFrame(
                {
                    ...options,
                    // onUpdate: (state) => handleFormUpdate(state, 'credit')
                },
                (errors, data) => handleTrustedFrameCallback(errors, data, 'credit')
            );

            window.QuickstreamAPI.bankAccounts.createTrustedFrame(
                {
                    config: { supplierBusinessCode: supplierBusinessCode },
                    iframe: { width: "100%", height: "9rem" },
                    // onUpdate: (state) => handleFormUpdate(state, 'bank')
                },
                (errors, data) => handleTrustedFrameCallback(errors, data, 'bank')
            );
        };

        createTrustedFrames();
    }, [formData.paymentToken, isScriptLoaded]);


    const handleTrustedFrameCallback = (errors, data, frameType) => {
        if (data) {
            if (frameType === 'credit') {
                creditCardFrameRef.current = data.trustedFrame;
            } else if (frameType === 'bank') {
                bankAccountFrameRef.current = data.trustedFrame;
            }
            setIsSubmitting(false);
        } else if (errors) {
            console.log(`Errors for ${frameType}:`, errors);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const currentFrame = paymentMethod === 'credit' ? creditCardFrameRef.current : bankAccountFrameRef.current;

        if (!currentFrame) return;

        setShowLoadingOverlay(true);

        try {
            await new Promise((resolve, reject) => {
                currentFrame.submitForm((errors, data) => {
                    if (errors) {
                        console.log("Errors: " + JSON.stringify(errors));
                        reject(errors);
                    } else {
                        console.log("Payment data:", data);
                        setPaymentSuccess(true);
                        updateFormData('paymentToken', data.token)
                        resolve(data);
                    }
                });
            });

            // updateFormData('paymentCompleted', true);
        } catch (error) {
            console.error("Payment failed:", error);

            setErrorMsg(error)

        } finally {
            setShowLoadingOverlay(false);
        }
    };

    const handlePaymentMethodChange = (isChecked) => {
        setPaymentMethod(isChecked ? "bank" : "credit");
    };

    useEffect(() => {
        handlePaymentMethodChange(isBankSelected);
    }, [isBankSelected]);

    const attachPaymentMethod = async (paymentTokenId, custNo) => {
        try {
            setShowLoadingOverlay(true);

            const response = await fetch(`${API_URL}/addPaymentMethod`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentTokenId, custNo }),
            });

            if (!response.ok) throw new Error('Failed to add payment method');

            const data = await response.json();
            console.log('API Response:', data);

        } catch (error) {
            console.error('Error adding payment method:', error);
            // Handle error (you might want to show an error message to the user)
        } finally {
            setShowLoadingOverlay(false);
        }
    }

    useEffect(() => {
        if (!paymentSuccess || !formData.paymentToken || !formData.custNo) return;
        attachPaymentMethod(formData.paymentToken, formData.custNo)
    }, [formData.custNo, formData.paymentToken, paymentSuccess]);

    return (
        <div className="w-full max-w-4xl mx-auto relative">
            <h1 className="text-3xl font-bold text-center mb-4 text-white">{title}</h1>
            <p className="text-center mb-6">{description}</p>
            <div className="flex flex-row content-center justify-center mb-4">
                <Popover showArrow backdrop="blur">
                    <PopoverTrigger>
                        <Button size="sm" color="success"><LockIcon /> PROTECTED IN VAULT</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="px-1 py-2">
                            <div className="text-small font-bold">Vault</div>
                            <div className="text-tiny max-w-32">Data collected via fields that have our security seal are encrypted and stored with the highest global security standard — PCI compliance. Your data is absolutely safe in Vault.</div>
                        </div>
                    </PopoverContent>
                </Popover>

            </div>

            {(paymentSuccess || formData.paymentToken) && (
                <div className="fixed inset-0 bg-midnight bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-96 bg-aqua/90">
                        <CardBody className="text-center">
                            <h2 className="text-2xl font-bold mb-4 text-white">Payment method added successfully!</h2>
                        </CardBody>
                    </Card>
                </div>
            )}


            <div className="flex justify-center items-center mb-6 space-x-4">
                <Button
                    radius="full"
                    isDisabled={isFormSubmitted}
                    onClick={() => (setIsBankSelected(false))}
                    className={`${paymentMethod === 'credit'
                        ? "bg-gradient-to-br from-indigo to-pink-500"
                        : "bg-gradient-to-br from-gray-300 to-gray-400"}`}
                    startContent={paymentMethod === 'credit' ? <CheckIcon /> : null}
                >
                    Credit Card
                </Button>

                {/* <Switch
                        isSelected={isBankSelected}
                        onValueChange={setIsBankSelected}
                    /> */}

                <Button
                    isDisabled={isFormSubmitted}
                    radius="full"
                    onClick={() => (setIsBankSelected(true))}
                    className={`${paymentMethod === 'bank'
                        ? "bg-gradient-to-br from-indigo to-pink-500"
                        : "bg-gradient-to-br from-gray-300 to-gray-400 "}`}
                    startContent={paymentMethod === 'bank' ? <CheckIcon /> : null}
                >
                    Bank Account
                </Button>
            </div>
            {/* {paymentMethod === 'credit' && ( */}
            <div className="flex justify-center items-center mb-6 space-x-4">
                {paymentMethod === 'credit' ?
                    (
                        <span className="text-xs italic text-gray-700">
                            *1.1% Fee would be charged for Credit Card transactions
                        </span>
                    ) : (
                        <span className="text-xs italic underline text-gray-700 cursor-pointer" onClick={() => { setIsBankNote(true) }}>
                            *Important note for Direct Debit transactions
                        </span>
                    )
                }

            </div>
            {/* )} */}


            <form id="payment-form" onSubmit={handleSubmit}>
                <div className="flex flex-row justify-center align-middle gap-6">
                    <div className={`${paymentMethod === 'credit' ? '' : 'hidden'} border p-4 rounded`} data-quickstream-api="creditCardContainer"></div>
                    <div className={`${paymentMethod === 'bank' ? '' : 'hidden'} border p-4 rounded`} data-quickstream-api="bankAccountContainer"></div>
                </div>
                <div className="flex justify-center mt-6">
                    <Button className="bg-aqua" variant="bordered" type="submit" isDisabled={isSubmitting || isFormSubmitted}>Pay</Button>
                </div>
            </form>


            {showLoadingOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white text-center">
                        <Spinner size="lg" color="white" />
                        <p className="mt-2">Processing Payment</p>
                    </div>
                </div>
            )}
            {!isScriptLoaded && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white text-center">
                        <Spinner size="lg" color="white" />
                        <p className="mt-2">Loading ...</p>
                    </div>
                </div>
            )}

            <Modal isOpen={isBankNote} onClose={() => { setIsBankNote(false) }} scrollBehavior="inside">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Direct Debit Note</ModalHeader>
                            <ModalBody>
                                <h3 className="mb-4 text-xl font-bold">
                                    Before making a direct debit request we recommend you:
                                </h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Check with your financial institution that the account you want to nominate can support direct debits and whether any additional charges apply.</li>
                                    <li>Confirm that the account details that you have provided are correct.</li>
                                    <li>Ensure that you have sufficient cleared funds in your account to cover payment when due. Your financial institution may charge a fee if payment cannot be met.</li>
                                </ul>
                                <p className="mb-2">You must tell us in writing if you close or change the account that you have previously nominated.</p>
                                <p className="mb-4">You may cancel your direct debit request by calling us.</p>

                                <p className="mb-4">You will be given a pro rata refund for unused portion you paid in advance. You can cancel at any time. In the case of a refund being required, our policy is only refunding payments back to the original account.</p>

                                <p className="mb-4">We will require up to 5 business days to process a change to your direct debit request.</p>

                                <p className="mb-4">It is your responsibility to arrange a suitable alternative payment method if the direct debit arrangements are cancelled, either by you or the nominated financial institution. You should check your account statement from your financial institution to verify that the amounts debited from your account are correct. If you believe that a debit has not been correctly processed you should immediately contact us.</p>

                                <p className="mb-4">You agree to indemnify us against all losses, costs, damages and liability that we incur arising from you breaching these terms and conditions or providing us an invalid or non-binding direct debit request. This indemnity is a continuing obligation, separate and independent from your other obligations and survives termination of this agreement. This indemnity does not apply as a result of our fraud, negligence or breach of trust.</p>

                                <p className="mb-2">Have you had an opportunity to read our critical information summary which has our terms and conditions?</p>
                                <p>
                                    If no, it is available on our website - would you like to take a few minutes to read it?
                                    <Link isExternal href="https://simplybig.com.au/pages/critical-information-summary" className="ml-1 text-blue-600 hover:underline">
                                        Read Terms and Conditions
                                    </Link>
                                </p>

                            </ModalBody>
                            <ModalFooter />
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal isOpen={errorMsg.length > 0} onClose={() => { setErrorMsg([]) }} >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Payment Error</ModalHeader>
                            <ModalBody className="gap-0">
                                <h3 className="mb-4 text-xl font-bold">
                                    Following error occured while processing your payment:
                                </h3>
                                {errorMsg.map((err) => (
                                    <>
                                        <p className="mt-4 underline">{String(err.fieldName).toLocaleUpperCase()} Error: </p>
                                        <ol className="mt-0 indent-10">
                                            {err.messages.map((msg, i) => (
                                                <li key={i}> - {msg} </li>
                                            ))}
                                        </ol>
                                    </>
                                ))}
                            </ModalBody>
                            <ModalFooter />
                        </>
                    )}
                </ModalContent>
            </Modal>

        </div>
    );
}

Payment.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    updateFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        // numberType: PropTypes.oneOf(['new','existing'])
        custNo: PropTypes.string.isRequired,
        paymentToken: PropTypes.string,
    }).isRequired,
    isFormSubmitted: PropTypes.bool.isRequired
};

CheckIcon.propTypes = {
    size: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
};