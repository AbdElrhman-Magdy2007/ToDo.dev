
import { Todo } from "@/types/todo";

export const sampleTasks: Omit<Todo, "id">[] = [
  {
    title: "Learn React and TypeScript",
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    title: "Build a Todo App with drag and drop",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Add dark mode support",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Implement local storage persistence",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Make the UI responsive for mobile devices",
    completed: false,
    createdAt: new Date().toISOString()
  }
];
