// stepConfig.js
export const STEPS = [
    {
      key: 'welcome',
      title: 'Welcome',
      description: 'Get started with Simply Big',
      component: 'Welcome', // This should match the import name in MainContent
    },
    {
      key: 'simNumber',
      title: 'Enter SIM Number',
      description: 'Enter SIM number to begin actiavation.',
      component: 'SimNumber',
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
      title: 'Select Number',
      description: 'Choose your phone number',
      component: 'SelectNumber',
      condition: (formData) => formData.numberType === 'new',
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
      title: 'Results',
      description: 'Your registration is complete',
      component: 'Results',
    },
  ];
  
  export const getVisibleSteps = (formData) => {
    return STEPS.filter(step => !step.condition || step.condition(formData));
  };