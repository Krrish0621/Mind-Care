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


MindCare/
├── app/                  # App Router pages (Next.js 14)
│   ├── api/              # API routes (analytics, reports, etc.)
│   └── ...               # Page components (e.g., home, chat, book)
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Data store, utilities, mock DB
├── public/               # Static assets (images, icons)
├── scripts/              # Seeder and helper scripts
├── styles/               # Tailwind, global CSS
├── node_modules/         # Auto-generated dependencies
├── .gitignore            # Git ignored files
├── components.json       # ShadCN UI config
├── next-env.d.ts         # TypeScript Next.js types
├── next.config.mjs       # Next.js config
├── package.json          # App metadata and scripts
├── package-lock.json     # Dependency lockfile
├── pnpm-lock.yaml        # Optional if using pnpm
├── postcss.config.mjs    # Tailwind/PostCSS config
├── README.md             # Project readme
└── tsconfig.json         # TypeScript config
