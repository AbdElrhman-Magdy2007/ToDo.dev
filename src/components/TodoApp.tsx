
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
import { motion } from "framer-motion";

export function TodoApp() {
  // Use separate selectors to minimize re-renders
  const todos = useTodoStore(state => state.todos);
  const addTodo = useTodoStore(state => state.addTodo);
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
    <motion.div 
      className="min-h-screen py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="todo-container">
        <motion.header 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              TaskMaster
            </motion.h1>
            <ThemeToggle />
          </div>
          <TodoForm />
        </motion.header>
        
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
    </motion.div>
  );
}
