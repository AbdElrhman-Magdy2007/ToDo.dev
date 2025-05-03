
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  startTime?: string;
  dueTime?: string;
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'due-soon';
