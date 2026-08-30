# Wedding Showcase

A modern, bilingual (Arabic & English) wedding showcase and invitation platform built with Next.js 16, React 19, Prisma, and TailwindCSS 4.

## 🌟 Features

### 💍 Public Website
* **Bilingual Support:** Full support for both Arabic (RTL) and English (LTR) languages.
* **Dynamic Theme Switcher:** Allow guests to preview different themes dynamically.
* **Hero Section:** Beautiful intro page for the wedding couple.
* **Story Timeline:** A chronological timeline component for sharing the couple's journey (Engagement, Henna, Wedding, etc.).
* **Events Section:** Detailed information about wedding events and schedule.
* **Media Gallery:** Image and video gallery with an integrated lightbox.
* **Animations:** Sparkles and micro-animations to create a premium feel.

### 🛡️ Admin Dashboard
* **Invitations Manager:** Manage guest lists, families, and RSVP statuses (Pending, Confirmed, Declined).
* **QR Code Check-in System:** Generate unique QR codes for guests and use the check-in console to scan them at the venue.
* **Media Manager:** Upload, manage, and organize photos/videos for the gallery and timeline.
* **Settings Manager:** Configure global application settings.

## 🛠️ Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Frontend:** React 19, TailwindCSS 4, Lucide React (Icons)
* **Backend:** Node.js, Prisma ORM
* **Database:** PostgreSQL
* **State Management:** Zustand

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env` file in the root directory and add your `POSTGRES_URL`:
```env
POSTGRES_URL="postgresql://user:password@localhost:5432/wedding_db?schema=public"
```

3. Generate Prisma Client and push the schema:
```bash
npx prisma generate
npx prisma db push
```

### Running Locally

To run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

If you want to test the production build (fixes the `npm start` error), run:
```bash
npm run build
npm start
```
