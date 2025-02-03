import { Accordion, AccordionItem, CardBody, Card, CardHeader, Spinner } from "@nextui-org/react";
import PropTypes from 'prop-types';

Results.propTypes = {
  // title: PropTypes.string.isRequired,
  // description: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isFormSubmitted: PropTypes.bool.isRequired,
  createdOrder: PropTypes.shape({
    success: PropTypes.bool,
    orderId: PropTypes.string,
  })
};

export default function Results({ isLoading, createdOrder }) {
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
      {isLoading && (
        <div className="fixed inset-0 bg-midnight bg-opacity-50 flex text-white items-center justify-center z-50">
          <div className="bg-midnight rounded p-2 flex items-center bg-opacity-90 px-24 py justify-center align-middle">
            <Spinner size="lg" color="white" />
            <p className="mt-2 text-white">Creating your order ...</p>
          </div>
        </div>
      )}
      {createdOrder.success && (
        <p className="mb-4">Your Order ID is: {createdOrder.orderId}</p>
      )}
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