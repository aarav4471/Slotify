# Slotify 📅
**A Premium Scheduling Platform (Calendly Clone)**

Slotify is a production-ready, full-stack scheduling application built with **React**, **Node.js**, **Express**, and **MySQL**. It features a modern, high-end SaaS aesthetic with glassmorphism effects, a dynamic availability engine, and built-in protection against booking race conditions.

---

## ✨ Features

### 👤 User Features
- **Event Management**: Create custom event types with specific durations, buffer times, and unique slugs.
- **Dynamic Availability**: Set your weekly recurring schedule. Slots are calculated on-the-fly, accounting for existing bookings and buffers.
- **Meetings Dashboard**: View upcoming and past meetings, and cancel them with a single click.
- **High-End UI**: 
  - **Glassmorphism**: Translucent, blurred card designs.
  - **Dark Mode**: Complete system-synchronized and manual dark mode support.
  - **Micro-Animations**: Smooth transitions and interactive hover states.

### 🛡️ Technical Excellence
- **Race Condition Prevention**: Implemented at both the API and Database levels using `UNIQUE KEY` constraints on booking time slots.
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing.
- **Clean Architecture**: Decoupled frontend (Vite/React) and backend (Express) with a robust MySQL relational schema.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Date-fns, Lucide Icons |
| **Backend** | Node.js, Express, MySQL |
| **Styling** | Vanilla CSS + Tailwind Utility Classes |
| **Database** | MySQL (Relational Schema) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MySQL Server

### 2. Database Setup
1. Create a database named `scheduler_app`.
2. Run the SQL script located in `schema.sql`:
   ```bash
   mysql -u root -p scheduler_app < schema.sql
   ```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your credentials:
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=scheduler_app
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🗺️ API Endpoints

### Event Types
- `GET /api/events`: List all event types.
- `POST /api/events`: Create a new event type.

### Availability
- `GET /api/availability`: Fetch the current user's weekly availability.
- `POST /api/availability`: Update weekly availability.
- `GET /api/available-slots/:slug?date=YYYY-MM-DD`: Get dynamically calculated slots for a specific date and event.

### Bookings
- `POST /api/bookings`: Create a new booking (Guest flow).
- `GET /api/meetings`: List all meetings (Upcoming/Past).
- `POST /api/bookings/:id/cancel`: Cancel an existing meeting.

---

## 🎨 Design Philosophy
Slotify uses a **"Soft Glass"** aesthetic, utilizing backdrop blurs and subtle white/slate borders to create depth. The **Indigo & Violet** color palette is chosen to represent growth, innovation, and trust, common in top-tier SaaS products.

---

## 📜 License
Unlicensed - Educational Project.
