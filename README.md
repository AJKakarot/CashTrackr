
# 💰 CashTrackr – Intelligent Finance Dashboard

CashTrackr is a modern **Next.js 15** app that helps you manage budgets, track expenses, and gain AI-driven financial insights.  
Built with **React, TailwindCSS, shadcn/ui, and Framer Motion**, it provides a sleek, responsive, and professional dashboard experience.

---

## 🚀 Features
- 📊 **Dashboard Overview** – Visualize spending & budgets at a glance.  
- 🎨 **Modern UI/UX** – Gradient headings, animations, responsive design.  
- ⚡ **Next.js 15 + App Router** – Latest Next.js architecture with Suspense support.  
- 🎬 **Framer Motion Animations** – Smooth transitions and micro-interactions.  
- 🎯 **Budget Tracking** – Set budgets and track real-time expenses.  
- 👤 **Authentication Ready** – Easily extend with Clerk/Auth.js.  
- 🌐 **Optimized for SEO** – Fast, responsive, and lightweight.  

---

## 🛠️ Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router + Turbopack)  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- **Animations:** [Framer Motion](https://www.framer.com/motion/)  
- **Loader:** [React Spinners](https://www.davidhu.io/react-spinners/)  
- **Deployment:** Vercel (recommended)  

---

## 📂 Project Structure
```
CashTrackr/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Authentication pages
│   ├── (main)/           # Main dashboard pages
│   ├── api/              # API routes
│   ├── layout.js         # Root layout
│   ├── page.js           # Landing page
│   ├── not-found.jsx     # 404 page
├── components/           # Reusable UI components
├── data/                 # Static data (features, stats, testimonials)
├── emails/               # Email templates / helpers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, Prisma client, helpers
├── prisma/               # Database schema & migrations
├── public/               # Images and static assets
├── styles/
│   └── globals.css       # Global CSS / Tailwind setup
├── scripts/              # Utility scripts
│   ├── account.js
│   ├── budget.js
│   ├── dashboard.js
│   ├── seed.js
│   ├── send-email.js
│   └── transaction.js
├── .eslintrc.json
├── .gitignore
├── README.md
├── components.json
├── generate_commits.sh
├── jsconfig.json
├── middleware.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── progress.log
└── tailwind.config.js
```

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AJKakarot/CashTrackr.git
cd CashTrackr
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the Dev Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) 🚀

### 4️⃣ Build for Production
```bash
npm run build
npm start
```

---

## 🔑 Environment Variables
Create a `.env` file in the project root with the following variables:

```
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

RESEND_API_KEY=

ARCJET_KEY=
```

---

## 🧑‍💻 Contributing
Contributions are welcome! Please open an issue or submit a PR.

---

## 📜 License
This project is licensed under the MIT License.

---

## 🙌 Credits
- Built with Next.js + Tailwind  
- UI components powered by shadcn/ui  
- Animations via Framer Motion  
# cashtrack
