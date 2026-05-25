# TodoX — Fullstack MERN 2025

<div align="center">

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

[![GitHub Stars](https://img.shields.io/github/stars/vtgh04/TodoX?style=flat-square&logo=github&color=blue)](https://github.com/vtgh04/TodoX/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/vtgh04/TodoX?style=flat-square&logo=github&color=sky)](https://github.com/vtgh04/TodoX/network/members)
[![GitHub License](https://img.shields.io/github/license/vtgh04/TodoX?style=flat-square&logo=github&color=green)](LICENSE)

**TodoX** is a modern, high-performance, full-stack Todo application designed with clean architecture and professional engineering practices. Featuring a sleek glassmorphic dark-mode UI, timezone-safe date queries, a persistent bilingual environment, and robust container-ready configurations.

[Demo Application](http://localhost:5001) · [Report Bug](https://github.com/vtgh04/TodoX/issues) · [Request Feature](https://github.com/vtgh04/TodoX/issues)

</div>

---

## 📖 Table of Contents

- [🏗️ System Architecture](#️-system-architecture)
- [⚡ Core Features](#-core-features)
- [🧩 Design Patterns & SOLID](#-design-patterns--solid)
- [🛠️ Tech Stack & Decisions](#️-tech-stack--decisions)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Getting Started](#-getting-started)
- [☁️ Cloud Deployment](#️-cloud-deployment)
- [🔌 API Reference](#-api-reference)
- [🤝 Contributing Guide](#-contributing-guide)
- [📄 License](#-license)

---

## 🏗️ System Architecture

TodoX leverages a decoupled Client-Server architecture, ensuring optimal separation of concerns:

![System Architecture](doc/SVG/architecture.svg)

* **Vite API Reverse Proxy:** The frontend dev server utilizes a custom reverse proxy to direct `/api` calls to port `5001`. This eliminates CORS preflight overhead locally while preserving clean relative endpoints in the React codebase.
* **Separation of Layers:** 
  * **Frontend:** Refactored into a **Feature-Based Architecture**. Key business capabilities (like Auth, Todos) own their local UI components, state stores (Zustand), and Axios integrations.
  * **Backend:** Leverages an evolved **MVC pattern** with distinct Service and Repository layers to decouple network protocols, business decisions, and database operations.
* **Fail-Safe Startup:** Port binding occurs immediately on launch to keep the dev server proxy stable. Database connection attempts run asynchronously and report faults gracefully instead of force-crashing the process.

---

## ⚡ Core Features

* **🔐 Full Authentication & Session Management:** Dynamic login, registration, and forget/reset password pipelines protected with securely signed JSON Web Tokens (JWT) stored in HTTP-Only cookies.
* **📅 Timezone-Safe Date Filters (UTC+7):** Back-end query filters normalize timestamps to Vietnam Standard Time, preventing timezone shifts and keeping "Today" or specific date filters aligned to calendar days.
* **🗓️ Controlled Transparent DatePicker:** An invisible native date picker overlays the calendar icon button. Supports standard `showPicker()` integration with clean fallbacks for mobile browsers.
* **🌐 Persistent Dual-Language Context:** Fast switching between Vietnamese (🇻🇳) and English (🇺🇸) with immediate translation of dynamic counters, inputs, tooltips, and system notifications. Choices persist across reloads via `localStorage`.
* **🔄 Pagination & Dynamic Metrics:** Implements server-side query bounds to optimize memory usage, combined with reactive counter badges reflecting real-time task states.

---

## 🧩 Design Patterns &amp; SOLID

TodoX incorporates industry-standard architectural and structural design patterns to maintain high code scalability and readability.

![Design Patterns Diagram](doc/SVG/design_patterns.svg)

### Applied Design Patterns
*   **Service & Repository Pattern (Backend):**
    *   *Service Layer:* Business logic is abstracted out of controllers into services (e.g., `authService`, `taskService`), ensuring the Single Responsibility Principle.
    *   *Repository Pattern:* Database queries (Mongoose) are isolated into repositories (e.g., `authRepository`, `taskRepository`), keeping services agnostic of the database implementation.
*   **Feature-Based Architecture (Frontend):**
    *   Code is organized by feature modules (e.g., `features/auth`, `features/todos`) rather than generic technical roles. Each feature encapsulates its own `components`, API `services`, and state `store`.
*   **State Management (Frontend):**
    *   Global state is managed via **Zustand**, replacing standard React Context for better performance and a predictable flow.
*   **Singleton Pattern (Creational):**
    *   *Frontend:* Decouples Axios into a unified client instance at `frontend/src/lib/axios.js`. All API calls share this single instance instead of instantiating new request handlers.
    *   *Backend:* Mongoose connection pool acts as a globally cached singleton instance in `backend/src/config/db.js`, sharing database connection handshakes across routes.
*   **Chain of Responsibility Pattern (Behavioral):**
    *   Implemented via Express HTTP middleware stack (`express.json()`, custom CORS, and route handlers) in `server.js`. Requests pass sequentially through checkpoints; each block executes a single concern and hands control over via `next()`.

### SOLID Principles
*   **Single Responsibility Principle (SRP):**
    *   Every module maintains a single axis of change. Backend is decoupled into `models/`, `routes/`, `controllers/`, `services/`, `repositories/`, and `config/`. Frontend encapsulates logic into features.

---

## 🛠️ Tech Stack & Decisions

### Frontend
* **React 19 & Lucide Icons:** Single-page rendering, state hooks, and crisp SVG visual cues.
* **Tailwind CSS v4 & custom UI primitives:** Native CSS variables, fast build compilation, and rich glassmorphism styles.
* **Zustand:** Lightweight, hook-based global state management.
* **Axios Instance:** Centralized config with base URLs adapted automatically to the host environment.

### Backend
* **Node.js (v24.x) & Express:** Asynchronous execution using native ES Modules (`import/export`) and Node's built-in `--watch` utility.
* **Mongoose & MongoDB Atlas:** Object document mapping, strict status enum constraints (`ACTIVE` / `COMPLETED`), and automated date timestamps.
* **Google DNS Override:** Fallback resolver configuration (`8.8.8.8`) inside the DB setup block to bypass local ISP blocks on MongoDB SRV addresses.

---

## 📂 Project Directory Structure

```text
TodoX/
├── doc/
│   └── SVG/
│       ├── banner.svg              # Marketing Banner
│       ├── architecture.svg        # System Architecture Diagram
│       └── design_patterns.svg     # Design Patterns Flow Diagram
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection & Google DNS setup
│   │   ├── repositories/
│   │   │   ├── authRepository.js   # DB transactions for authentication
│   │   │   └── taskRepository.js   # DB queries for todo tasks
│   │   ├── services/
│   │   │   ├── authService.js      # Business rules for login/register/reset
│   │   │   └── taskService.js      # Filtering and pagination logic
│   │   ├── controllers/
│   │   │   ├── authController.js   # Thin route endpoints for authentication
│   │   │   └── taskController.js   # Thin route endpoints for tasks
│   │   ├── model/
│   │   │   ├── user.js             # Mongoose User Schema
│   │   │   └── task.js             # Mongoose Task Schema
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # Protect/Me verify JWT cookie middleware
│   │   ├── routes/
│   │   │   ├── authRouters.js      # Express routers for auth
│   │   │   └── tasksRouters.js     # Express routers for tasks
│   │   └── server.js               # Express server configuration
│   ├── .env                        # Local database credentials (ignored)
│   └── package.json                # Server scripts & dependencies
└── frontend/
    ├── src/
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── components/     # Feature components (LoginForm, RegisterForm)
    │   │   │   ├── services/
    │   │   │   │   └── authService.js # API call wrappers for Auth
    │   │   │   └── store/
    │   │   │       └── useAuthStore.js # Zustand Auth state store
    │   │   └── todos/
    │   │       ├── components/     # Feature components (taskList, addTask)
    │   │       ├── services/
    │   │       │   └── todoService.js # API call wrappers for Todos
    │   │       └── store/
    │   │           └── useTodoStore.js # Zustand Todo state store
    │   ├── components/
    │   │   ├── Header.jsx          # Header with localized subtitle
    │   │   ├── StatsAndFilters.jsx # Filtering tabs & metrics badges
    │   │   ├── TaskListPagination.jsx # Page controller
    │   │   ├── DateTimeFilter.jsx  # Customized calendar filter
    │   │   └── LanguageSwitcher.jsx # Floating bilingual switcher
    │   ├── lib/
    │   │   ├── axios.js            # Unified Axios instance
    │   │   └── data.js             # Filter constants
    │   ├── pages/
    │   │   ├── HomePage.jsx        # Root dashboard view
    │   │   └── loginPage.jsx       # Multi-form Authentication portal
    │   └── App.jsx                 # Entry routing & auth state checker
    └── vite.config.js              # Vite server & proxy configurations
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v20+ recommended)
* **NPM** (v10+)
* A running **MongoDB Atlas** cluster

### Installation & Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vtgh04/TodoX.git
   cd TodoX
   ```

2. **Backend Configuration:**
   Create a `.env` file in the `backend/` directory:
   ```env
   ConnectionStringMongodb="mongodb+srv://<username>:<password_url_encoded>@<cluster>.mongodb.net/<db_name>?appName=Cluster0"
   PORT=5001
   JWT_SECRET="YourSuperSecretJWTKey"
   ```
   > [!IMPORTANT]
   > If your Atlas password contains special characters (like `@`), you **must** URL-encode them (e.g. replace `@` with `%40`) inside the connection string to avoid driver connection errors.

3. **Install Dependencies and Pre-compile Assets:**
   Run the master installation script at the root directory:
   ```bash
   npm run build
   ```

4. **Launch the Unified Platform:**
   Start the Express server hosting both the REST API and the compiled React assets:
   ```bash
   npm run start
   ```
   Open `http://localhost:5001` in your browser.

---

## 🔌 API Reference

All requests and responses use JSON formatting.

### 🔐 Authentication API (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user & set JWT in cookie | `{ "username": "...", "email": "...", "password": "..." }` | `201 Created` |
| **POST** | `/api/auth/login` | Log in user & set JWT in cookie | `{ "identifier": "...", "password": "..." }` | `200 OK` |
| **POST** | `/api/auth/logout` | Clear user session cookie | None | `200 OK` |
| **GET** | `/api/auth/me` | Fetch currently authenticated user | None (Requires Auth Cookie) | `200 OK` / `401 Unauthorized` |
| **POST** | `/api/auth/forgot-password` | Generate reset token in logs | `{ "email": "..." }` | `200 OK` |
| **POST** | `/api/auth/reset-password/:token` | Reset password using token | `{ "password": "..." }` | `200 OK` |

### 📅 Tasks API (`/api/tasks` - Requires Authentication)

| Method | Endpoint | Description | Request Body | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve paginated tasks for active user | None | `200 OK` |
| **POST** | `/api/tasks` | Create a task associated with user | `{ "title": "String" }` | `201 Created` |
| **PUT** | `/api/tasks/:id` | Update task fields (title, status, completedAt) | `{ "title": "String", "status": "ACTIVE/COMPLETED" }` | `200 OK` |
| **DELETE** | `/api/tasks/:id` | Delete user task | None | `200 OK` |

---

## ☁️ Cloud Deployment

TodoX is optimized for zero-downtime deployment on modern cloud platforms.

### 1. Unified Deployment (Render / Heroku)
Since backend [server.js](file:///c:/Users/ADMIN/Desktop/TodoX/backend/src/server.js) is configured to serve compiled frontend assets from `frontend/dist` in production, you can host the entire app on a single **Web Service**:
1. Create a new Web Service on [Render](https://render.com/) and connect your repository.
2. Configure settings:
   * **Build Command:** `npm run build` (runs root install and Vite compilation)
   * **Start Command:** `npm run start` (starts unified Node.js backend)
3. Set Environment Variables:
   * `ConnectionStringMongodb` = `[Your MongoDB Atlas URI]`
   * `NODE_ENV` = `production`
   * `PORT` = `5001` (or custom host port)

### 2. Independent Frontend Deployment (Vercel / Netlify)
If you prefer static client hosting:
1. Connect Vercel to your repository and select the `frontend` sub-directory.
2. Build Settings: Command = `npm run build`, Output = `dist`.
3. Add environment variable `VITE_API_URL` pointing to your deployed backend.

---

## 🤝 Contributing Guide

We welcome contributions from the developer community! Follow these steps to set up your contribution environment.

### Contribution Steps

1. **Fork the Repository:**  
   Click the **Fork** button at the top-right of this page to create a copy of the repository in your GitHub account.

2. **Clone your Fork:**  
   ```bash
   git clone https://github.com/YOUR_USERNAME/TodoX.git
   cd TodoX
   ```

3. **Configure the Upstream Remote:**  
   ```bash
   git remote add upstream https://github.com/vtgh04/TodoX.git
   ```

4. **Create a Feature Branch:**  
   Create a branch named after the feature or fix you are working on:
   ```bash
   git checkout -b feature/awesome-new-improvement
   ```

5. **Set up & Code:**  
   Create a local `.env` inside `backend/` and verify the project compiles and starts correctly:
   ```bash
   npm run build
   ```
   Implement your changes following the existing code styles and design systems.

6. **Commit and Push:**  
   Commit your changes using standard conventional commit messages and push the branch to your fork:
   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   git push origin feature/awesome-new-improvement
   ```

7. **Submit a Pull Request:**  
   Go to your fork on GitHub and click the **Compare & pull request** button. Detail your changes and submit the PR targeting the main repository's `main` branch.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.