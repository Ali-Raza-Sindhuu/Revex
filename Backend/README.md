# REVEX API

Express API backed by MongoDB. The API is in `src/`, split into routes, controllers, services, middleware, validators, config, and Mongoose models. Vercel detects the Express app exported by `src/app.js`; `src/server.js` starts the local server.

## Local setup

1. Copy `Backend/.env.example` to `Backend/.env` and replace the placeholder values. `MONGODB_URI` should be a MongoDB Atlas connection string or a local MongoDB URI. For Atlas, allow your current IP in the cluster network access settings. The current app also requires Cloudinary credentials at startup.
2. From `Backend/`, run `npm install`, then `npm run db:seed` to load the included car inventory into the selected database. To rebuild the seed from frontend sample data and upload images first, run `npm run db:export-cars` and `npm run images:upload`.
3. Run `npm run dev`. The API listens on `http://localhost:4000`; the health endpoint is `/health`.
4. From `Frontend/`, run `npm install` and `npm run dev`. `Frontend/.env.local` points the UI at the local API.

Email runs in console mode by default, so verification and reset links are printed in the backend terminal. Set `EMAIL_MODE=resend`, `RESEND_API_KEY`, and `MAIL_FROM` to deliver email. Google sign in needs matching `GOOGLE_CLIENT_ID` values in the frontend and backend.

## Rental checkout (Stripe test mode)

The rental flow is: select dates on a rental listing, add it to the Garage, sign in, review the server cart at `/checkout`, then pay on Stripe Checkout. The API rechecks the rental dates and price from MongoDB, creates pending `Booking` records, and holds the dates for 35 minutes. Stripe's signed webhook and the return page both verify payment before the API confirms bookings and removes the paid rental items from the Garage. Purchase listings stay in the Garage shortlist and are not charged by rental checkout.

On a purchase listing, `Book a test drive` opens a date and preferred-time request; submitting it creates a `TestDriveBooking` record with status `requested` in MongoDB's `testdrivebookings` collection. Review requests there and update their status when the dealership confirms or completes an appointment. `Enquire` submits the vehicle-specific message to the existing `contactenquiries` collection. Cars themselves are documents in the `cars` collection, seeded from `Backend/db/seed-data/cars.json` with `Backend/scripts/seed.js`. A signed-in Garage is stored in `carts`; a guest Garage stays in browser storage until sign-in and merge.

Set matching-mode `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` values, plus `STRIPE_WEBHOOK_SECRET` for the signing secret on `/api/payments/webhook`. The backend validates that the publishable and secret keys are both configured and use the same test/live mode. Keep the secret and webhook keys in `Backend/.env` or backend deployment settings. Hosted Checkout redirects to Stripe's returned session URL, so the publishable key does not need to be sent to the frontend. `STRIPE_CURRENCY` defaults to `usd`. Configure Stripe to send `checkout.session.completed`, `checkout.session.expired`, and `checkout.session.async_payment_failed` events to the backend webhook. The return page can verify completed payments directly with Stripe if the webhook delivery is delayed.

The checkout amount currently includes the rental day rate only; tax, deposit, insurance, and optional extras are not calculated or collected by this flow.

## Vercel

Create two Vercel projects from this repository and set each project's Root Directory to its folder (`Backend` or `Frontend`). The frontend uses `npm run build` and outputs `dist`; its `vercel.json` sends direct links back to the SPA entry point. Set frontend `VITE_API_URL` to the deployed API origin (for example, `https://your-api.vercel.app`) and `VITE_GOOGLE_CLIENT_ID` when Google sign in is enabled. Set backend `FRONTEND_URL` to the deployed frontend origin. The backend needs `MONGODB_URI`, `JWT_SECRET`, all three Cloudinary values (required at app startup), and matching Stripe publishable/secret keys plus the webhook secret to accept rental payments. Add `GOOGLE_CLIENT_ID` when Google sign in is enabled. Set email delivery values (`EMAIL_MODE=resend`, `RESEND_API_KEY`, and `MAIL_FROM`) if verification and reset emails should be delivered instead of printed to logs. Add values in Vercel for Production, Preview, and Development as appropriate. After deployment, configure the Stripe webhook URL as `https://your-api.vercel.app/api/payments/webhook` and use the signing secret from that endpoint. The API CORS allowlist reads `FRONTEND_URL`.
