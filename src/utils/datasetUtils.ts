import { Task } from '@/types/task';

/**
 * Generates and triggers browser download of current task dataset as a .json file.
 */
export function exportTasksToJson(tasks: Task[]) {
  const jsonString = JSON.stringify(tasks, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `relay-tasks-export-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Parses uploaded file and validates it as a Task array.
 */
export function parseImportedJsonFile(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) {
          reject(new Error('Uploaded JSON must contain a task array.'));
          return;
        }

        // Basic validation of task structure
        const isValid = parsed.every(
          (t) =>
            typeof t === 'object' &&
            t !== null &&
            typeof t.id === 'string' &&
            typeof t.title === 'string' &&
            typeof t.status === 'string' &&
            typeof t.priority === 'string'
        );

        if (!isValid) {
          reject(new Error('Invalid task schema in uploaded JSON file.'));
          return;
        }

        resolve(parsed as Task[]);
      } catch (err) {
        reject(new Error('Failed to parse JSON file. Please check syntax.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
