import { Link } from "@nextui-org/react";

export default function Welcome() {
    return (
        <div className="w-full max-w-2xl mx-auto text-center justify-content-center">
            <div className="flex flex-row items-center justify-center">

                <h1 className="text-[4rem] text-cloud-nine text-center mb-4">
                    Welcome to
                </h1>
                <img src="/logo.svg" className="max-w-[50%] ml-4" alt="Logo" />
            </div>

            <div className="text-xl my-8 text-cloud-nine">
                <p className="mb-4">
                    Press Next to begin activation of your SIM card.
                </p>
                {/* <p className="mb-4">
                    Alternatively, you can give us a call to process your request over the phone instead on
                    <a href="tel:1800531774" className="text-ocean underline"> 1800 531 774</a>.
                </p> */}
                <p className="mb-4">
                    The  
                <Link isExternal href="https://simplybig.com.au/pages/critical-information-summary" className="text-cloud-nine mx-1 text-xl underline">
                    critical information 
                </Link>
                summary provides more information about your service.
                </p>

            </div>
        </div>
    );
}
