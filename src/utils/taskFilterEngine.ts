import { Task, TaskFilterState, TaskOwner, PopulatedTask, TaskPriority } from '@/types/task';

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Stage 1: Filter raw tasks based on Search, Status, Priority, and Owner ID.
 * Looks up owner name via usersMap for text search matching.
 */
export function filterTasks(
  tasks: Task[],
  filters: TaskFilterState,
  usersMap: Record<string, TaskOwner>
): Task[] {
  return tasks.filter((task) => {
    // 1. Text Search (matches task.title, task.id, or owner.name)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchId = task.id.toLowerCase().includes(query);

      let matchOwnerName = false;
      if (task.ownerId && usersMap[task.ownerId]) {
        matchOwnerName = usersMap[task.ownerId].name.toLowerCase().includes(query);
      }

      if (!matchTitle && !matchId && !matchOwnerName) {
        return false;
      }
    }

    // 2. Status Filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) {
        return false;
      }
    }

    // 3. Priority Filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) {
        return false;
      }
    }

    // 4. Owner ID Filter ('all', 'unassigned', or 'USR-XXX')
    if (filters.ownerId && filters.ownerId !== 'all') {
      if (filters.ownerId === 'unassigned') {
        if (task.ownerId !== null) return false;
      } else {
        if (task.ownerId !== filters.ownerId) return false;
      }
    }

    return true;
  });
}

/**
 * Stage 2: Deterministically sort filtered tasks.
 * Null due dates are ALWAYS sorted last regardless of ascending or descending sort order.
 */
export function sortTasks(
  tasks: Task[],
  sortBy: TaskFilterState['sortBy'],
  sortOrder: TaskFilterState['sortOrder']
): Task[] {
  const isAsc = sortOrder === 'asc';

  return [...tasks].sort((a, b) => {
    if (sortBy === 'id') {
      const cmp = a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
      return isAsc ? cmp : -cmp;
    }

    if (sortBy === 'priority') {
      const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
      const weightB = PRIORITY_WEIGHTS[b.priority] || 0;

      return isAsc ? weightA - weightB : weightB - weightA;
    }

    if (sortBy === 'dueDate') {
      // Null due dates sorted last always
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const timeA = new Date(a.dueDate).getTime();
      const timeB = new Date(b.dueDate).getTime();

      return isAsc ? timeA - timeB : timeB - timeA;
    }

    // Default: ID
    const cmp = a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
    return isAsc ? cmp : -cmp;
  });
}

/**
 * Stage 3: Paginate sorted tasks.
 * Falls back gracefully to Page 1 if page exceeds totalPages.
 */
export function paginateTasks(
  tasks: Task[],
  page: number,
  pageSize: number = 10
): {
  paginatedTasks: Task[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
} {
  const totalItems = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Fallback to page 1 if invalid / out of bounds
  const currentPage = page > totalPages || page < 1 ? 1 : page;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedTasks = tasks.slice(startIndex, endIndex);

  return {
    paginatedTasks,
    currentPage,
    totalPages,
    totalItems,
    startIndex: totalItems === 0 ? 0 : startIndex + 1,
    endIndex,
  };
}

/**
 * Orchestrator function: Processes raw tasks through filter -> sort -> paginate pipeline
 * and populates owner references for UI consumption.
 */
export function processTasks(
  rawTasks: Task[],
  filters: TaskFilterState,
  usersMap: Record<string, TaskOwner>,
  pageSize: number = 10
): {
  items: PopulatedTask[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
} {
  const filtered = filterTasks(rawTasks, filters, usersMap);
  const sorted = sortTasks(filtered, filters.sortBy, filters.sortOrder);
  const pagination = paginateTasks(sorted, filters.page, pageSize);

  // Populate owner references
  const populatedItems: PopulatedTask[] = pagination.paginatedTasks.map((task) => ({
    ...task,
    owner: task.ownerId ? usersMap[task.ownerId] || null : null,
  }));

  return {
    items: populatedItems,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    currentPage: pagination.currentPage,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
  };
}
