import PropTypes from 'prop-types';
import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState } from 'react';
import { Button, Link } from "@nextui-org/react";
import { Check, RotateCcw } from 'lucide-react';

Consent.propTypes = {
    onSave: PropTypes.func,
    updateFormData: PropTypes.func,
    formData: PropTypes.shape({
        sign: PropTypes.string
    }).isRequired,
    isFormSubmitted: PropTypes.bool.isRequired,
}

ConsentRow.propTypes = {
    key: PropTypes.number.isRequired, // Validate children prop
    children: PropTypes.node.isRequired, // Validate children prop
};
function ConsentRow ({ key, children })  {
    return (<tr key={key} className="flex justify-center items-center max-w-lg space-x-2 text-white-600 dark:text-white-400">
        <td style={{ width: '40px' }} className="flex justify-center items-center">
            <Check className="h-5 w-5 bg-ocean p-1 rounded-full text-white font-bold" />
        </td>
        <td style={{ width: 'calc(100% - 40px)' }}>
            <span>
                {children}
            </span>
        </td>
    </tr>);
}
export default function Consent({ updateFormData, formData, onSave, isFormSubmitted }) {
    const sigCanvas = useRef();
    const [imageURL, setImageURL] = useState(formData.sign || null);
    const [isSigned, setIsSigned] = useState(!!formData.sign || null);

    // if (formData.sign) {
    //     setImageURL(formData.sign)
    // }
    const clear = () => {
        sigCanvas.current.clear();
        setImageURL(null);
    };

    const save = () => {
        if (sigCanvas.current.isEmpty()) {
            alert("Please provide a signature first.");
            return;
        }
        const dataURL = sigCanvas.current.toDataURL();
        updateFormData("sign", dataURL)
        setImageURL(dataURL);
        setIsSigned(true);
        if (onSave) {
            onSave(dataURL);
        }
    };

    const redo = () => {
        setImageURL(null);
        setIsSigned(false);
        updateFormData("sign", null)
        sigCanvas.current.clear();
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center flex flex-col justify-center items-center">
            {/* <h1 className="text-3xl font-bold text-center mb-4 text-white">{title}</h1>
            <p className="text-center mb-6">{description}</p> */}
            <div className="mb-4 text-left">
                <table className="w-full">
                    <tbody>
                        <ConsentRow key={1}>
                            have read and accept the <Link isExternal href="https://simplybig.com.au/pages/critical-information-summary" className='underline'> critical information summary</Link>
                        </ConsentRow>
                        <ConsentRow key={2}>
                            have read and accept the <Link href='https://simplybig.com.au/pages/direct-debit-terms-conditions' className='underline'> direct debit terms and conditions</Link>
                        </ConsentRow>
                        <ConsentRow key={3}>
                            authorise your bank account/credit card to be direct debited
                        </ConsentRow>
                        <ConsentRow key={4}>
                            if porting an existing number, you consent as the Rights of Use Holder of the Telecommunications Service to be transferred. *
                        </ConsentRow>
                    </tbody>
                </table>
            </div>
            {isSigned && (
                <p>Saved Signature:</p>
            )}
            <div className="border border-gray-300 bg-white rounded max-w-[300px]">
                {isSigned ? (
                    <img src={imageURL} alt="Saved signature" className="border" />
                ) : (
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{
                            width: 300,
                            height: 150,
                            className: 'signature-canvas'
                        }}
                    />
                )}
            </div>
            {!isSigned && (
                <span className="text-xs">Use your mouse on desktop or finger on mobile to sign.</span>
            )}

            <div className="mt-4 space-x-4">
                {!isSigned ? (
                    <>
                        <Button
                            isDisabled={isFormSubmitted}
                            onClick={clear}
                            color='danger'
                            className="px-4 py-2 text-white rounded"
                        >
                            Clear
                        </Button>
                        <Button
                            isDisabled={isFormSubmitted}
                            color='success'
                            onClick={save}
                            className="px-4 py-2 text-white rounded"
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <Button
                        isDisabled={isFormSubmitted}
                        onClick={redo}
                        color='primary'
                        className="px-4 py-2 text-white rounded flex items-center"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Redo Signature
                    </Button>
                )}
            </div>
        </div>
    );
}
