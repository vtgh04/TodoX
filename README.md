# TodoX — Production-Ready MERN Fullstack Application

![TodoX Banner](doc/SVG/banner.svg)

**TodoX** is a modern, high-performance, fullstack Todo application designed to bridge the gap between academic syntax knowledge and professional software engineering. Built from the ground up using the **MERN Stack (MongoDB, Express, React, Node.js)**, the project features a sleek dark-mode UI styled with **Tailwind CSS v4** and **shadcn/ui**, backed by a robust RESTful API with advanced filtering, pagination, and real-time statistics.

---

## 🏛️ System Architecture

TodoX follows a clean MVC-lite (Model-View-Controller) backend architecture paired with a modular React frontend component structure.

![System Architecture](doc/SVG/architecture.svg)

---

## ⚡ Core Features

- **Full CRUD Engine**: Seamlessly Create, Read, Update, and Delete tasks with validation and status tracking.
- **Time-based Smart Filters**: Filter tasks dynamically based on deadlines or creation dates:
  - *Today*
  - *This Week*
  - *This Month*
  - *All*
- **Interactive DatePicker Filter**: Access a native date picker overlaying the calendar icon to filter tasks for any specific custom date. Built with a cross-browser transparent click overlay and fully controlled input state.
- **Timezone-Aware Querying**: Native adjustment of MongoDB UTC timestamps to Vietnam Standard Time (UTC+7) for both specific custom date searches and the "Today" preset range.
- **State Transitioning**: Toggle tasks between `ACTIVE` and `COMPLETED` states with automatic tracking of completion timestamps (`completedAt`).
- **Backend Pagination**: Scalable query pagination to prevent loading large datasets and optimize rendering.
- **Operational Metrics**: Real-time counter metrics displaying active vs. completed tasks for instant workload visualization.

---

## 🛠️ Technology Stack

### Backend
- **Node.js (v24.x)**: Executing server environment using native ES Modules and modern `--watch` file-monitoring.
- **Express.js (v4.18.2)**: Lightweight web framework for REST API routing and middleware management.
- **Mongoose (v9.x)**: Elegant MongoDB object modeling for schema definition, validation, and database operations.
- **Dotenv**: Separation of configuration and secrets from the codebase.
- **Custom DNS Override**: Programmatic Google DNS lookup integration (`8.8.8.8`) to bypass ISP-level DNS SRV query blocks (common in specific regions/networks).

### Frontend
- **React.js**: Single-page application development.
- **Tailwind CSS v4**: Utility-first CSS framework utilizing modern styling engines.
- **shadcn/ui**: Premium, accessible, copy-paste components adhering to modern UX standards.

---

## 📂 Project Structure

```text
TodoX/
├── doc/
│   └── SVG/
│       ├── banner.svg              # SVG Banner image
│       └── architecture.svg        # SVG Architecture diagram
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Database connection and DNS setup
│   │   ├── controllers/
│   │   │   └── taskController.js   # Controller containing CRUD logic
│   │   ├── model/
│   │   │   └── task.js             # Mongoose Schema and Model definitions
│   │   ├── routes/
│   │   │   └── tasksRouters.js     # REST API route mappings
│   │   └── server.js               # Entry point of the Express server
│   ├── .env                        # Local environment secrets (ignored)
│   ├── .gitignore                  # Git exclude patterns
│   └── package.json                # Project dependencies and script declarations
└── frontend/                       # React SPA (Tailwind CSS v4 + lucide-react)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20+ recommended)
- **NPM** (v10+)
- **MongoDB Atlas Account** (Free Cluster)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables. Create a `.env` file in the `backend/` directory:
   ```env
   ConnectionStringMongodb="mongodb+srv://<username>:<password_url_encoded>@<cluster>.mongodb.net/<db_name>?appName=Cluster0"
   PORT=5001
   ```
   > [!IMPORTANT]
   > If your database password contains special characters like `@`, you **must** encode it as `%40` inside the connection string to prevent parsing errors.

4. Start the server in Development mode (with native hot-reload):
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:5001`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 🔌 API Reference

All requests and responses use JSON formatting. The base URL for task-related endpoints is `/api/tasks`.

| Method | Endpoint | Description | Request Body | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch tasks (Supports filters &amp; pagination) | None | `200 OK` |
| **POST** | `/api/tasks` | Create a new task | `{ "title": "String" }` | `201 Created` |
| **PUT** | `/api/tasks/:id` | Update task details / status | `{ "title": "String", "status": "ACTIVE/COMPLETED" }` | `200 OK` |
| **DELETE** | `/api/tasks/:id` | Permanently remove a task | None | `200 OK` |

### Database Schema Specification (`Task`)

```typescript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED'],
    default: 'ACTIVE'
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: Date, // Automatically handled by Mongoose timestamps
  updatedAt: Date  // Automatically handled by Mongoose timestamps
}
```

---

## 🔒 Production & Security Standards

- **Environment Separation**: Secrets like MongoDB connection strings are excluded from version control via `.gitignore` using `.env` variables.
- **Fail-Safe Server Bindings**: The Express server binds and starts listening on port `5001` immediately upon launch rather than waiting for MongoDB. This prevents frontend proxy connection dropouts (`ECONNREFUSED`).
- **Resilient DB Failures**: Connection errors are caught and logged with actionable advice (e.g. Atlas IP whitelist checking) rather than terminating the process via `process.exit(1)`, preserving hot-reload and keep-alive processes.
- **Native File Watcher**: Uses Node's built-in `--watch` flag for light-weight development processes instead of heavy third-party watchers like `nodemon`, optimizing memory consumption on Windows hosts.