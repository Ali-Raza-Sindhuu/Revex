# REVEX Car Rental

REVEX is a full-stack vehicle marketplace for discovering cars to buy or rent. It combines a responsive React application with an Express API and MongoDB. Customers can browse vehicle listings, create an account, save cars, request test drives, and reserve rentals with Stripe Checkout.

> **Project demo:** [Watch the demo video](demo/revex-website-demo.webm)

## Contents

- [Product features](#product-features)
- [Technology](#technology)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Data and rental behavior](#data-and-rental-behavior)
- [Testing and production build](#testing-and-production-build)
- [Deployment](#deployment)
- [Security](#security)

## Product features

### Customer-facing application

- **Discover vehicles:** browse, search, filter, sort, and paginate the vehicle catalog, including separate purchase and rental listings.
- **Review a vehicle:** view photos, specifications, features, pricing, related vehicles, and rental availability; submit an enquiry or test-drive request.
- **Preview a vehicle configuration:** choose a listed vehicle and preview exterior color and interior finish options. These choices are illustrative and are not saved as a build or order.
- **Manage an account:** register or sign in with email/password or Google; verify an email address; recover a forgotten password; and update profile details.
- **Save vehicles and rentals:** use the Garage to manage a purchase shortlist and rental selections; use the Saved Cars page for wishlist vehicles.
- **Reserve and pay for a rental:** review rental dates and estimated costs, then complete payment on Stripe Checkout. View booking status and history after checkout.
- **Explore dealership information:** home, about, services, stories, innovation, contact, privacy, and terms pages, plus newsletter signup.

### Backend capabilities

- REST API built with Express and MongoDB/Mongoose.
- Vehicle catalog queries, details, filter facets, and rental availability.
- Server-side rental date validation, availability conflict checks, and rental bookings.
- Password hashing, JWT-based authentication, Google credential verification, email verification, password reset, and profile updates.
- Authenticated cart and wishlist operations, including merging saved client-side items after sign-in.
- Stripe Checkout session creation, webhook signature verification, payment status, and booking updates.
- Persisted contact enquiries, newsletter subscriptions, and test-drive requests.
- Request validation, rate limiting on selected endpoints, Helmet security headers, CORS allow-listing, and centralized error handling.
- `GET /health` health check.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, Tailwind CSS, Radix UI |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Identity | JWT, bcrypt, Google OAuth |
| Integrations | Stripe Checkout, Cloudinary, Resend |

## Architecture

The frontend is a Vite single-page application. It calls the backend using `VITE_API_URL`; the backend exposes REST endpoints under `/api`. MongoDB is the persistent store for vehicles, users, carts, wishlists, bookings, enquiries, subscribers, and test-drive requests.

```text
Frontend/
  src/
    app/          Router and Redux store
    components/   Shared layout and UI components
    features/     Account, inventory, garage, and page feature modules
    pages/        Route-level pages
    lib/          API and shared utilities

Backend/
  src/
    app.js        Express app and middleware registration
    local.js      Local development server entry point
    routes/       HTTP route definitions
    controllers/  Request/response handlers
    services/     Business logic and integrations
    models/       Mongoose schemas
    validators/   Request validation
    middleware/   Authentication, validation, and error handling
    config/       MongoDB, Cloudinary, and Stripe configuration
  db/seed-data/   Vehicle catalog seed data and image mapping
  scripts/        Database and image utilities
  tests/          Node.js tests
```

## Requirements

- Node.js and npm (use a current Node.js LTS release).
- A MongoDB database and connection string.
- Cloudinary account credentials; the backend validates these during startup.
- Stripe keys to use rental checkout.
- Google OAuth credentials to enable Google sign-in.
- Resend credentials to send real verification and password-reset emails. Console email mode is available for local development.

## Local development

Run the frontend and backend in separate terminals.

### 1. Set up the backend

From the repository root:

```powershell
cd Backend
npm install
Copy-Item .env.example .env
```

Edit `Backend/.env` with values for your environment. The backend requires:

- `MONGODB_URI` — MongoDB connection string. Include the target database in the URI.
- `JWT_SECRET` — a long, unique signing secret.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

Set `FRONTEND_URL` to the frontend origin. For local email flows, use `EMAIL_MODE=console`; to send email, set `EMAIL_MODE=resend`, `RESEND_API_KEY`, and `MAIL_FROM`.

To enable rental payments, configure matching Stripe test-mode values for `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`, plus `STRIPE_WEBHOOK_SECRET`. The webhook endpoint is `POST /api/payments/webhook`.

Run the API:

```powershell
npm run dev
```

The local server defaults to `http://localhost:4000`. Check `http://localhost:4000/health` to verify it is responding.

### 2. Set up the frontend

In another terminal, from the repository root:

```powershell
cd Frontend
npm install
Copy-Item .env.example .env.local
```

Set `VITE_API_URL` to the backend origin. Set `VITE_GOOGLE_CLIENT_ID` if enabling Google sign-in; it should correspond to the OAuth client configured for the backend.

Run the frontend:

```powershell
npm run dev
```

Vite prints the local URL, typically `http://localhost:5173`.

### 3. Seed vehicle data (optional)

After configuring the backend database and Cloudinary image mapping, run from `Backend/`:

```powershell
npm run db:seed
```

The seed script upserts the sample catalog from `db/seed-data/cars.json` and uses `db/seed-data/image-map.json` to associate uploaded image URLs. Review those files before seeding a shared or production database.

## Environment variables

Use the checked-in example files as templates. Never copy real credentials into source control.

### Backend (`Backend/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Local API port; defaults to `4000`. |
| `MONGODB_URI` | Yes | MongoDB connection string; specify the database in the URI. |
| `MONGODB_DB_NAME` | No | Present in the example file; the current connection code does not read it. |
| `JWT_SECRET` | Yes | Signs and verifies API bearer tokens. |
| `JWT_EXPIRES_IN` | No | Token lifetime; defaults to `1h`. |
| `GOOGLE_CLIENT_ID` | For Google sign-in | OAuth client audience used to verify Google credentials. |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account name. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. |
| `FRONTEND_URL` | For email links | Frontend origin used in email links and allowed by CORS configuration. |
| `EMAIL_MODE` | No | `console` logs email metadata locally; `resend` sends through Resend. Defaults to console outside production and Resend in production. |
| `RESEND_API_KEY` | For Resend email | API key used when `EMAIL_MODE=resend`. |
| `MAIL_FROM` | For Resend email | Verified sender identity used when `EMAIL_MODE=resend`. |
| `STRIPE_PUBLISHABLE_KEY` | For checkout | Stripe publishable key; must match the secret key's test/live mode. |
| `STRIPE_SECRET_KEY` | For checkout | Server-side Stripe secret key. Never expose it to the frontend. |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Signing secret used to validate Stripe webhook events. |
| `STRIPE_CURRENCY` | No | Rental checkout currency; defaults to `usd`. |

`NODE_ENV` is also read by the backend to select production behavior; set it in the deployment environment as appropriate.

### Frontend (`Frontend/.env.local`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | No | API origin; defaults to `http://localhost:4000`. |
| `VITE_GOOGLE_CLIENT_ID` | For Google sign-in | OAuth client ID used by the Google sign-in UI. |

Only public configuration belongs in `VITE_*` variables: Vite embeds them in the client bundle.

## API reference

All API routes use the `/api` prefix unless noted. Protected routes require an `Authorization: Bearer <token>` header.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/cars` | Public | List/search/filter vehicles. |
| `GET` | `/api/cars/facets` | Public | Retrieve catalog filter values. |
| `GET` | `/api/cars/:id` | Public | Retrieve vehicle details. |
| `GET` | `/api/cars/:id/availability` | Public | Check rental availability for requested dates. |
| `POST` | `/api/auth/signup` | Public | Create an account. |
| `POST` | `/api/auth/register` | Public | Alias for account creation. |
| `POST` | `/api/auth/login` | Public | Sign in with email and password. |
| `POST` | `/api/auth/google` | Public | Sign in with a Google credential. |
| `POST` | `/api/auth/forgot-password` | Public | Start password recovery. |
| `POST` | `/api/auth/reset-password` | Public | Set a password using a recovery token. |
| `POST` | `/api/auth/verify-email` | Public | Verify an email using a token. |
| `POST` | `/api/auth/resend-verification` | Protected | Resend an account verification email. |
| `POST` | `/api/auth/logout` | Public | Acknowledge logout; the stateless client discards its token. |
| `GET` | `/api/auth/me` | Protected | Retrieve the signed-in user's account. |
| `PATCH` | `/api/users/me` | Protected | Update profile details or password. |
| `GET` | `/api/cart` | Protected | Retrieve the user's Garage items. |
| `POST` | `/api/cart/items` | Protected | Add an item to the Garage. |
| `POST` | `/api/cart/merge` | Protected | Merge client-side Garage items after sign-in. |
| `DELETE` | `/api/cart/items/:id` | Protected | Remove a Garage item. |
| `GET` | `/api/wishlist` | Protected | Retrieve saved vehicles. |
| `POST` | `/api/wishlist/items` | Protected | Save a vehicle. |
| `POST` | `/api/wishlist/merge` | Protected | Merge client-side saved vehicles after sign-in. |
| `DELETE` | `/api/wishlist/items/:carId` | Protected | Remove a saved vehicle. |
| `POST` | `/api/payments/checkout-session` | Protected | Create a Stripe rental checkout session. |
| `GET` | `/api/payments/session/:sessionId` | Public | Retrieve checkout status. |
| `GET` | `/api/payments/bookings` | Protected | Retrieve the signed-in user's bookings. |
| `POST` | `/api/payments/webhook` | Stripe-signed | Process Stripe Checkout events. |
| `POST` | `/api/contact` | Public | Submit a dealership enquiry. |
| `POST` | `/api/newsletter` | Public | Subscribe an email address to the newsletter. |
| `POST` | `/api/test-drives` | Public | Request a test drive. |
| `GET` | `/health` | Public | Check API health; outside the `/api` prefix. |

## Data and rental behavior

- Catalog records include vehicle make/model/year, condition, listing type (`buy` or `rent`), price, specifications, features, images, and availability status.
- Users can save purchase listings as a shortlist. Rental listings support date selection and checkout; purchase listings are not paid for through the rental checkout.
- Rental date ranges are inclusive, must not start in the past, and may not exceed 30 days.
- A rental checkout creates pending bookings and holds the selected dates for up to 35 minutes. A valid Stripe webhook confirms paid bookings; expired or failed sessions cancel pending bookings.
- The configurator is a frontend preview only. Selected color and interior options do not change the vehicle record or create an order.

## Testing and production build

Run backend tests from `Backend/`:

```powershell
npm test
```

The existing Node.js test suite covers rental date counting, range overlap, and date validation.

The frontend package currently provides build and preview scripts, but no dedicated test or lint script.

Build the frontend from `Frontend/`:

```powershell
npm run build
npm run preview
```

## Deployment

The repository includes Vercel configuration for the frontend SPA and Express backend. Deploy `Frontend/` and `Backend/` as separate projects, setting each project's root directory accordingly. The frontend rewrite to `index.html` is defined in `Frontend/vercel.json`; the backend's Express deployment configuration is in `Backend/vercel.json`.

- Set the frontend's `VITE_API_URL` to the deployed backend origin. The existing Vercel rewrite serves the SPA for client-side routes.
- Configure the backend environment variables in the hosting provider, including MongoDB, JWT, Cloudinary, `FRONTEND_URL`, and any enabled email or payment integrations.
- Configure Stripe's webhook endpoint at the backend's `/api/payments/webhook` path and use the matching webhook signing secret.
- Update CORS/frontend origin settings for the deployed frontend domain.

## Security

- Do not commit `.env`, `.env.local`, database credentials, tokens, or API secrets.
- Treat `VITE_*` values as public because they are included in the browser bundle. Do not put Stripe secret keys or other private credentials there.
- Use separate credentials for local, preview, and production environments; use Stripe test keys during development.
- If a credential is exposed, revoke or rotate it. Rotating `JWT_SECRET` invalidates existing bearer tokens.
