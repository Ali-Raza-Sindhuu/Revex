# REVEX frontend

REVEX is a React and Vite car marketplace frontend. It uses Tailwind CSS v4, React Router, Redux Toolkit, and a MongoDB-backed Express API.

## Run locally

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` for local development; it points to the API at `http://localhost:4000`. Set `VITE_API_URL` to the deployed API origin for production. Google sign-in needs `VITE_GOOGLE_CLIENT_ID` to match `GOOGLE_CLIENT_ID` in the backend. Restart Vite after changing environment variables. For Vercel, set the project Root Directory to `Frontend`; the SPA rewrite in `vercel.json` enables direct links to client-side routes.

Build the production bundle with `npm run build`. Preview it with `npm run preview`. Run commands from `Frontend/`. A production host must serve `index.html` for unknown paths so React Router can handle direct links.

## Pages

`/` Home · `/inventory` Inventory · `/inventory/:id` Car Details · `/about` About · `/services` Services · `/stories` Stories · `/innovation` Innovation · `/configurator` Vehicle Configurator · `/contact` Contact · `/login` Login · `/signup` Signup · `/forgot-password` Forgot Password · `/reset-password` Reset Password · `/verify-email` Verify Email. Unknown paths show a 404 page.

## Structure

- `src/app/router.jsx`: routes.
- `src/components/layout/`: shared Navbar, Footer, and scrolling.
- `src/components/shared/` and `src/components/ui/`: reusable UI.
- `src/pages/`: route-level page components grouped by area.
- `src/features/`: page sections, feature components, data adapters, and client state.
- `src/lib/api.js`: shared frontend-to-backend request client.
- `src/styles/globals.css`: Tailwind entry and theme.
- `src/assets/`: bundled images.
- `public/`: files served at absolute URLs, including the favicon.

## Sample data and images

Inventory, account, garage, contact, and newsletter flows use the backend API. The About timeline, team, contact details, service terms, and review statistics are illustrative content.

Bundled images are imported from `src/assets/`. The backend's inventory export and image upload scripts use `src/features/inventory/data/cars.js`, `carDetails.js`, and `carImages.js` as seed-source files. The running pages display inventory data returned by the API.

Contact enquiries and newsletter subscriptions are saved through the API. Rental checkout uses Stripe Checkout; the return page verifies the session with the API and retries temporary connection failures. See `PLACEHOLDERS.md` for remaining prototype content.
