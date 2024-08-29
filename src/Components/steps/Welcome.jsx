import React from "react";
import { Link } from "@nextui-org/react";

export default function Welcome({ NavigationButtons }) {
    return (
        <div className="w-full max-w-2xl mx-auto text-center justify-content-center">
            <img src="/logo.svg" className="max-w-[50%] mx-auto" alt="Logo" />
            <div className="text-white text-xl my-8">
                <p className="mb-4">
                    Please complete the below form to request your SIM card activation.
                </p>
                <p className="mb-4">
                    Alternatively, you can give us a call to process your request over the phone instead on
                    <a href="tel:1800531774" className="text-ocean underline"> 1800 531 774</a>.
                </p>
                <p className="mb-4">
                    The critical information summary provides more information about your service.
                </p>
                <Link isExternal href="https://simplybig.com.au/pages/critical-information-summary" className="ml-1 text-blue-600 hover:underline">
                    Click here to read.
                </Link>

            </div>
            {NavigationButtons}
        </div>
    );
}
