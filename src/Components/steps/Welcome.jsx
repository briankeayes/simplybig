import React from "react";

export default function Welcome({ NavigationButtons }) {
    return (
        <div className="w-full max-w-2xl mx-auto text-center justify-content-center">
            <img src="/logo.svg" className="max-w-[50%] mx-auto" alt="Logo" />
            <p className="text-white text-xl my-8">
                Please complete the below form to request your SIM card activation.
                <br /><br />
                Alternatively, you can give us a call to process your request over the phone instead on
                <a href="tel:1800531774" className="text-ocean underline"> 1800 531 774</a>.
                <br /><br />
                The critical information summary provides more information about your service. <br /><br />
                <a href="https://simplybig.com.au/pages/critical-information-summary" target="_blank" rel="noopener noreferrer" className="text-ocean underline">
                    Click here to read.
                </a>
            </p>
            {NavigationButtons}
        </div>
    );
}
