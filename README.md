# F.R.I.D.A.Y. - Personal Command AI for Students

A browser-based personal AI assistant inspired by Iron Man's F.R.I.D.A.Y. Manages your academic life — tasks, study schedules, exam revision, calendar, and voice interaction — all running locally with **zero API keys and zero cost**.

![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-cyan) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Natural Language Commands
Type or speak commands like `add task: finish physics homework by Friday` or `generate study schedule`. F.R.I.D.A.Y. understands dates, subjects, priorities, and more — all with client-side regex + chrono-node, no AI API needed.

### Task Management
- Add, complete, and track tasks with deadlines and priorities
- Auto-detected urgency scoring with countdown timers
- Subject tagging (Physics, Maths, Chemistry, Economics, etc.)
- **Quick Import** — paste assignment text from Teams, Google Classroom, or any school portal and F.R.I.D.A.Y. auto-parses each line into tasks

### Study Schedule Generation
- Greedy scheduling algorithm that fills your week with study blocks
- Deadline-aware: tasks get scheduled before their due date
- Weak topics get priority slots proportional to their weakness score
- Manual block creation alongside auto-generation

### Calendar View
- Monthly calendar grid with task deadlines and schedule blocks
- Colour-coded pills (priority for tasks, type for blocks)
- Click any day to see full detail panel with tasks due and schedule
- Complete tasks and blocks directly from the calendar

### Revision Tracking
- Pre-loaded Edexcel A-Level topics for Physics, Chemistry, Biology, and Economics
- SAT topic coverage (Math, Reading, Writing)
- Per-topic confidence rating (1-5 scale)
- Weakness scoring based on confidence + time since last review
- Add custom subjects and topics

### Voice I/O
- Speech recognition for hands-free command input (Web Speech API)
- Text-to-speech responses with customisable voice, speed, and pitch
- F.R.I.D.A.Y. personality — context-aware, slightly witty responses

### Authentication
- Local login/signup system with SHA-256 password hashing
- Per-user data isolation via localStorage
- No server, no database — everything stays on your device

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Build tool + dev server |
| **Tailwind CSS 4** | Styling (Iron Man HUD dark theme) |
| **chrono-node** | Natural language date parsing |
| **lucide-react** | Icons |
| **Web Speech API** | Voice input/output (built into browsers) |
| **localStorage** | Data persistence |

**No backend. No database. No API keys. No cost.**

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22+
- npm

### Install & Run

```bash
git clone https://github.com/arhancodes/friday.git
cd friday
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/           Login/signup page
│   ├── calendar/       Monthly calendar + day detail panel
│   ├── dashboard/      Quick stats, today's schedule, deadlines, weak topics
│   ├── layout/         App shell, sidebar, top bar, command bar
│   ├── revision/       Subject cards, topic lists, confidence badges
│   ├── schedule/       Weekly schedule grid, study blocks
│   ├── settings/       Voice settings modal
│   ├── shared/         Reusable components (badges, timers, modals)
│   └── tasks/          Task list, task cards, quick import modal
├── engine/
│   ├── commandParser       Regex-based intent classification
│   ├── importParser        Paste-to-parse bulk task import
│   ├── scheduleGenerator   Priority-queue greedy scheduling
│   ├── weakTopicAnalyzer   Confidence + staleness scoring
│   └── fridayPersonality   Response templates with personality
├── hooks/                  Custom React hooks for all state management
├── context/                Global state provider (FridayContext)
├── data/                   Pre-loaded SAT + A-Level topic data
└── utils/                  Date utils, calendar grid, constants
```

## Usage Examples

| Command | What it does |
|---|---|
| `add task: revise physics by Thursday` | Creates a task with subject + deadline |
| `mark task 2 as done` | Completes a task |
| `generate study schedule` | Auto-generates a week of study blocks |
| `show weak topics` | Lists topics that need revision |
| `show my tasks` | Switches to task list view |

## Deployment

FRIDAY is deployed via GitHub Actions to GitHub Pages. Every push to `main` triggers an automatic build and deploy.

## Built By

**Arhan Harchandani** — [arhan.dev](https://arhan.dev)

Built with the help of Claude Code.
