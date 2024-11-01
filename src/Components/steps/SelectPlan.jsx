import { useState } from "react";
import PropTypes from 'prop-types';
import { Switch, cn } from "@nextui-org/react";

export default function SelectPlan({ updateFormData, formData, isFormSubmitted }) {

    const [isEnabled, setIsEnabled] = useState(formData.isUpgraded || false);

    const handleUpgradeToggle = (isChecked) => {
        updateFormData("isUpgraded", isChecked);
        setIsEnabled(isChecked)
    };


    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl text-center text-aqua mb-4">Special Offer: <br /><span className="font-bold">Add unlimited calls and SMS to 14 countries</span></h1>
            <div className="space-y-4 text-center max-w-[37rem] align-middle content-center mx-auto">
                <ul className="space-y-2 text-center">
                    {[
                        "Upgrade today for $19/month (save 34%, usually $29/month)",
                        "Includes China, France, Germany, Greece, Hong Kong, India, Ireland, Malaysia, Singapore, South Korea, Thailand, the United Kingdom, the USA, and Vietnam.",
                        // "24/7 priority customer support",
                        // "Flexible plan - modify anytime",
                    ].map((benefit, index) => (
                        <li key={index} className="flex justify-center items-center space-x-2 text-white-600 dark:text-white-400">
                            {/* <Check className="h-5 w-5 bg-ocean p-1 rounded-full text-white font-bold" /> */}
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-center items-center space-x-4 my-6">
                <Switch
                    isDisabled={isFormSubmitted}
                    classNames={{
                        base: cn(
                            "inline-flex flex-row-reverse w-full max-w-md bg-ocean hover:bg-ocean/80 items-center",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                            "data-[selected=true]:border-primary",
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            //selected
                            "group-data-[selected=true]:ml-6",
                            // pressed
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4",
                        ),
                    }}
                    color="success"
                    isSelected={isEnabled}
                    onValueChange={handleUpgradeToggle}

                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium text-white">Add Unlimited International Calls & SMS to 14 countries</p>
                        <p className="text-tiny text-white">
                            Upgrade today for only an extra $19/month (save $10/month).
                        </p>
                    </div>
                </Switch>
            </div>
        </div>
    );
}

SelectPlan.propTypes = {
    // title: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    updateFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        isUpgraded: PropTypes.bool
    }).isRequired,
    isFormSubmitted: PropTypes.bool.isRequired,
};


// function CheckIcon(props) {
//     return (
//         <svg
//             {...props}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//             />
//         </svg>
//     );
// }
// import React, { useState } from 'react';
// import { Card, CardBody, CardHeader, Switch, Button, Progress, cn } from '@nextui-org/react';
// import { Globe, PhoneCall, Zap, Check } from 'lucide-react';

// export default function SelectPlan({ updateFormData, formData, NavigationButtons }) {
//     const [isEnabled, setIsEnabled] = useState(formData.isUpgraded || false);

//     const handleUpgradeToggle = (isChecked) => {
//         setIsEnabled(isChecked);
//         updateFormData("isUpgraded", isChecked);
//     };

//     return (
//         <Card className="w-full max-w-4xl">
//             <CardHeader className="flex flex-col items-center pb-0">
//                 <h2 className="text-2xl font-bold text-white dark:text-white-200">Upgrade to Unlimited International</h2>
//                 <p className="text-white-600 dark:text-white-400">Enhance your global connectivity</p>
//             </CardHeader>
//             <CardBody className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-semibold text-white-700 dark:text-white-300">Plan Features</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 { icon: Globe, text: "Global Coverage in 14 Countries" },
//                                 { icon: PhoneCall, text: "Unlimited International Calls" },
//                                 { icon: Zap, text: "No Hidden Fees" },
//                             ].map((item, index) => (
//                                 <li key={index} className="flex items-center space-x-2 text-white-600 dark:text-white-400">
//                                     <item.icon className="h-5 w-5 text-blue-500" />
//                                     <span>{item.text}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
// <div className="space-y-4">
//     <h3 className="text-lg font-semibold text-white-700 dark:text-white-300">Benefits</h3>
//     <ul className="space-y-2">
//         {[
//             "Predictable monthly costs",
//             "Crystal-clear international calls",
//             "24/7 priority customer support",
//             "Flexible plan - modify anytime",
//         ].map((benefit, index) => (
//             <li key={index} className="flex items-center space-x-2 text-white-600 dark:text-white-400">
//                 <Check className="h-5 w-5 text-green-500" />
//                 <span>{benefit}</span>
//             </li>
//         ))}
//     </ul>
// </div>
//                 </div>
//                 <div className="bg-ocean p-4 rounded-lg">
//                     <div className="flex items-center justify-between">
//                         {/* <span className="font-semibold text-white-700 dark:text-white-300">Enable Unlimited International Plan</span>
//                         <Switch
//                             isSelected={isEnabled}
//                             onValueChange={handleUpgradeToggle}
//                         /> */}
//                         <Switch
//                             classNames={{
//                                 base: cn(
//                                     "inline-flex flex-row-reverse w-full max-w-md bg-ocean hover:bg-aqua items-center",
//                                     "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
//                                     "data-[selected=true]:border-primary",
//                                 ),
//                                 wrapper: "p-0 h-4 overflow-visible",
//                                 thumb: cn("w-6 h-6 border-2 shadow-lg",
//                                     "group-data-[hover=true]:border-primary",
//                                     //selected
//                                     "group-data-[selected=true]:ml-6",
//                                     // pressed
//                                     "group-data-[pressed=true]:w-7",
//                                     "group-data-[selected]:group-data-[pressed]:ml-4",
//                                 ),
//                             }}
//                             isSelected={isEnabled}
//                             onValueChange={handleUpgradeToggle}

//                         >
//                             <div className="flex flex-col gap-1">
//                                 <p className="text-medium text-white">Enable Unlimited International Plan</p>
//                                 <p className="text-tiny text-white text-default-400">
//                                     Get access to unlimited calls to China, France, Germany, Greece, Hong Kong, India, Ireland, Malaysia, Singapore, South Korea, Thailand, the United Kingdom, the USA, and Vietnam.
//                                 </p>
//                             </div>
//                         </Switch>
//                     </div>
//                     <p className="mt-2 text-sm text-white-600 ">
//                         {isEnabled
//                             ? "Great choice! You're set for unlimited global communication."
//                             : "Upgrade now and simplify your international calling experience."}
//                     </p>
//                 </div>
//                 <div className="text-sm text-white-500  italic text-center">
//                     "I never worry about staying in touch with my family overseas now." - Sarah L.
//                 </div>
//             </CardBody>
//         </Card>
//     );
// }