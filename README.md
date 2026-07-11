# Nyuzi

## Project Overview
*Nyuzi* (Swahili for "thread") is a circular-fashion platform for donating, upcycling, and shopping reclaimed clothing, shoes, and accessories. The goal is a platform that connects donors, upcycling partners, and eco-conscious buyers — turning textile waste into new products, with every donation and purchase tracked against measurable environmental impact (CO₂, water, and landfill savings).

This repository currently contains the **web frontend**: a marketing site and interactive prototype of the donation, marketplace, and impact-tracking experience. It is not yet connected to a backend, so no data is persisted — see [Current Status](#current-status) before treating anything here as production-ready.

---

## Table of Contents
1. [Current Status](#current-status)
2. [Get Started](#get-started)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Roadmap](#roadmap)
6. [Testing & Quality Assurance](#testing--quality-assurance)
7. [Contributors](#contributors)
8. [Contact](#contact)
9. [License](#license)

---

## Current Status

This is a **frontend-only prototype**. What works today:

- Marketing homepage, navigation, and responsive layout
- Donation flow UI with a live impact estimator (client-side only)
- Marketplace browse/filter/sort against a small fixed product set
- Impact dashboard UI with charts (fixture data, not per-user)
- Partner application page

What does **not** exist yet: user accounts, a database, payments, AI-based item classification, an admin dashboard, or any server. All of the above run entirely in the browser with no data persisted between visits. These are being built out in the order described in [Roadmap](#roadmap).

---

## Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

   This starts Vite on `http://localhost:8080`.

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Mobile builds (Capacitor)**

   The web app is wrapped for iOS/Android via Capacitor. After `npm run build`, sync native projects with `npx cap sync`.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS, an HSL design-token system in `src/index.css`
- **Routing**: React Router v6, with route-level code splitting
- **Charts/animation**: Recharts, Framer Motion
- **Mobile packaging**: Capacitor 6 (iOS/Android)
- **Not yet integrated**: a backend/database, authentication, payments, and AI classification — see [Roadmap](#roadmap)

---

## Project Structure

```
src/
  components/
    layout/      Navbar, Footer
    sections/     Homepage sections (hero, impact stats, role grid)
    ui/           shadcn/ui component primitives
  pages/          Route-level pages (Donate, Marketplace, Impact, etc.)
  lib/            Shared utilities
  hooks/          Shared React hooks
```

---

## Roadmap

The longer-term product vision — the part of this project that isn't built yet:

- **Accounts & roles** — Donor, Buyer, Partner, and Admin accounts with real authentication
- **Backend & database** — persisted donations, listings, orders, and users
- **AI-assisted item triage** — photo-based condition and material assessment to speed up donation intake
- **Payments** — Stripe and M-Pesa for marketplace checkout
- **Rewards & referrals** — points and recognition for donors and buyers
- **Admin dashboard** — inventory, donation, and partner management
- **Corporate impact reporting** — exportable sustainability reports for organizational donation drives

---

## Testing & Quality Assurance

Automated testing and CI are not yet set up — this is tracked as near-term work alongside the backend build-out.

---

## Contributors

- **Benjamin Mweri Baya** — Project Lead & Founder

---

## Contact

- **Email**: b3njaminbaya@gmail.com
- **WhatsApp**: +254 783 797132

## How to Contribute

1. Fork the repository.
2. Create a feature branch (e.g., `git checkout -b feature/new-feature`).
3. Commit your changes (e.g., `git commit -m 'Add new feature'`).
4. Push to the branch (e.g., `git push origin feature/new-feature`).
5. Create a Pull Request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
