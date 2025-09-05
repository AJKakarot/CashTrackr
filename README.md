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
├── app/
│ ├── layout.js # Root layout
│ ├── page.js # Landing page
│ ├── dashboard/ # Dashboard route
│ ├── not-found.js # Custom 404 page
│
├── components/
│ ├── hero.jsx # Hero section
│ ├── ui/ # shadcn UI components
│
├── data/
│ ├── landing.js # Features, stats, testimonials
│
├── public/
│ ├── banner.jpeg # Banner image
│ ├── ajeet.jpg # Example testimonial avatar
│
└── README.md

yaml
Copy code

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/CashTrackr.git
cd CashTrackr
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Run the Dev Server
bash
Copy code
npm run dev
Your app will be available at http://localhost:3000 🚀

4️⃣ Build for Production
bash
Copy code
npm run build
npm start
🎨 UI Previews
Landing Page – Hero with animated text & CTA buttons.

Dashboard – Gradient heading, subtle animations, Suspense loader.

404 Page – Clean design with animations & return-home button.

🧑‍💻 Contributing
Contributions are welcome! Please open an issue or submit a PR.

📜 License
This project is licensed under the MIT License.

🙌 Credits
Built with Next.js + Tailwind

UI components powered by shadcn/ui

Animations via Framer Motion



### Make sure to create a `.env` file with following variables -

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
