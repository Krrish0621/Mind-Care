# 🧠 MindCare

**MindCare** is a modern, full-stack mental health support platform tailored for college students.  
It offers AI-powered first-aid mental support, anonymous peer forums, counselor booking, and real-time analytics for institutions.

---

## 🚀 Features

- 🧠 **AI Chatbot Support** — provides emotional first aid and mental wellness guidance
- 📅 **Confidential Counselor Booking** — schedule sessions with campus or external professionals
- 🎧 **Wellness Resource Hub** — curated audio, video, and PDFs in multiple languages
- 💬 **Peer Forum** — anonymous, moderated discussion board powered by student volunteers
- 📊 **Admin Dashboard** — track trends via anonymized student mental health data

---

## 🛠 Tech Stack

| Layer         | Tech                                  |
|---------------|---------------------------------------|
| Frontend      | Next.js 14 (App Router), TypeScript   |
| Styling       | Tailwind CSS, Radix UI, ShadCN        |
| Backend/API   | Next.js API Routes                    |
| Database      | In-memory (mock data) or MongoDB (configurable) |
| Auth (optional) | Auth.js      |


### 📁 Folder Structure Explained

- `app/` – App Router pages & API routes (Next.js 14)
- `components/` – Shared UI components
- `hooks/` – Custom React hooks
- `lib/` – Utilities, data store, mock APIs
- `public/` – Static files (images, icons)
- `scripts/` – Seeder or automation scripts
- `styles/` – Global and Tailwind CSS
- `package.json` – Project dependencies and scripts

## How to Run This Project Locally

Follow these steps to get the app running on your local machine:

 1. Clone the repository
git clone https://github.com/your-username/Mind-Care.git
cd Mind-Care

 2. Install dependencies
npm install


This will install all required packages listed in package.json.

 3. Run the development server
npm run dev


Visit http://localhost:3000 in your browser. You should see the MindCare homepage running locally.

## ▶️ Live Demo

Try the live demo:  
[![Open Live Demo](https://img.shields.io/badge/Open%20Live%20Demo-Visit-blue?logo=vercel&style=for-the-badge)](https://sih-mindcare.vercel.app/)
