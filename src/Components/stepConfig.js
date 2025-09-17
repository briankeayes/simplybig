// stepConfig.js
export const STEPS = [
  {
    key: 'welcome',
    title: 'Welcome',
    description: 'Get started with Simply Big',
    component: 'Welcome', // This should match the import name in MainContent
  },
  // {
  //   key: "simType",
  //   title: "Select SIM Type",
  //   description: "Choose between new SIM card or existing SIM card",
  //   component: "SelectSimType",
  // },
  {
    key: 'simNumber',
    title: 'Enter SIM Number',
    description: 'Enter the 13 digit number found on the new SIM card we sent you e.g. 4000031612571',
    component: 'SimNumber',
    condition: (formData) => formData.simType === "physical", // Only show for physical SIM
  },
  {
    key: 'numberType',
    title: 'Select Number Type',
    description: 'Choose between new number or existing number',
    component: 'SelectNumberType',
  },
  {
    key: 'accountDetails',
    title: 'Account Details',
    description: 'Enter your billing information',
    component: 'AccountDetails',
  },
  {
    key: 'selectPlan',
    title: 'International Plan',
    description: 'Upgrade your plan',
    component: 'SelectPlan',
  },
  {
    key: 'selectNumber',
    title: (formData) => formData.numberType === 'existing' ? 'Confirm Existing Number' : 'Select Number',
    description: (formData) => formData.numberType === 'existing' ? 'Confirm your existing phone number' : 'Choose your phone number',
    component: 'SelectNumber',
  },
  {
    key: 'payment',
    title: 'Add your payment method',
    description: 'You can select to pay via card or bank account.',
    component: 'Payment',
  },
  {
    key: 'consent',
    title: 'Consent',
    description: 'Please sign to indicate that you:',
    component: 'Consent',
  },
  {
    key: 'results',
    title: 'Congrats!',
    description: 'Your request to activate your SIM card has been received.',
    component: 'Results',
  },
];

// export const getVisibleSteps = () => {
//   return STEPS
//   //.filter(step => !step.condition || step.condition(formData));
// };
export const getVisibleSteps = (formData) => {
  return STEPS
    .filter((step) => !step.condition || step.condition(formData))
    .map((step) => ({
      ...step,
      title: typeof step.title === "function" ? step.title(formData) : step.title,
      description:
        typeof step.description === "function"
          ? step.description(formData)
          : step.description,
    }));
};
