import React from "react";

export default function Welcome({ NavigationButtons }) {
    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to Simply Big{" "}
                <span role="img" aria-label="wave">
                    👋
                </span>
            </h1>
            <p className="text-xl text-ocean mb-8">Get started with your new account and choose your perfect plan.</p>
            {NavigationButtons}
        </div>
    );
}