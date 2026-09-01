import { useSearchParams } from 'react-router-dom';
import { TaskStatus, TaskPriority, TaskSortField, TaskFilterState } from '@/types/task';
import { useCallback, useMemo } from 'react';

const VALID_STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
const VALID_PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];
const VALID_SORT_FIELDS: TaskSortField[] = ['id', 'dueDate', 'priority', 'createdAt', 'title'];

export function useUrlTaskState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract & sanitize filters from URL
  const filters: TaskFilterState = useMemo(() => {
    const rawSearch = searchParams.get('search') || '';

    // Status: comma separated or 'all'
    const rawStatus = searchParams.get('status');
    let statusList: TaskStatus[] = [];
    if (rawStatus && rawStatus !== 'all') {
      statusList = rawStatus
        .split(',')
        .map((s) => s.trim() as TaskStatus)
        .filter((s) => VALID_STATUSES.includes(s));
    }

    // Priority: comma separated or 'all'
    const rawPriority = searchParams.get('priority');
    let priorityList: TaskPriority[] = [];
    if (rawPriority && rawPriority !== 'all') {
      priorityList = rawPriority
        .split(',')
        .map((p) => p.trim() as TaskPriority)
        .filter((p) => VALID_PRIORITIES.includes(p));
    }

    // Owner ID: 'all', 'unassigned', or specific user ID
    const rawOwnerId = searchParams.get('ownerId') || 'all';

    // Sort Field & Order
    const rawSortBy = searchParams.get('sort') as TaskSortField;
    const sortBy: TaskSortField = VALID_SORT_FIELDS.includes(rawSortBy) ? rawSortBy : 'id';

    const rawOrder = searchParams.get('order');
    const sortOrder: 'asc' | 'desc' = rawOrder === 'desc' ? 'desc' : 'asc';

    // Page
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    return {
      search: rawSearch,
      status: statusList,
      priority: priorityList,
      ownerId: rawOwnerId,
      sortBy,
      sortOrder,
      page,
      pageSize: 10,
    };
  }, [searchParams]);

  // Update URL helper: preserves clean defaults
  const updateUrl = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === 'all' || value === '1') {
              if (key === 'page' && value !== '1' && value !== null && value !== undefined) {
                next.set('page', value);
              } else {
                next.delete(key);
              }
            } else {
              next.set(key, value);
            }
          });

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateUrl({ search: search.trim() || null, page: '1' });
    },
    [updateUrl]
  );

  const setStatus = useCallback(
    (status: TaskStatus[] | TaskStatus | 'all') => {
      if (status === 'all' || (Array.isArray(status) && status.length === 0)) {
        updateUrl({ status: null, page: '1' });
      } else if (Array.isArray(status)) {
        updateUrl({ status: status.join(','), page: '1' });
      } else {
        updateUrl({ status, page: '1' });
      }
    },
    [updateUrl]
  );

  const setPriority = useCallback(
    (priority: TaskPriority[] | TaskPriority | 'all') => {
      if (priority === 'all' || (Array.isArray(priority) && priority.length === 0)) {
        updateUrl({ priority: null, page: '1' });
      } else if (Array.isArray(priority)) {
        updateUrl({ priority: priority.join(','), page: '1' });
      } else {
        updateUrl({ priority, page: '1' });
      }
    },
    [updateUrl]
  );

  const setOwnerId = useCallback(
    (ownerId: string) => {
      updateUrl({ ownerId: ownerId === 'all' ? null : ownerId, page: '1' });
    },
    [updateUrl]
  );

  const setSortBy = useCallback(
    (sortBy: TaskSortField) => {
      updateUrl({ sort: sortBy === 'id' ? null : sortBy });
    },
    [updateUrl]
  );

  const toggleSortOrder = useCallback(() => {
    updateUrl({ order: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
  }, [filters.sortOrder, updateUrl]);

  const setPage = useCallback(
    (page: number) => {
      updateUrl({ page: page <= 1 ? null : page.toString() });
    },
    [updateUrl]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status.length > 0 ||
      filters.priority.length > 0 ||
      filters.ownerId !== 'all'
    );
  }, [filters]);

  return {
    filters,
    setSearch,
    setStatus,
    setPriority,
    setOwnerId,
    setSortBy,
    toggleSortOrder,
    setPage,
    resetFilters,
    hasActiveFilters,
  };
}
