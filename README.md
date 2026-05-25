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
- [🛠️ Tech Stack & Decisions](#️-tech-stack--decisions)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Quick Start](#installation--quick-start)
- [🔌 API Reference](#-api-reference)
- [🤝 Contributing Guide](#-contributing-guide)
  - [Contribution Steps](#contribution-steps)
  - [Commit Message Conventions](#commit-message-conventions)
- [📄 License](#-license)

---

## 🏗️ System Architecture

TodoX leverages a decoupled Client-Server architecture, ensuring optimal separation of concerns:

![System Architecture](doc/SVG/architecture.svg)

* **Vite API Reverse Proxy:** The frontend dev server utilizes a custom reverse proxy to direct `/api` calls to port `5001`. This eliminates CORS preflight overhead locally while preserving clean relative endpoints in the React codebase.
* **Controller Isolation Pattern:** Backend routing matches declarative middleware endpoints, keeping MongoDB queries and status tracking logic isolated inside controller layers.
* **Fail-Safe Startup:** Port binding occurs immediately on launch to keep the dev server proxy stable. Database connection attempts run asynchronously and report faults gracefully instead of force-crashing the process.

---

## ⚡ Core Features

* **📅 Timezone-Safe Date Filters (UTC+7):** Back-end query filters normalize timestamps to Vietnam Standard Time, preventing timezone shifts and keeping "Today" or specific date filters aligned to calendar days.
* **🗓️ Controlled Transparent DatePicker:** An invisible native date picker overlays the calendar icon button. Supports standard `showPicker()` integration with clean fallbacks for mobile browsers.
* **🌐 Persistent Dual-Language Context:** Fast switching between Vietnamese (🇻🇳) and English (🇺🇸) with immediate translation of dynamic counters, inputs, tooltips, and system notifications. Choices persist across reloads via `localStorage`.
* **🔄 Pagination & Dynamic Metrics:** Implements server-side query bounds to optimize memory usage, combined with reactive counter badges reflecting real-time task states.

---

## 🛠️ Tech Stack & Decisions

### Frontend
* **React 19 & Lucide Icons:** Single-page rendering, state hooks, and crisp SVG visual cues.
* **Tailwind CSS v4 & custom UI primitives:** Native CSS variables, fast build compilation, and rich glassmorphism styles.
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
│       └── architecture.svg        # System Architecture Diagram
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection & Google DNS setup
│   │   ├── controllers/
│   │   │   └── taskController.js   # CRUD & Query Filtering logic
│   │   ├── model/
│   │   │   └── task.js             # Mongoose Schema & Status definition
│   │   ├── routes/
│   │   │   └── tasksRouters.js     # Router mapping declarations
│   │   └── server.js               # Express server configuration
│   ├── .env                        # Local database credentials (ignored)
│   └── package.json                # Server scripts & dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx          # Header with localized subtitle
    │   │   ├── addTask.jsx         # Input form
    │   │   ├── StatsAndFilters.jsx # Filtering tabs & metrics badges
    │   │   ├── taskList.jsx        # Localized list renderer
    │   │   ├── TaskListPagination.jsx # Page controller
    │   │   ├── DateTimeFilter.jsx  # Customized calendar filter
    │   │   └── LanguageSwitcher.jsx # Floating bilingual switcher
    │   ├── lib/
    │   │   ├── axios.js            # Unified Axios instance
    │   │   └── data.js             # Filter constants
    │   └── pages/
    │       └── HomePage.jsx        # Root page controller
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

All requests and responses use JSON formatting. The base URL path is `/api/tasks`.

| Method | Endpoint | Description | Request Body | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve paginated tasks matching query parameters | None | `200 OK` |
| **POST** | `/api/tasks` | Create a new task | `{ "title": "String" }` | `201 Created` |
| **PUT** | `/api/tasks/:id` | Update task title, status, or completedAt timestamp | `{ "title": "String", "status": "ACTIVE/COMPLETED" }` | `200 OK` |
| **DELETE** | `/api/tasks/:id` | Purge a task from the database | None | `200 OK` |

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
   npm run start
   ```
   Implement your changes following the existing code styles and design systems.

6. **Commit and Push:**  
   Commit your changes using standard conventional commit messages (see format below) and push the branch to your fork:
   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   git push origin feature/awesome-new-improvement
   ```

7. **Submit a Pull Request:**  
   Go to your fork on GitHub and click the **Compare & pull request** button. Detail your changes and submit the PR targeting the main repository's `main` branch.

### Commit Message Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org/) to keep the repository history readable and clean:

* `feat:` A new feature for the user (e.g. `feat: add task category support`)
* `fix:` A bug fix (e.g. `fix: resolve date shifting on query bounds`)
* `docs:` Documentation changes only (e.g. `docs: update setup guidelines`)
* `style:` Formatting, semi-colons, white-spaces (no logic changes)
* `refactor:` Code changes that neither fix a bug nor add a feature
* `test:` Adding or correcting test cases

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.