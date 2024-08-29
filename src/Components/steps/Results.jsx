import React from "react";
import { Accordion, AccordionItem, CardBody, Card, CardHeader } from "@nextui-org/react";

export default function Results({ handlePrevStep, formData, handleSubmit }) {
  const faqs = [
    {
      title: "How long will activation take?",
      content: "We will process your activation request including moving your existing phone number. This may take from a few hours to a day to complete and we will email you once it is active. If you submit this form outside of business hours it will be processed on the next business day. During the holiday period activations may be delayed 1-2 business days. Thanks for your patience."
    },
    {
      title: "When will I be billed?",
      content: "Your first invoice will be sent on the 5th of the month for the pro-rata amount for between now and then plus for the next month in advance. You will then receive an invoice on the 5th of every subsequent month for the next month in advance. This will be direct debited from your nominated account."
    },
    {
      title: "Can I cancel?",
      content: "You can cancel any time and any unused portion will be refunded to your nominated account."
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto text-center justify-content-center">
      <h2 className="text-4xl mb-4">Congrats!</h2>
      <p className="mb-4">Your request to activate your SIM card has been received.</p>
      <p className="mb-4">We will email you once it has been activated, and you can then insert the SIM card. This usually happens within a few minutes but can take longer if we are transferring an existing number.</p>
      <Card className="bg-ocean text-white">
        <CardHeader className="text-2xl mb-4 text-center">
          <h3>Commonly asked questions!</h3>
        </CardHeader>
        <CardBody>
          <Accordion showDivider={true} fullWidth={false} itemClasses={{ title: "text-white", content: "text-left" }} >
            {faqs.map((faq, i) => (
              <AccordionItem key={i} aria-label={"accordion" + i} title={faq.title}>
                {faq.content}
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
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
