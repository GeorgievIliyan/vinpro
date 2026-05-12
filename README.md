# Vinpro

A modern Next.js app for vehicle lookup and admin dashboards.

## 🚀 Overview

Vinpro provides a Next.js-based frontend and API layer for VIN lookup, vehicle details, admin management, and dashboard insights.

## 🧰 Features

- VIN lookup and vehicle information display
- Admin pages and account management
- Dashboard with stats and history
- Download vehicle data as .pdf
## 💻 Getting Started
1. Clone the reposiotry:
    ```bash
    git clone https://github.com/GeorgievIliyan/vinpro
    ```
2. Enter the folder
    ```bash
    cd vinpro
    ```
3. Install dependencies:

    ```bash
    npm install
    ```
4. Configure environment variable:
    Rename the file at the root of the directory from `.env.example` to `.env.local` and place your keys.

5. Run the development server:

    ```bash
    npm run dev
    ```

6. Open the app:

    ```text
    http://localhost:3000
    ```

## 📁 Project Structure

- `app/` — App Router pages and API route handlers
- `app/components/` — application-specific UI pieces
- `components/` — shared UI primitives
- `lib/` — utilities, database helpers, and auth logic
- `public/` — static assets and fonts

## 🛠️ Available Scripts

- `npm run dev` — start the development server
- `npm run build` — build the production app
- `npm run start` — run the production build

## 📌 Notes

- Uses Next.js App Router in `app/`
- API routes are grouped under `app/api/`