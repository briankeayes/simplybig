# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimplyBig is a SIM card activation and mobile plan subscription service. It features a multi-step form wizard built with React 18, NextUI, and TailwindCSS where users can activate SIM cards, choose phone numbers, set up accounts, select plans, and process payments.

## Development Commands

```bash
# Start development server (runs on Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint for code quality checks
npm run lint

# Fix ESLint issues (note: the script has a typo - missing space after -fix)
npm run lintf
```

## Architecture Overview

### Core Application Flow
The application follows a 9-step form wizard pattern with session management and API integration:

1. **Welcome** - Introduction step
2. **SIM Number Entry** - 13-digit SIM card validation
3. **Number Type Selection** - Choose between new or existing number
4. **Account Details** - Customer creation (generates `custNo`)
5. **Plan Selection** - Choose base or upgraded plan
6. **Number Selection** - Select new number or provide porting details
7. **Payment Method** - Integration with Quickstream/Westpac API
8. **Consent** - Digital signature capture
9. **Results** - Order creation (generates `orderNo`)

### Key Technical Components

**State Management**: React useState hooks with centralized form data in `App.jsx`
- Session management with 30-minute inactivity timeout
- Step visibility determined by `getVisibleSteps()` function based on form data

**API Integration**: 
- Base URL: `https://simply-big.replit.app/api/v1`
- Webhook tracking: Make.com integration for form analytics
- Payment processing: Quickstream (Westpac) via trusted iframe

**Component Structure**:
- `MainContent.jsx` - Orchestrates step components and handles form submission
- `stepConfig.js` - Defines step configuration and visibility logic
- Individual step components in `src/Components/steps/`

### Environment Configuration

The application uses environment variables for API configuration:
- `VITE_TM_API_URL` - Webhook endpoint for tracking
- `VITE_TM_API_KEY` - API key for webhook authentication

These are accessed via `src/utils/constants.js` and used in `src/utils/fetcher.js`.

### Styling Architecture

- **UI Framework**: NextUI with custom "client-theme" configuration
- **Color System**: Brand colors (midnight, ocean, indigo, aqua, cloud-nine)
- **CSS Framework**: TailwindCSS with custom gradient utilities
- **Animation**: Framer Motion for step transitions

### Key Data Models

**Customer Data** (`custNo` generated in step 4):
- Personal details, contact information, address
- Customer type (Residential/Business)
- ABN for business customers

**Order Data** (`orderNo` generated in step 9):
- Links to customer via `custNo`
- Tracks SIM activation or number porting
- Payment token reference

## Important Business Logic

### Session Tracking
- Auto-generated session IDs stored in localStorage
- Format: `session_` + 7-character random string
- Webhook events sent at each step completion

### Number Selection Logic
- New numbers: User selects from available numbers
- Existing numbers: Requires porting details (provider, ARN, DOB verification)

### Payment Integration
- Credit card: 1.1% processing fee
- Bank account: Direct debit option
- Secure tokenization via Quickstream

### Form Validation Rules
- Age verification (18+ years)
- Australian address validation via Google Places API
- ABN validation for business customers
- SIM number format validation (13 digits)