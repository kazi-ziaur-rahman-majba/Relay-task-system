import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';

const STORAGE_KEY = 'relay_tasks_data_v7';

/**
 * Custom hook to manage Task state with LocalStorage persistence.
 * Safe hydration prevents initial fetch from overwriting local mutations.
 * Auto-generates IDs (TSK-XXXX) and timestamps (createdAt, updatedAt) inside store handlers.
 */
export function useTaskStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to persist tasks to LocalStorage safely
  const persistTasks = useCallback((nextTasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    } catch (err) {
      console.error('Failed to save tasks to LocalStorage:', err);
    }
  }, []);

  // Initial Hydration & Load Sequence
  const hydrateState = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: Fetch seed dataset from /tasks.json
      const res = await fetch('/tasks.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const seedData: Task[] = await res.json();

      setTasks(seedData);
      persistTasks(seedData);
    } catch (err) {
      console.error('Failed to hydrate task storage:', err);
      setError('Failed to load task dataset. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [persistTasks]);

  useEffect(() => {
    hydrateState();
  }, [hydrateState]);

  /**
   * Generates safe auto-incremented TSK-XXXX ID by scanning maximum numerical ID.
   * Prevents duplicate ID creation even after deletions.
   */
  const generateNextId = useCallback((currentTasks: Task[]): string => {
    let maxIdNumber = 0;

    currentTasks.forEach((task) => {
      if (task.id.startsWith('TSK-')) {
        const numPart = parseInt(task.id.replace('TSK-', ''), 10);
        if (!isNaN(numPart) && numPart > maxIdNumber) {
          maxIdNumber = numPart;
        }
      }
    });

    const nextNumber = maxIdNumber + 1;
    return `TSK-${nextNumber.toString().padStart(4, '0')}`;
  }, []);

  /**
   * Store-level createTask mutation:
   * Accepts user form input and internally generates ID, timestamps, and empty tags.
   */
  const createTask = useCallback(
    (input: CreateTaskInput): Task => {
      const now = new Date().toISOString();

      setTasks((prevTasks) => {
        const newId = generateNextId(prevTasks);

        const newTask: Task = {
          id: newId,
          title: input.title.trim(),
          description: input.description?.trim() || null,
          status: input.status,
          priority: input.priority,
          ownerId: input.ownerId === 'unassigned' || !input.ownerId ? null : input.ownerId,
          dueDate: input.dueDate || null,
          createdAt: now,
          updatedAt: now,
          tags: [],
        };

        const updatedTasks = [newTask, ...prevTasks];
        persistTasks(updatedTasks);
        return updatedTasks;
      });

      // Compute prospective created task reference for caller feedback
      return {
        id: 'TSK-PENDING',
        title: input.title,
        description: input.description || null,
        status: input.status,
        priority: input.priority,
        ownerId: input.ownerId === 'unassigned' || !input.ownerId ? null : input.ownerId,
        dueDate: input.dueDate || null,
        createdAt: now,
        updatedAt: now,
      };
    },
    [generateNextId, persistTasks]
  );

  /**
   * Store-level updateTask mutation:
   * Updates specified fields and automatically refreshes updatedAt timestamp.
   */
  const updateTask = useCallback(
    (id: string, updates: UpdateTaskInput) => {
      const now = new Date().toISOString();

      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) => {
          if (task.id !== id) return task;

          const updatedOwnerId =
            updates.ownerId === 'unassigned'
              ? null
              : updates.ownerId !== undefined
              ? updates.ownerId
              : task.ownerId;

          return {
            ...task,

            title: updates.title !== undefined ? updates.title.trim() : task.title,
            description:
              updates.description !== undefined
                ? updates.description?.trim() || null
                : task.description,
            status: updates.status !== undefined ? updates.status : task.status,
            priority: updates.priority !== undefined ? updates.priority : task.priority,
            ownerId: updatedOwnerId,
            dueDate: updates.dueDate !== undefined ? updates.dueDate || null : task.dueDate,
            updatedAt: now,
          };
        });

        persistTasks(updatedTasks);
        return updatedTasks;
      });
    },
    [persistTasks]
  );

  /**
   * Store-level deleteTask mutation:
   * Removes task by ID.
   */
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== id);
        persistTasks(updatedTasks);
        return updatedTasks;
      });
    },
    [persistTasks]
  );

  /**
   * Developer helper: Restores initial seed dataset from /tasks.json.
   */
  const resetToDefaultSeed = useCallback(async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      const res = await fetch('/tasks.json');
      const seedData: Task[] = await res.json();
      setTasks(seedData);
      persistTasks(seedData);
    } catch (err) {
      console.error('Failed to reset seed dataset:', err);
    } finally {
      setIsLoading(false);
    }
  }, [persistTasks]);

  return {
    tasks,
    isLoading,
    error,
    retry: hydrateState,
    createTask,
    updateTask,
    deleteTask,
    resetToDefaultSeed,
  };
}
