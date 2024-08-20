import React from "react";
import { Card, Avatar, Divider } from "@nextui-org/react";

export default function Results({ handlePrevStep, formData, handleSubmit }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-cloud-nine">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <Avatar
            src=""
            alt="User Avatar"
            className="w-16 h-16 bg-ocean text-white"
            fallback={formData.firstName.charAt(0) + formData.surname.charAt(0)}
          />
          <div className="space-y-1 text-center">
            <div className="text-lg font-medium text-midnight">
              {formData.firstName} {formData.surname}
            </div>
            <div className="text-sm text-ocean">
              {formData.email}
            </div>
          </div>
        </div>
        <Divider className="my-6 bg-indigo" />
        <div className="space-y-2 text-center">
          <div className="text-2xl font-bold text-midnight">
            Plan: {formData.selectedPlan}
          </div>
          <div className="text-xl font-bold text-ocean">
            Number: {formData.selectedNumber || formData.existingNumber}
          </div>
        </div>
        <Divider className="my-6 bg-indigo" />
        <div className="space-y-2 text-center">
          <CircleCheckIcon className="mx-auto h-8 w-8 text-aqua" />
          <p className="text-lg font-medium text-midnight">Your purchase was successful!</p>
          <p className="text-sm text-ocean">
            Please check your email for further details.
          </p>
        </div>
      </Card>
    </div>
  );
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
