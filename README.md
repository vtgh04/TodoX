<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/vtgh04/TodoX">
    <img src="doc/SVG/banner.svg" alt="Logo" width="100%">
  </a>

  <h3 align="center">TodoX</h3>

  <p align="center">
    A modern, high-performance, full-stack Task & Workflow Management MERN application built with strict state machine lifecycle compliance, persistent offline synchronization queues, and comprehensive test coverage.
    <br />
    <a href="https://github.com/vtgh04/TodoX/blob/main/doc/TodoX_BA_Specification.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://localhost:5001">View Demo</a>
    &middot;
    <a href="https://github.com/vtgh04/TodoX/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/vtgh04/TodoX/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#running-tests">Running Tests</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

TodoX is designed to solve the common pain points of fragmented workflows, slow client-side loading times, and lack of visual task status visibility. Compliance with strict business specifications is at the core of the project.

Key architectural & design accomplishments:
* **Workflow Integrity:** A strict state machine workflow (`TODO` <-> `IN_PROGRESS` <-> `UNDER_REVIEW` -> `COMPLETED`) is enforced across both frontend and backend logic.
* **Optimized Focus (Auto-Pause):** Limits users to a single active task. Starting a new task automatically pauses the previously active task.
* **Offline Resiliency:** Optimistic UI state updates linked to a local queue in `LocalStorage` with auto-reconnection synchronization.
* **Clean Decoupling:** Implements the Service & Repository design patterns to separate Mongoose database queries from Express route controllers.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built using a modern and lightweight JavaScript tech stack:

* [![React][React-badge]][React-url]
* [![Express][Express-badge]][Express-url]
* [![MongoDB][MongoDB-badge]][MongoDB-url]
* [![TailwindCSS][Tailwind-badge]][Tailwind-url]
* [![Zustand][Zustand-badge]][Zustand-url]
* [![Vitest][Vitest-badge]][Vitest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy of TodoX up and running, follow these steps.

### Prerequisites

* **Node.js** (v20+ recommended)
* **NPM** (v10+)
* A running **MongoDB Atlas** database cluster

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vtgh04/TodoX.git
   cd TodoX
   ```
2. Configure environment variables. Create a `.env` file in the `backend/` directory:
   ```env
   ConnectionStringMongodb="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db_name>?appName=Cluster0"
   PORT=5001
   JWT_SECRET="YourSuperSecretJWTKey"
   ```
   *Note: If your database password contains special characters, you must URL-encode them.*
3. Install dependencies and compile the Vite production assets:
   ```bash
   npm run build
   ```
4. Start the application:
   ```bash
   npm run start
   ```
   Open [http://localhost:5001](http://localhost:5001) in your browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- RUNNING TESTS -->
## Running Tests

We implement Vitest and Supertest to verify authentication and task controller behaviors, utilizing fully mocked repositories to isolate tests from database calls.

To run the unit test suite and generate coverage reports:

```bash
# Install test dependencies in backend
npm install --prefix backend

# Execute unit test suite (22/22 tests passed)
npm run test --prefix backend

# Execute test coverage analysis (Achieves >80% coverage on controllers)
npm run test:coverage --prefix backend
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->
## Usage

### List & Kanban Board Switcher
Users can seamlessly toggle between a list layout and a 4-column Kanban Board layout by clicking the layout switcher in the header controls.

### State Transitions
* **Drag & Drop:** On the Kanban Board, drag a task card and drop it into a column. Only valid state transitions are allowed; invalid transitions are automatically rolled back.
* **Quick Controls:** Both the List and Board views support click controls (Play, Pause, Submit, Approve, Reject, Reopen) to easily advance tasks through their lifecycle stages.

### Keyboard Shortcuts
Inside the task creation input box, use `Ctrl + Enter` to immediately submit and save the task without clicking the "Add" button.

### Offline Sync Demo
1. Open your browser's Developer Tools (F12) -> **Network** tab -> toggle **Offline** mode.
2. Add a new task or change the status of an existing task.
3. Observe the card's optimistic updates and the orange **Pending Sync** ☁️ badge.
4. Toggle Network back to **Online**.
5. Observe the badge disappears as the background queue is synced with the MongoDB database.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Implement 4-state workflow task state machine (`TODO`, `IN_PROGRESS`, `UNDER_REVIEW`, `COMPLETED`)
- [x] Build drag-and-drop Kanban Board View using HTML5 native APIs
- [x] Integrate Zustand global state management on the client side
- [x] Develop persistent LocalStorage queue for Offline Sync
- [x] Apply Service & Repository patterns to backend architecture
- [x] Reach >80% test coverage on controllers with Vitest mock tests
- [x] Add client-side instant search query and priority level filtering
- [ ] Add team workspaces and shared Kanban boards
- [ ] Implement email and browser push notifications for task assignments

See the [open issues](https://github.com/vtgh04/TodoX/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

GitHub Link: [https://github.com/vtgh04/TodoX](https://github.com/vtgh04/TodoX)

Project Link: [https://github.com/vtgh04/TodoX](https://github.com/vtgh04/TodoX)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Lucide Icons](https://lucide.dev/)
* [Zustand State Manager](https://github.com/pmndrs/zustand)
* [Tailwind CSS](https://tailwindcss.com/)
* [Vitest runner](https://vitest.dev/)
* [Supertest library](https://github.com/ladjs/supertest)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Reference Links -->
[contributors-shield]: https://img.shields.io/github/contributors/vtgh04/TodoX.svg?style=for-the-badge
[contributors-url]: https://github.com/vtgh04/TodoX/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vtgh04/TodoX.svg?style=for-the-badge
[forks-url]: https://github.com/vtgh04/TodoX/network/members
[stars-shield]: https://img.shields.io/github/stars/vtgh04/TodoX.svg?style=for-the-badge
[stars-url]: https://github.com/vtgh04/TodoX/stargazers
[issues-shield]: https://img.shields.io/github/issues/vtgh04/TodoX.svg?style=for-the-badge
[issues-url]: https://github.com/vtgh04/TodoX/issues
[license-shield]: https://img.shields.io/github/license/vtgh04/TodoX.svg?style=for-the-badge
[license-url]: https://github.com/vtgh04/TodoX/blob/master/LICENSE

[React-badge]: https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Express-badge]: https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB-badge]: https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Zustand-badge]: https://img.shields.io/badge/Zustand-orange?style=flat-square
[Zustand-url]: https://zustand-demo.pmnd.rs/
[Vitest-badge]: https://img.shields.io/badge/Vitest-green?style=flat-square&logo=vitest
[Vitest-url]: https://vitest.dev/