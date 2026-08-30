# Event Ticketing System — Setup

This is a Laravel 8 + Inertia.js + React app. The `vendor/` and `node_modules/`
folders are excluded from this zip (as they were from your original upload) —
you'll regenerate them locally, where you have full internet access (this
sandbox couldn't reach Packagist to test the installs itself).

## 1. Install dependencies

```bash
composer install
npm install
```

## 2. Environment

`.env` is already included with a MySQL config pointing at a database named
`ticketing_db`. Update the DB credentials if yours differ, then:

```bash
php artisan key:generate   # only if APP_KEY ever gets cleared
```

## 3. Database

```bash
php artisan migrate
php artisan db:seed
```

The seeder creates:
- An admin: `admin@admin.com` / `password`
- A regular user: `user@example.com` / `password`
- 5 demo events (Tech Conference 2026, Music Festival, Art Exhibition, Startup Summit, Charity Gala)

Note: the **first person to register** through the app's own `/register` page
also automatically becomes an admin (only matters if you skip seeding).

## 4. Build frontend assets

```bash
npm run dev      # for local development (or `npm run watch`)
npm run production   # for a production build
```

## 5. Serve the app

```bash
php artisan serve
```

Visit `http://localhost:8000` — it redirects to `/login`.

## System requirements to note

- **PHP `gd` extension** must be enabled — the QR code on the downloadable
  PDF ticket (`milon/barcode`) requires it.
- Camera-based scanning (the admin Scanner page) requires the site be served
  over **HTTPS or localhost** — browsers block camera access on plain HTTP
  for any other host.

## What's implemented

- Auth (register/login/logout), first registrant becomes admin
- Admin: dashboard stats, event CRUD, user list + role change + delete,
  QR ticket scanner (camera or uploaded image) with duplicate-use detection
- Regular users: browse upcoming events, book a ticket (one per event),
  view a QR "digital pass", download a PDF ticket
- Role-based dashboard and route protection (`admin` middleware)

## What's deliberately not included yet

Per your note about extending later: online payments, email notifications,
event categories, multiple ticket types, discount codes, organizer accounts,
reports, and revenue analytics. The current stats card only shows counts
(events/users/tickets), not revenue, since there's no payment data yet.

Also simplified for now (not part of the original request but worth knowing):
no password reset / email verification flow — just register/login/logout.
