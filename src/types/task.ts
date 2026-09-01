/**
 * Team Task System - Domain Data Model & Application State Types
 * Normalized architecture with User entity and Task entity separation.
 */

export type TaskStatus =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'in_review'
  | 'done';

export type TaskPriority =
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low';

export type TaskSortField =
  | 'dueDate'
  | 'priority'
  | 'createdAt'
  | 'title';

export interface TaskOwner {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  ownerId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

/**
 * Task joined with populated owner details for UI rendering
 */
export interface PopulatedTask extends Omit<Task, 'ownerId'> {
  ownerId: string | null;
  owner: TaskOwner | null;
}

export interface TaskFilterState {
  search: string;
  status: TaskStatus[];
  priority: TaskPriority[];
  ownerId: string; // 'all', 'unassigned', or user ID
  sortBy: TaskSortField;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
