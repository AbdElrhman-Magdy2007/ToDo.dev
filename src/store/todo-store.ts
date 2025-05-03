
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, TodoFilter } from '@/types/todo';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodoTitle: (id: string, title: string) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  clearCompleted: () => void;
  filteredTodos: () => Todo[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      
      setFilter: (filter) => set({ filter }),
      
      addTodo: (title) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
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
      
      filteredTodos: () => {
        const { todos, filter } = get();
        
        switch (filter) {
          case 'active':
            return todos.filter((todo) => !todo.completed);
          case 'completed':
            return todos.filter((todo) => todo.completed);
          default:
            return todos;
        }
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
