# Relay Task System — Technical Architecture & Evaluation Documentation

A high-performance, responsive, state-driven **Team Workload Task Management Dashboard** built for **WEBNS Technology Ltd.**

---

## 🌟 Executive Overview & Tech Stack

The **Relay Task System** is a client-side Single Page Application (SPA) designed to manage, filter, sort, paginate, and mutate a workload dataset of **250+ realistic engineering tasks**.

### Core Tech Stack:
- **Framework**: React 18 (Functional Components, Custom Hooks)
- **Language**: TypeScript (Strict Mode, 0 Any Types)
- **Styling**: Tailwind CSS v4 (Zero third-party pre-built UI kits — MUI, Ant Design, or Chakra intentionally excluded)
- **Routing & URL Engine**: React Router v6 (`useSearchParams` URL state sync)
- **Icons**: Lucide React & React Icons
- **Build Tooling**: Vite v5

---

## 🏗️ System Architecture & Unidirectional Data Flow

The application follows a strict unidirectional data flow connecting the URL state, LocalStorage persistent data mutators, the deterministic filtering engine, and responsive UI components:

```text
                           public/team-members.json & tasks.json
                                             │
                                             ▼
                                    useTaskStorage Hook
                          (State Mutator + LocalStorage Persistence)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             Task Mutation Handlers                      URL SearchParams Engine
           (Create, Edit, Delete, Quick Update)              (useUrlTaskState Hook)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                    processTasks Engine
                           (filterTasks ➔ sortTasks ➔ paginateTasks)
                                             │
                                             ▼
                                   Responsive UI Views
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
           Desktop High-Density Table                  Mobile Touch Card List
           (>= 768px / md: breakpoint)               (< 768px / md: breakpoint)
```

---

## 📊 Normalized Data Architecture

To eliminate data duplication across hundreds of task records, the architecture separates **Team Members** from **Tasks**:

### 1. Team Member Entity (`public/team-members.json`)
```json
{
  "id": "USR-003",
  "name": "Alex Rivera",
  "email": "alex.rivera@webns.io",
  "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
}
```

### 2. Task Entity (`public/tasks.json`)
```json
{
  "id": "TSK-0001",
  "title": "Fix OAuth2 token refresh race condition on slow 3G network connections",
  "description": "Users on mobile networks are experiencing silent authentication failures...",
  "status": "backlog",
  "priority": "urgent",
  "ownerId": "USR-003",
  "dueDate": "2026-09-15T12:00:00.000Z",
  "createdAt": "2026-08-21T12:00:00.000Z",
  "updatedAt": "2026-08-31T12:00:00.000Z"
}
```

---

## 🔗 Bi-Directional URL SearchParams Synchronization

Every user interaction with search, filters, sorting, and pagination bi-directionally syncs with browser query parameters via `useUrlTaskState()`:

| Query Parameter | Application Mapping | Format & Values |
| :--- | :--- | :--- |
| `?search=` | Text Search | Case-insensitive match on Title, ID (`TSK-XXXX`), or Owner Name |
| `?status=` | Workflow Status | Comma-separated enums: `backlog,todo,in_progress,in_review,done` |
| `?priority=` | Priority Level | Comma-separated enums: `urgent,high,medium,low` |
| `?ownerId=` | Assignee | `unassigned` or specific User ID (`USR-003`) |
| `?sort=` | Sort Field | `dueDate`, `priority`, `createdAt`, or `title` |
| `?order=` | Sort Direction | `asc` or `desc` |
| `?page=` | Page Number | 1-indexed page integer |

### Clean Default Strategy
Default values (`search=""`, `status=all`, `priority=all`, `ownerId=all`, `sort=createdAt`, `order=desc`, `page=1`) leave the URL clean (`/`). Copying or sharing any filtered URL restores the exact state 100% on page load or browser back/forward navigation.

---

## ⚡ Filtering, Sorting & Pagination Engine

The pure functional pipeline (`src/utils/taskFilterEngine.ts`) decouples state mutations from display logic:

1. **`filterTasks(tasks, filters, usersMap)`**:
   - Performs $O(1)$ lookup mapping `ownerId ➔ User` to match search queries against task title, task ID, or owner name.
2. **`sortTasks(filteredTasks, sortBy, sortOrder)`**:
   - Deterministically sorts tasks. **Null due dates are always sorted last** regardless of ascending or descending order.
3. **`paginateTasks(sortedTasks, page, pageSize = 10)`**:
   - Computes paginated slices. If a user modifies filters or deletes items reducing `totalPages`, the engine automatically redirects to Page 1 or the last valid page.

---

## 💾 LocalStorage Persistence Strategy (`useTaskStorage.ts`)

- **Key**: `relay_tasks_data`
- **Hydration Flow**:
  1. Checks `localStorage.getItem('relay_tasks_data')`.
  2. If present and valid, hydrates state from local storage.
  3. If missing or invalid, fetches `/tasks.json` seed data and initializes local storage.
- **Store-Level Enrichment**: The UI modal supplies user input (`title`, `description`, `status`, `priority`, `ownerId`, `dueDate`). The store internally generates `id` (safe auto-increment `TSK-XXXX`), `createdAt`, `updatedAt`, and `tags`.

---

## 📱 Tailwind Breakpoint Architecture & Responsiveness

Layout responsiveness is strictly controlled using standard Tailwind CSS breakpoint utilities:

- **Mobile (`< md:` / `< 768px`)**: Renders `TaskCardView`, `MobileFilterDrawer`, and touch-friendly controls ($\ge 44\text{px} \times 44\text{px}$ touch targets).
- **Tablet (`md:` / `768px - 1023px`)**: Renders `TaskTableView` with adaptive column widths.
- **Desktop (`lg:` & `xl:` / `1024px+`)**: Renders high-density `TaskTableView`, expanded filter bar, and sticky headers.

---

## ♿ Accessibility Practices Aligned with WCAG 2.1 AA

- **Keyboard Shortcuts**: Pressing `/` focuses the search bar (guarded against active input elements). Pressing `Escape` closes active modal dialogs.
- **Modal Focus Management**: Modals feature ARIA tags (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), auto-focusing on the first input upon launch.
- **Visual Accessibility**: Statuses and priorities pair text badges with high-contrast background and border colors, ensuring color-blind usability.

---

## ⚖️ Technical Trade-offs & Decisions

1. **Why LocalStorage instead of a Real Database?**
   - The assessment brief explicitly specified client-side front-end architecture. LocalStorage provides persistent mutations without requiring backend infrastructure overhead.
2. **Why Pagination instead of Virtualization?**
   - The 250 task dataset renders smoothly in DOM slices of 10 items per page, offering simpler navigation and URL sharing than infinite scrolling.
3. **Why Normalized Owner Data?**
   - Storing `ownerId` foreign keys instead of embedded owner objects prevents duplicating user records 30+ times across task objects.

---

## 🚀 Setup & Local Development Instructions

### Prerequisites
- Node.js `>= 18.0.0`
- pnpm `>= 8.0.0` (or npm/yarn)

### Installation
```bash
# Clone the repository
git clone https://github.com/kazi-ziaur-rahman-majba/Relay-task-system.git

# Navigate to project directory
cd Relay-task-system

# Install dependencies
pnpm install
```

### Running Development Server
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Verification & Production Build
```bash
# Strict TypeScript compilation check
npx tsc --noEmit

# Production bundle build
npx vite build
```
