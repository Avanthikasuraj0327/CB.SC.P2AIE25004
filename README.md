# Notification System – Priority Inbox

## Overview

This repository implements a **priority‑inbox** notification system that:

1. **Fetches** notifications from a protected evaluation‑service API.
2. **Maintains** the top 10 most important **unread** notifications using a **min‑heap** (Python & TypeScript implementations).
3. **Displays** the notifications in a sleek, dark‑mode React UI built with **Next.js** and **Material‑UI** (MUI).
4. Includes a **fallback** data set (the same sample used in the Python script) so the UI works even without a valid auth token.
5. Provides **read/unread** toggling and **type filtering** on the frontend.

## Repository Structure
```
notification-system/
├─ request.py                 # Python min‑heap implementation
├─ Notification_System_Design.md  # System design & complexity analysis
├─ logging_middleware/          # Simple logging helper (TS)
│   └─ src/index.ts
├─ notification_app_be/        # Backend service (TS) – fetches & sorts
│   └─ src/index.ts
└─ notification-app-ui/        # Next.js UI (React + MUI)
    ├─ src/app/
    │   ├─ layout.tsx          # Global layout with glass‑morphism
    │   ├─ page.tsx            # Main inbox page (filter, read toggle)
    │   ├─ api/notifications/route.ts   # Secure API route with fallback
    │   ├─ components/NotificationCard.tsx (unused stub)
    │   └─ globals.css        # CSS variables & glass‑morphism styles
    ├─ package.json
    └─ tsconfig.json
```

## Prerequisites
- **Node.js** (v20+ recommended) – includes `npm`.
- **Python 3.11+** – for the standalone script.
- **Git** (optional, to clone the repo).
- **PowerShell** execution policy set to `Bypass` **or** run the npm commands from **cmd.exe**.

## Setup – Backend (Python)
```bash
# Clone (if you haven’t already)
git clone <repo‑url>
cd "c:/Users/AVANTHIKA/OneDrive/Desktop/notification-system"

# (Optional) Create a virtual environment
python -m venv .venv
source .venv/Scripts/activate   # Windows PowerShell
# or .venv\Scripts\activate.bat for cmd.exe

# Run the script – it will fetch the API (requires a valid token) or fall back to sample data
python request.py
```
The script prints the top 10 notifications to the console.

## Setup – Frontend UI
```bash
# Navigate to the UI folder
cd "c:/Users/AVANTHIKA/OneDrive/Desktop/notification-system/notification-app-ui"

# 1️⃣ Install dependencies (MUI + icons + emotion)
# PowerShell may block script execution; run the following in **cmd.exe** or temporarily bypass:
#   PowerShell: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# Then install:
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled

# 2️⃣ Start the dev server (Webpack, works on Windows)
npm run dev
```
The dev server will be available at `http://localhost:3000/`. The page shows the **Priority Inbox** with:
- Top‑10 notifications (real API or sample fallback).
- Filter chips: *All*, *Placement*, *Result*, *Event*.
- **Mark As Read / Mark Unread** button per card (state stored only in the UI session).

## Production Build (optional)
```bash
npm run build   # Generates an optimized production bundle
npm start       # Serves the built app (still on localhost)
```
You can host the `notification-app-ui` folder on any Node‑compatible server.

## Notes & Future Improvements
- **Auth Token** – The token is hard‑coded in `request.py`, `notification_app_be/src/index.ts`, and `notification‑app‑ui/src/app/api/notifications/route.ts`. Replace it with a real token for production use.
- **Persistence** – Currently read/unread status lives only in the client session. Hook it up to a database or Redis for real persistence.
- **Material‑UI Component Refactor** – The UI already uses MUI components; you can replace the custom `NotificationCard.tsx` stub with a full MUI `Card` if you prefer.
- **Backend Service** – The TypeScript backend (`notification_app_be`) mirrors the Python logic and can be deployed as a separate micro‑service if needed.

## License
This project is provided as an educational example. Feel free to adapt, extend, or integrate it into your own systems.
