
import { useEffect, useState } from "react";
import { useTodoStore } from "@/store/todo-store";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoFilter } from "@/components/TodoFilter";
import { TodoActions } from "@/components/TodoActions";
import { EmptyState } from "@/components/EmptyState";
import { ThemeToggle } from "@/components/ThemeToggle";
import { sampleTasks } from "@/utils/sample-tasks";
import { toast } from "sonner";

export function TodoApp() {
  const { todos, addTodo } = useTodoStore();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // This ensures we only check for empty todos after the store has loaded from localStorage
    setIsLoaded(true);
  }, []);
  
  const handleAddSampleTasks = () => {
    sampleTasks.forEach(task => {
      addTodo(task.title);
    });
    toast.success("Sample tasks added successfully");
  };
  
  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="todo-container">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">TaskMaster</h1>
            <ThemeToggle />
          </div>
          <TodoForm />
        </header>
        
        <main>
          {isLoaded && todos.length === 0 ? (
            <EmptyState onAddSampleTasks={handleAddSampleTasks} />
          ) : (
            <>
              <TodoFilter />
              <TodoList />
              <TodoActions />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
