# Relay Task System — Technical Architecture & Evaluation Documentation

A high-performance, responsive, state-driven **Team Workload Task Management Dashboard** built for **WEBNS Technology Ltd.**

> [!NOTE]
> **Strict Non-Negotiables Compliance**: Built exclusively with **React 18 & TypeScript** (strict mode, zero `any` types) using custom **Tailwind CSS v4** layout architecture. No pre-built component UI kits (MUI, Ant Design, Chakra) were used.

---

## 📸 1. Screenshots & Responsive Viewports

### Desktop View (1280px Viewport) — High-Density Workload Table
![Desktop View 1280px](./public/screenshots/desktop-1280.jpg)

### Mobile View (375px Viewport) — Touch-Friendly Task Cards & Mobile Filter Drawer
![Mobile View 375px](./public/screenshots/mobile-375.jpg)

---

## 🚀 2. Clean Clone & Local Run Instructions

Follow these steps to run the application from a clean repository clone:

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **Package Manager**: `pnpm` (`>= 8.0.0`), `npm`, or `yarn`

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/kazi-ziaur-rahman-majba/Relay-task-system.git

# 2. Navigate into project root directory
cd Relay-task-system

# 3. Install dependencies
pnpm install

# 4. Start Vite local development server
pnpm dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Verification & Production Build
```bash
# Strict TypeScript compilation check (0 errors)
npx tsc --noEmit

# Production bundle build
npx vite build
```

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

## 🚦 Interaction States & System Resilience

Aligned with the strict assessment criteria, the UI cleanly differentiates between 3 distinct system states:

1. **Loading State**: Displays high-fidelity animated `TableSkeleton` rows to prevent Cumulative Layout Shift (CLS) during initial hydration.
2. **Empty State**: Displays contextual "No tasks found" messaging with an explicit **Reset All Filters** action button when filters match 0 results.
3. **Explicit Error State with Retry**:
   - **Hook-Level Error Capture (`useTaskStorage.ts`)**: If JSON seed fetching (`/tasks.json`) or LocalStorage parsing fails, the store catches the exception, updates `error` state, and exposes a memoized `retry` (re-hydration) function.
   - **Component-Level Error Capture (`TasksPage.tsx`)**: Tracks `ownersError` when fetching team members (`/team-members.json`).
   - **UI Presentation**: Instead of showing generic spinners or broken layouts, the app renders a dedicated **Rose-Red Error Alert Card** featuring an `AlertTriangle` icon, explicit error message, and a **"🔄 Retry Loading"** action button that re-triggers dataset hydration seamlessly without a full page reload.

```typescript
// Error State Handling Mechanism in TasksPage.tsx
{isLoading ? (
  <TableSkeleton rowsCount={8} />
) : (storageError || ownersError) ? (
  <div className="p-10 text-center bg-rose-50/60 rounded-2xl border border-rose-200 space-y-4">
    <AlertTriangle className="w-6 h-6 text-rose-600 mx-auto" />
    <h3 className="text-base font-extrabold">Failed to Load Task Data</h3>
    <p className="text-xs text-slate-600">{storageError || ownersError}</p>
    <button onClick={() => { retryStorage(); loadTeamMembers(); }}>
      <RotateCcw className="w-4 h-4" /> Retry Loading
    </button>
  </div>
) : ...}
```

---

## ♿ Accessibility Practices Aligned with WCAG 2.1 AA

- **Keyboard Shortcuts**: Pressing `/` focuses the search bar (guarded against active input elements). Pressing `?` opens shortcuts modal. Pressing `Escape` closes active modal dialogs.
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

## 🤖 AI Tooling Disclosure & Usage

In accordance with the assignment brief, AI assistance (Google Antigravity / Claude) was utilized during development for:
1. **Boilerplate & Type Generation**: Generating strict TypeScript interfaces for normalized `Task` and `TaskOwner` entities.
2. **Mock Dataset Generation**: Generating 250+ realistic tasks in `public/tasks.json` with edge cases (wildly varying title lengths, missing dates/owners, overdue dates, and inconveniently long names like *Bartholomew Montgomery-Wellington III*).
3. **Responsive CSS Architecture & Accessibility Verification**: Streamlining Tailwind CSS v4 styling rules for touch targets ($\ge 44\text{px}$) and verifying WCAG contrast guidelines.

*Note: All code structure, URL search parameter synchronization, data flow hooks, error state with retry handlers, and component partitioning were designed, reviewed, and fully understood for live walkthrough modifications.*

---

## 🤔 Decisions Least Confident About & Alternatives

1. **LocalStorage vs. IndexedDB for Client Persistence**
   - **Current Decision**: Used LocalStorage with JSON parsing (`useTaskStorage`).
   - **Uncertainty**: LocalStorage operations are synchronous and blocking on the main thread, though negligible for ~250 items.
   - **Alternative**: IndexedDB (via `idb` or Dexie.js) would provide async, non-blocking storage, better suited if the dataset scaled to 10,000+ items.

2. **Client-Side Pagination vs. Virtualized Windowing**
   - **Current Decision**: Paginated table rendering (10 items/page) synced with `?page=X`.
   - **Uncertainty**: Pagination requires explicit page clicks, whereas infinite scrolling with virtualization feels more continuous on mobile.
   - **Alternative**: `@tanstack/react-virtual` for virtualized rendering. We chose pagination because URL parameter syncing (`?page=2`) makes deep linking and view-sharing significantly cleaner for team members.

---

## 🚀 Setup & Local Development Instructions

### Prerequisites
- Node.js `>= 18.0.0`
- pnpm `>= 8.0.0` (or npm/yarn)

### Installation
```bash
# Repository Link
https://github.com/kazi-ziaur-rahman-majba/Relay-task-system

# Repository Clone HTTPS Through
git clone https://github.com/kazi-ziaur-rahman-majba/Relay-task-system.git

# Repository Clone SSH Key Through
git clone git@github.com:kazi-ziaur-rahman-majba/Relay-task-system.git

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
