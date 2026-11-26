# QuickFix — current release

Start with **START_HERE.txt** for the complete Windows setup and demo walkthrough.

This release adds a read-only administrator dashboard at `/admin` (demo login `admin@example.test`), customer/provider record views, and post-completion payments. Demo accounts use `QuickFixDemo2026!` only in the local demo.

Cash requires the assigned provider to confirm receipt. Google Pay is a clearly labelled simulation with a non-payment QR code, enabled by the demo launcher. Completed work, cash receipt and simulated payment are separate states. The admin dashboard does not impersonate users or offer account deletion/blocking.

# QuickFix — local service booking platform

A React + Express + MongoDB college project. Customers discover services, book fixed two-hour appointments, cancel future requests and review completed visits. Providers manage listings, profile images, appointment status and a dashboard.

## Quick start on Windows / macOS / Linux

Install Node.js 22 or 24 LTS. Extract the ZIP, open the **QuickFix** folder in VS Code, and open its terminal. Run:

```sh
npm run setup
npm run demo
```

Open **http://localhost:5000**. The first demo run downloads a MongoDB executable, so it needs internet and may take a few minutes. On Linux, MongoDB also needs its supported system libraries. The demo database persists in `server/.demo-data`; images persist in `server/uploads`. Stop with Ctrl+C.

Demo-only accounts (not real businesses or customer testimonials):

| Role | Email | Password |
|---|---|---|
| Customer | customer@example.test | QuickFixDemo2026! |
| Provider | provider@example.test | QuickFixDemo2026! |

You can also create your own accounts. To become a provider, sign in and select **List your service**. The demo seeds four clearly labelled sample listings in Payyanur. Do not expose demo accounts on a public deployment.

## Using your own MongoDB database

1. Run `npm run setup` (installs dependencies and generates a local JWT secret without overwriting an existing `.env`).
2. Install/start MongoDB Community or create a MongoDB Atlas database.
3. Edit `server/.env` and set `MONGODB_URI`. The default is `mongodb://127.0.0.1:27017/quickfix`.
4. Run `npm run dev`. Open `http://localhost:5173`. The Vite proxy forwards API and uploaded-image requests to port 5000.
5. For a built application, run `npm run build`, then `npm start`. Open `http://localhost:5000`.

No ImageKit, payment, AI, or email-service API key is required. Keep `.env` private. Use a unique JWT secret of at least 32 characters.

## Included flows

- Register, sign in, restore a session after refresh, and log out.
- Browse/search by keyword, category and service area; sort by hourly rate or rating.
- View service details, provider name, tools/staff information, total quote, reviews and live slot availability.
- Book with date, IST slot, address, phone and optional notes. Prices are calculated by the server, not accepted from the browser.
- One provider team per slot, across all of that provider's services. A database unique index prevents simultaneous duplicate reservations.
- Customer cancellation before the appointment starts; provider confirmation/cancellation and completion after the scheduled end.
- One review per completed booking, owner-only submission, and ratings aggregated from actual completed bookings.
- Provider onboarding, listing creation/editing, pause/resume, archive and profile-image uploads.
- Booking history retains the original service title/image/location and agreed price, even after edits or archiving.
- Provider dashboard totals and monthly **completed service value**. This is not proof of payment collection.
- Mobile layouts, empty/error states, retry controls, a help guide, and working navigation.

## Booking and payment rules

Slots are 09:00–11:00, 11:00–13:00, 14:00–16:00 and 16:00–18:00, all in India Standard Time. Each visit is two hours. The displayed quote is hourly rate × 2. One listing's staff count describes its team size; it does not create parallel booking capacity.

Status transitions: pending → confirmed or cancelled; confirmed → completed or cancelled. Completed/cancelled bookings cannot be reopened. Completion is allowed after the appointment's scheduled end. Customers pay the provider directly; **no online payment gateway or automatic payment verification is implemented**.

## Tests

```sh
npm test
npm run build
```

Tests start an isolated real MongoDB database, exercise actual HTTP endpoints, and delete their test data afterwards. They cover authentication, role checks, images, service edits, invalid inputs, concurrent slot reservations, ownership, cancellation, status transitions, review deduplication, rating averages and preserved history. The MongoDB binary is downloaded on first use; `MONGOMS_VERSION` can select a supported binary for your system.

## Deployment

This project needs a normal Node server with persistent disk for `server/uploads` and a MongoDB database. Serve the compiled client and API together using `npm start`. Alternatively configure `VITE_API_BASE_URL` before building the client and set `CLIENT_URL` to that exact frontend origin on the API server. Use HTTPS, a unique JWT secret and database credentials, and backups for MongoDB and uploaded images. Set `UPLOAD_DIR` to a persistent directory if the server filesystem is ephemeral.

Do not deploy this Express/Mongoose backend as a static-only site or a Cloudflare Worker. The portfolio site is separate and was not changed by this repair.

## Existing database compatibility

The ZIP contained no database dump. This version is intended to start with a new database. Back up any existing database before adapting old data. Older bookings lack contact fields, snapshots and `active`; backfill those fields and resolve duplicate active provider/date/time entries before enabling the new unique index. Do not point this version at an old production database without that migration.

## Boundaries

This is a completed implementation of the project’s **core service-booking scope**, not a claim of production certification. It does not include online payments, identity verification, automated email/SMS, maps/GPS, chat, an administrator moderation system, or password-reset emails. Those would require additional requirements and, for some features, external service accounts. The UI does not pretend these features exist.
