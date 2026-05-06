# 🧠 AI Resume Analyzer – Project Specification

## Overview
AI Resume Analyzer is a **GenAI SaaS web application** built with **Next.js 14**, **TypeScript**, and **Vercel AI SDK**, designed to analyze resumes and generate actionable insights with **AI-driven scoring** (0–100).  

The app enables users to upload resumes, extract structured data, evaluate career strengths, and receive improvement suggestions using **OpenAI GPT-4o-mini**.

## Objectives
- Analyze resumes (PDF/DOCX) using AI.  
- Provide dynamic scoring across skills, experience, and formatting.  
- Offer recommendations for ATS optimization and keyword strength.  
- Deliver an interactive analytics dashboard for visualization.  
- Enable user authentication for personalized analysis history.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **AI Engine:** OpenAI GPT-4o-mini via Vercel AI SDK
- **Storage:** Vercel Blob / S3
- **Auth:** NextAuth.js
- **UI:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

## Pages
- `/` – Landing page (upload form)
- `/dashboard` – User dashboard with resume history & analytics
- `/upload` – Resume upload interface
- `/api/upload` – Handles file uploads
- `/api/analyze` – Runs AI resume analysis

## Key Integrations
- GPT-4o-mini model via OpenAI API  
- NextAuth.js for authentication  
- File parsing (PDF/DOCX)  
- Vercel AI SDK for streaming responses  

## Success Criteria
- < 5s average response time per analysis  
- 90%+ correct resume text extraction rate  
- User can analyze at least 3 resumes per session  
