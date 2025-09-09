import { sendWebhook } from './fetcher';

// Helper function to serialize form data, avoiding circular references  
const serializeFormData = (data, stepKey, sessionId) => {
  return {
    sessionId,
    stepKey,
    custNo: data.custNo,
    orderNo: data.orderNo,
    firstName: data.firstName,
    surname: data.surname,
    email: data.email,
    phoneNumber: data.phoneNumber,
    simNumber: data.simNumber,
    numberType: data.numberType,
    selectedNumber: data.selectedNumber,
    selectedPlan: data.selectedPlan,
    paymentToken: data.paymentToken,
    sign: data.sign,
    portingNumber: data.portingNumber,
    provider: data.provider,
    arn: data.arn,
    dob_port: data.dob_port,
    numType: data.numType,
    isUpgraded: data.isUpgraded,
    sal: data.sal,
    dob: data.dob,
    address: data.address,
    suburb: data.suburb,
    state: data.state,
    postcode: data.postcode,
    preferredContactMethod: data.preferredContactMethod,
    custType: data.custType,
    abn: data.abn,
    simType: data.simType,
  };
};

// Generic tracking event sender (non-blocking)
const sendTrackingEvent = (eventType, stepKey, data, sessionId) => {
  if (!data) return;

  // For backward compatibility: if eventType is 'step_completed', 
  // also send to the original Make.com webhook with simple format
  if (eventType === 'step_completed') {
    // Original format for backward compatibility
    fetch(`https://hook.eu2.make.com/u8f97r2gc7geixmf35x8h6uaiyjebgl9`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        sessionId,
        stepKey,
        data
      }),
    }).catch(error => {
      console.error('Error tracking step (legacy):', error);
    });
  }

  // New format for enhanced analytics
  const serializedData = serializeFormData(data, stepKey, sessionId);
  
  // Fire-and-forget: don't await the webhook to avoid blocking UX
  sendWebhook(eventType, sessionId, stepKey, serializedData)
    .then(response => {
      if (!response) {
        console.warn(`Tracking ${eventType} returned no response`);
      }
    })
    .catch(error => {
      console.error(`Error tracking ${eventType}:`, error);
    });
};

// Public API functions
export const sendStepData = (stepKey, data, sessionId, eventType = 'step_completed') => {
  sendTrackingEvent(eventType, stepKey, data, sessionId);
};

export const sendStepStarted = (stepKey, data, sessionId) => {
  sendStepData(stepKey, data, sessionId, 'step_started');
};