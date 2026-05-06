# 🧠 ResumeIQ AI

An AI-powered resume analysis platform built to help users evaluate resume quality, improve ATS compatibility, and identify skill gaps using intelligent scoring and structured insights.

Built with **Next.js 14**, **TypeScript**, and modern full-stack tooling.

---

## ⚡ Features

- 📄 Resume upload support (PDF & DOCX)
- 🤖 AI-powered resume analysis
- 📊 Dynamic resume scoring system
- 🧠 Skills and keyword extraction
- 📈 Dashboard analytics
- 🎨 Responsive modern UI
- ⚡ Fast API routes with Next.js
- 🔐 Environment-based configuration

---

## 🧩 Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Node.js

### File Processing
- pdf-parse
- mammoth

### AI Integration
- OpenAI API

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Harshsaharan28/AI-Resume-analyzer.git
cd AI-Resume-analyzer
```

### Install Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## 📊 Resume Analysis Features

The platform analyzes resumes based on:

- Technical skills
- ATS optimization
- Resume structure
- Experience relevance
- Education details
- Keyword matching
- Overall presentation

## 🧱 Project Structure

```bash
AI-Resume-analyzer/
│
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── dashboard/
│   │       └── route.ts
│   │
│   ├── dashboard/
│   ├── upload/
│   ├── analyze/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── upload/
│
├── lib/
│   ├── analysis-storage.ts
│   └── utils.ts
│
├── uploads/
├── public/
├── styles/
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local
```

## 📌 API Routes

| Route | Description |
|---|---|
| `/api/upload` | Upload resume |
| `/api/analyze` | Analyze uploaded resume |
| `/api/dashboard` | Fetch dashboard metrics |

---

## 🎨 UI Highlights

- Modern dashboard layout
- Responsive design
- Smooth upload workflow
- Real-time analysis feedback
- Clean analytics interface

---

## 🛠 Future Improvements

- Authentication system
- Resume history tracking
- Multi-template resume generation
- AI interview preparation
- Job matching recommendations

---

## 🚀 Deployment

Optimized for deployment on:

- Vercel
- Netlify
- Render

---

## 📄 License

MIT License

---

## 👨‍💻 Developer Notes

This project was built as a full-stack AI application focused on:
- resume intelligence,
- AI-assisted evaluation,
- dashboard-driven analytics,
- and scalable Next.js architecture.

The project is actively being improved with additional AI and analytics features.
