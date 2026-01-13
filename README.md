# Rahayu Salon & Spa - Premium Booking System

![Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20NestJS%20%7C%20PostgreSQL%20%7C%20Docker-blue)

A high-end, full-stack reservation system designed for a luxury salon in Bali. This project demonstrates a "Luxurious Zen" aesthetic combined with robust backend architecture (Transactional Outbox pattern for reliability).

## ✨ Key Features

### 🎨 Premium Frontend (Client)
- **Tech**: Next.js 14, TailwindCSS, Framer Motion.
- **Design**: "Luxurious Zen" theme with Glassmorphism, Outfit typography, and Gold/Cream palette.
- **User Experience**:
    - Real-time Booking Form with Validation.
    - Interactive Admin Dashboard with FullCalendar integration.
    - Responsive Landing Page (Hero, Services, Testimonials, Map).

### ⚙️ Robust Backend (Server)
- **Tech**: NestJS, Prisma ORM, BullMQ (Redis).
- **Architecture**:
    - **Transactional Outbox Pattern**: Ensures 100% reliable notification delivery even if third-party APIs fail initially.
    - **Concurrency Handling**: Database-level exclusion constraints to prevent double bookings.
- **Integrations**:
    - **WhatsApp & Email (Mocked)**: Automated confirmation messages.
    - **Google Calendar (Mocked)**: Syncs appointments to admin calendars.

## 🚀 How to Run

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/rahayu-salon.git
    cd rahayu-salon
    ```

2.  **Start Infrastructure (DB & Redis)**
    ```bash
    docker-compose up -d postgres redis
    ```

3.  **Setup Server**
    ```bash
    cd server
    npm install
    npx prisma migrate dev
    npm run start:dev
    ```

4.  **Setup Client**
    ```bash
    cd client
    npm install
    npm run dev
    ```

5.  **Access the App**
    - Client: `http://localhost:3000`
    - Admin: `http://localhost:3000/admin` (Login bypassed for demo)
    - API Docs: `http://localhost:5000/api`

## 📸 Screenshots

| Landing Page | Admin Dashboard |
|:---:|:---:|
| ![Landing Page](/c:/Users/Atarashi/.gemini/antigravity/brain/75bfbba2-a759-4c19-982f-f5333d48740b/project_landing_page_1768287259363.png) | ![Admin Dashboard](/c:/Users/Atarashi/.gemini/antigravity/brain/75bfbba2-a759-4c19-982f-f5333d48740b/project_admin_dashboard_1768287302843.png) |

## 👨‍💻 Developer Notes

This project was built to showcase advanced full-stack capabilities:
- **Resilience**: The backend is designed to handle failures gracefully.
- **Aesthetics**: The frontend moves beyond basic utility to providing an emotional user experience.

---
*Created by [Your Name]*
