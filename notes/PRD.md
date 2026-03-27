# SimplyBig — Product Requirements Document

## 1. Product Overview

**SimplyBig** is a customer-facing web application for activating SIM cards and subscribing to mobile plans offered by Simply Big, an Australian telecommunications provider. The app guides users through a multi-step wizard to activate a physical SIM card, set up their account, choose a plan, configure payment, and place an activation order.

**Live URL:** [simplybig.vercel.app](https://simplybig.vercel.app)

---

## 2. Problem Statement

Customers who receive a Simply Big SIM card need a self-service way to activate it online — entering their SIM details, providing personal information, selecting a phone number (new or ported), setting up payment, and consenting to terms. The app replaces what would otherwise be a manual, phone-based activation process.

---

## 3. Target Users

- **Residential customers** activating a new Simply Big SIM card
- **Business customers** (with ABN) activating a SIM card
- Australian residents aged 18+

---

## 4. User Journey & Step-by-Step Flow

The application is a **9-step wizard**:

| Step | Name | Purpose |
|------|------|---------|
| 1 | **Welcome** | Landing screen with branding, link to Critical Information Summary, "Next" to begin |
| 2 | **SIM Number Entry** | User enters the 13-digit SIM card number printed on their physical SIM. The number is validated in real-time via API (`/numbers/check/{simNumber}`) to confirm it exists and is not already in use |
| 3 | **Number Type Selection** | User chooses: **New Number** (get a fresh number) or **Existing Number** (port an existing number). If "Existing", user must also specify Prepaid vs Postpaid |
| 4 | **Account Details** | Full customer registration form: name, salutation, DOB (18+ validation), email, phone, Australian address (Google Places autocomplete). Creates a customer record via API (`POST /customers`) and returns a `custNo` |
| 5 | **Plan Selection** | Optional upsell: add unlimited international calls & SMS to 14 countries for $19/month (normally $29/month). Toggle on/off |
| 6 | **Number Selection** | **New number path:** Fetch available numbers from API (`POST /numbers/reserve`), user picks one, selection confirmed via API (`POST /numbers/select`). **Existing number path:** Enter porting number, current provider, account number, DOB; verify ownership via OTP sent to the existing number (`POST /auth/otp` + `POST /auth/otp/verify`). Alternative identity verification form available if OTP can't be received |
| 7 | **Payment Method** | Credit card or bank account (direct debit) via Quickstream/Westpac trusted iframe. Credit card incurs 1.1% surcharge. Payment token is generated and attached to the customer (`POST /payments/methods`) |
| 8 | **Consent** | User reads and acknowledges: Critical Information Summary, Direct Debit T&Cs, authorisation for direct debit, and (if porting) consent as Rights of Use Holder. User provides a digital signature via canvas |
| 9 | **Results** | Order is created via API (`POST /orders/activate` for new numbers, `POST /orders/activate/port` for ported numbers). Displays order ID on success or error message on failure. Shows FAQ accordion (activation timing, billing cycle, cancellation policy) |

---

## 5. Technical Architecture

### 5.1 Frontend Stack

| Technology | Purpose |
|------------|---------|
| React 18.3.1 | UI framework |
| Vite 5.3.4 | Build tool & dev server |
| NextUI 2.4.6 | Component library (buttons, inputs, modals, dropdowns, cards, accordion, switch) |
| TailwindCSS 3.4.7 | Utility-first CSS framework |
| Framer Motion 11.3.19 | Page transition animations (slide in/out between steps) |
| React Signature Canvas 1.0.6 | Digital signature capture |
| Lucide React | Icons |

### 5.2 Backend API

- **Base URL:** `https://simply-big.replit.app/api/v1`
- Hosted on Replit

**Endpoints used:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/numbers/check/{simNumber}` | GET | Validate SIM number exists and is not in use |
| `/customers` | POST | Create customer record, returns `custNo` |
| `/numbers/reserve` | POST | Reserve a batch of available phone numbers |
| `/numbers/select` | POST | Confirm selection of a specific number |
| `/auth/otp` | POST | Send OTP to existing number for porting verification |
| `/auth/otp/verify` | POST | Verify OTP code |
| `/payments/methods` | POST | Attach payment token to customer |
| `/orders/activate` | POST | Create activation order (new number) |
| `/orders/activate/port` | POST | Create activation order (ported number) |

### 5.3 Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Quickstream (Westpac)** | Payment tokenisation via trusted iframe — credit card & bank account |
| **Google Places API** | Australian address autocomplete & validation |
| **Make.com webhook** | Form analytics — sends step completion data for tracking/CRM |
| **Telco Manager webhook** | Enhanced analytics — sends session events (`session_started`, `step_started`, `step_completed`, `form_submitted`) |
| **EmailMeForm** | Alternative identity verification form (when OTP fails) |

### 5.4 State Management

- All form state held in a single `formData` object via `useState` in `App.jsx`
- No external state management library (Redux, Zustand, etc.)
- Session ID generated and stored in `localStorage` (format: `session_XXXXXXX`)
- 30-minute inactivity timeout resets the session (mouse/keyboard activity resets the timer)

### 5.5 Project Structure

```
src/
├── App.jsx                          # Root — state, session management, step navigation
├── constants.js                     # API base URL
├── index.css                        # Global styles, CSS variables, brand colours
├── main.jsx                         # React entry point
├── Components/
│   ├── MainContent.jsx              # Step orchestrator, API calls, navigation logic
│   ├── Sidebar.jsx                  # Step progress sidebar with completion indicators
│   ├── NavigationButtons.jsx        # Back/Next/Submit buttons
│   ├── stepConfig.js                # Step definitions, visibility rules
│   ├── Icons.jsx                    # Custom SVG icons
│   └── steps/
│       ├── Welcome.jsx              # Step 1
│       ├── SIMNumber.jsx            # Step 2
│       ├── SelectNumberType.jsx     # Step 3
│       ├── AccountDetails.jsx       # Step 4
│       ├── SelectPlan.jsx           # Step 5
│       ├── SelectNumber.jsx         # Step 6
│       ├── Payment.jsx              # Step 7
│       ├── Consent.jsx              # Step 8
│       ├── Results.jsx              # Step 9
│       └── SelectSimType.jsx        # (Currently disabled/commented out)
│
└── utils/
    ├── constants.js                 # Webhook URL & API key
    ├── fetcher.js                   # Webhook sender
    ├── tracking.js                  # Step tracking event logic
    └── types.js                     # PropTypes definitions
```

---

## 6. Brand & Design System

### Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| Midnight | `#0A0045` | Dark backgrounds, text |
| Ocean | `#2264DC` | Primary blue, buttons, sidebar gradient |
| Indigo | `#6795FF` | Secondary blue, button states |
| Aqua | `#0184D2` | Accents, success states, CTAs |
| Cloud Nine | `#E4F1FF` | Light text, backgrounds |
| Iris | `#9747FF` | Gradient accents |

### Layout
- Responsive sidebar + main content layout
- Sidebar collapses on mobile (slide-in drawer)
- Steps render inside white semi-transparent cards
- Framer Motion slide transitions between steps

---

## 7. Business Rules

| Rule | Details |
|------|---------|
| Age requirement | Must be 18+ (validated via DOB) |
| SIM validation | 13 digits, numeric only, must exist in system and not be "IN_USE" |
| Address | Must be Australian, selected from Google Places autocomplete (no manual entry) |
| ABN | Required for business customers (`custType: "B"`), must be 11 digits |
| Phone number | Australian mobile format (starts with `04`, 10 digits) |
| Credit card fee | 1.1% surcharge |
| Plans | Base plan (ID: `11144638`) or upgraded international plan (ID: `11145178`) at $19/month |
| OTP | 6-digit code, 5-minute expiry, sent to the number being ported |
| Session timeout | 30 minutes of inactivity |

---

## 8. Current Limitations & Known Issues

1. **No error recovery on order creation** — if the final API call fails, user sees an error but has no retry mechanism
2. **SelectSimType step is commented out** — only physical SIM flow is active; eSIM path exists in code but is disabled
3. **No back-navigation guards** — user can navigate back after account creation, potentially causing duplicate API calls
4. **Payment token persistence** — once a payment token is created, there's no way to change it within the same session
5. **Console logging** — production code contains extensive `console.log` statements
6. **Hardcoded plan IDs** — plan numbers (`11145178`, `11144638`) are hardcoded in the submission logic
7. **Duplicate session ID generation** — session ID generation logic is duplicated between `App.jsx` and `MainContent.jsx`
8. **No loading states for some API calls** — number selection (`/numbers/select`) fires without loading indicator
9. **Inline Make.com webhook URL** — hardcoded webhook URL in `MainContent.jsx` (line 181) alongside the configurable one in utils

---

## 9. Deployment

- **Hosting:** Vercel (frontend)
- **Backend API:** Replit
- **Domain:** simplybig.vercel.app
- **Build:** `npm run build` (Vite production build)
