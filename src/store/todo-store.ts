
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, TodoFilter } from '@/types/todo';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  addTodo: (title: string, startTime?: string, dueTime?: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodoTitle: (id: string, title: string) => void;
  updateTodoTimes: (id: string, startTime?: string, dueTime?: string) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      
      setFilter: (filter) => set({ filter }),
      
      addTodo: (title, startTime, dueTime) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
          startTime,
          dueTime,
        };
        
        set((state) => ({
          todos: [newTodo, ...state.todos]
        }));
      },
      
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },
      
      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      
      updateTodoTitle: (id, title) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, title } : todo
          ),
        }));
      },
      
      updateTodoTimes: (id, startTime, dueTime) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, startTime, dueTime } : todo
          ),
        }));
      },
      
      reorderTodos: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.todos);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { todos: result };
        });
      },
      
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
