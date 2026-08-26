# Trace

A modern, fast bug and issue tracking platform built as a ground-up reinterpretation of Bugzilla for software development teams.

**Live Demo**: [https://trace-orpin-five.vercel.app](https://trace-orpin-five.vercel.app)  
**Repository**: [https://github.com/CodeWithPranav06/trace-bugtracker](https://github.com/CodeWithPranav06/trace-bugtracker)

---

## Features

- **Project & Ticket Management**: Organize bugs by project, severity, priority, and custom color-coded labels.
- **Enforced Workflow Engine**: Strict state machine transitions (`Open` → `In Progress` → `In Review` → `Resolved` → `Closed` / `Reopened`) with admin override rules.
- **Dual View Modes**: Switch between sortable/filterable data tables and an interactive drag-and-drop **Kanban Board**.
- **Keyboard-First Navigation**: Global `Cmd+K` / `Ctrl+K` command palette for fast search and quick actions.
- **Markdown & Discussions**: Markdown-rendered bug descriptions and comment threads with live preview and syntax highlighting.
- **Activity Audit Timeline**: Per-bug activity logging tracking status changes, reassignments, and timestamps.
- **Dashboard & Trends**: Analytics overview with open/critical counts and a 30-day bug resolution trend chart.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components, Server Actions)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon Serverless in production) / SQLite (local dev) via Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js) with JWT sessions and bcrypt
- **UI & Styling**: Tailwind CSS, shadcn/ui patterns, Lucide React icons
- **Libraries**: Recharts, `@hello-pangea/dnd`, `cmdk`, React Markdown

---

## Getting Started

### Prerequisites
- Node.js 18.18+
- npm or pnpm

### Quick Setup & Local Run

```bash
# Clone the repository
git clone https://github.com/CodeWithPranav06/trace-bugtracker.git
cd trace-bugtracker

# Install dependencies
npm install

# Run database setup & seed
npm run setup

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

The seed script creates pre-populated projects, bugs, comments, and users for live testing (all passwords: `password123`):

| Role | Email | Password |
|---|---|---|
| **Admin** | `alice@trace.dev` | `password123` |
| **Developer** | `bob@trace.dev` | `password123` |
| **Developer** | `carol@trace.dev` | `password123` |
| **Reporter** | `dave@trace.dev` | `password123` |

---

## Workflow Model

Status state transitions follow a defined state machine to maintain ticket hygiene:

```
[Open] ---> [In Progress] ---> [In Review] ---> [Resolved] ---> [Closed]
  ^                                                                |
  +--------------------------- [Reopened] <------------------------+
```

### Valid Transitions Matrix
- `Open` -> `In Progress`
- `In Progress` -> `In Review`, `Open`
- `In Review` -> `Resolved`, `In Progress`
- `Resolved` -> `Closed`, `Reopened`
- `Closed` -> `Reopened`
- `Reopened` -> `Open`, `In Progress`

*Note: System administrators have override permissions to force transition between any two states when necessary.*

---

## Bugzilla vs. Trace Comparison

| Area | Bugzilla (Legacy) | Trace (Modern Reconstruction) | Rationale |
|---|---|---|---|
| **User Interface** | Dense, multi-column HTML forms with 30+ exposed fields | Minimal card & board layouts with dark/light theme support | Reduces cognitive overhead for developers |
| **Workflow** | Unrestricted status dropdowns without guardrails | Enforced state machine with transition validation | Prevents tickets skipping code review or testing |
| **Project Views** | Static tabular query output only | Dual-mode: Table view + Drag-and-drop Kanban board | Visual sprint flow management alongside filterable tables |
| **Navigation** | Deep form hierarchy & browser navigation | Keyboard-first `Cmd+K` command palette + direct navigation | Faster workflow for power users |
| **Rich Content** | Plain unformatted text | Full Markdown rendering with syntax highlighting | Clear step-by-step bug reproduction steps |
| **Audit Log** | Hard-to-read textual diff blocks | Per-bug activity timeline showing actor & timestamp | Full historical context at a glance |
| **Mobile** | Non-responsive desktop view | Fully responsive layout | Quick triage on mobile devices |

---

## Environment Variables

For production deployment (e.g. Vercel), set the following environment variables:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
AUTH_SECRET="<random-secret-key>"
NEXTAUTH_SECRET="<random-secret-key>"
NEXTAUTH_URL="https://your-domain.vercel.app"
AUTH_TRUST_HOST=true
```

---

## License

MIT
