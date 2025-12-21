# Full Stack Website Q&A

## 📌 Overview

This project is a small **full-stack application** that allows a user to:

* Submit a **website URL**
* Ask a **question** about that website

The request is processed **asynchronously** in the backend.
The system scrapes the website content, sends it to an AI model along with the user’s question, and returns an answer once processing is complete.

The frontend displays the **real-time status** of the task and shows the final AI-generated answer when ready.

---

## 🎯 Key Goals

This project demonstrates:

* Asynchronous backend design
* Background job processing with queues
* Website scraping
* API design and polling
* Database persistence
* Frontend state management and UX

---

## 🧱 Tech Stack

### Frontend

* **Next.js (App Router)**
* **React**
* **TanStack Query** (for polling task status)
* **Tailwind CSS**

### Backend

* **Node.js**
* **Express**
* **BullMQ** (background job queue)
* **Redis** (queue backend)
* **PostgreSQL** (Supabase)
* **Drizzle ORM**

### Worker & Utilities

* **Playwright** (website scraping)
* **Groq API** (LLM inference)

---

## 🏗️ High-Level Architecture

```
Frontend (Next.js)
   |
   | POST /tasks
   | GET  /tasks/:id  (polling)
   ↓
Backend API (Express)
   |
   | Insert task (Postgres)
   | Enqueue job (BullMQ)
   ↓
Redis Queue
   ↓
Worker Process
   |– Scrape website (Playwright)
   |– Call AI API (Groq)
   |– Update task status & answer
   ↓
PostgreSQL (Supabase)
```

---

## 🔄 Asynchronous Flow

1. User submits a URL and question from the frontend
2. Backend:

   * Creates a task record with status `pending`
   * Pushes a job to the BullMQ queue
3. Worker process:

   * Marks task as `processing`
   * Scrapes website content
   * Sends content + question to the AI API
   * Stores the final answer
   * Updates status to `done` (or `failed`)
4. Frontend polls the task endpoint and updates UI automatically

This ensures the API remains **responsive** and scalable.

---

## 📂 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── db/            # Drizzle schema & DB client
│   │   ├── routes/        # API routes
│   │   ├── queue.ts       # BullMQ queue setup
│   │   ├── worker.ts      # Background worker
│   │   └── scrape.ts      # Website scraping logic
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── app/               # Next.js app router
│   ├── package.json
│   └── tailwind config
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v18+ recommended)
* Redis (local or hosted, e.g. Upstash)
* PostgreSQL (Supabase recommended)

---

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd fullstack_ai
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` using `.env.example`:

```env
PORT=4000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GROQ_API_KEY=your_api_key_here
```

Run backend API:

```bash
npm run dev
```

Run worker in a separate terminal:

```bash
npm run worker
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 How to Test the Application

1. Open the frontend
2. Enter:

   * Website URL (e.g. `https://example.com`)
   * A question about the website
3. Submit the form
4. Observe status changes:

   * `pending` → `processing` → `done`
5. View the AI-generated answer once completed

---

## 🧠 Design Decisions

* **Asynchronous processing** was chosen to avoid blocking API requests
* **BullMQ + Redis** provides reliability and retry capabilities
* **Polling with TanStack Query** keeps frontend simple and reactive
* **Drizzle ORM** ensures type-safe database access
* **Playwright** handles dynamic websites better than static scrapers

---

## ⚠️ Trade-offs & Limitations

* No authentication (out of scope)
* Simple polling instead of WebSockets
* Scraped content is truncated to avoid large payloads
* Basic error handling for AI failures

---

## 🚀 Future Improvements

* WebSocket or SSE for real-time updates
* Authentication & user-scoped tasks
* Task history UI
* Smarter content extraction (DOM filtering)
* Rate limiting & retries
* Dockerized setup for easier deployment

---

## ✅ Conclusion

This project demonstrates a clean, scalable approach to handling long-running tasks in a full-stack application using modern tools and best practices.
It focuses on clarity, maintainability, and real-world async system design.

---
