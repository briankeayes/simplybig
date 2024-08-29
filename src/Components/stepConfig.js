// stepConfig.js
export const STEPS = [
    {
      key: 'welcome',
      title: 'Welcome',
      description: 'Get started with Simply Big',
      component: 'Welcome', // This should match the import name in MainContent
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
      description: 'Enter your personal information',
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
      title: 'Payment',
      description: 'Add your payment method',
      component: 'Payment',
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