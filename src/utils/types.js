import PropTypes from 'prop-types';

export const FormDataPropTypes = PropTypes.shape({
    // SIM selection
    simType: PropTypes.oneOf(['physical', 'esim']),
    simNumber: PropTypes.string || undefined,
  
    // Number selection
    numberType: PropTypes.oneOf(['new','existing']),
    newNumber: PropTypes.string,
    existingNumber: PropTypes.string,
    // availableNumbers: PropTypes.array,
    // Account details
    firstName: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    sal: PropTypes.string,
    preferredContactMethod: PropTypes.oneOf(['EMAIL', 'SMS']),
    dob: PropTypes.string,
    custType: PropTypes.oneOf(['B', 'R']),
    suburb: PropTypes.string,
    state: PropTypes.string,
    postcode: PropTypes.string,
  
    // Plan selection
    selectedPlan: PropTypes.object,
    isUpgraded: PropTypes.bool,
  
    paymentToken: PropTypes.string,
  
    // Number selection (if new number)
    selectedNumber: PropTypes.string,
  });