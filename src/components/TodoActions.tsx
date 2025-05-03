
import { useMemo } from "react";
import { useTodoStore } from "@/store/todo-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function TodoActions() {
  // Use separate selectors to minimize re-renders
  const todos = useTodoStore(state => state.todos);
  const clearCompleted = useTodoStore(state => state.clearCompleted);

  // Use useMemo to prevent recalculating on every render
  const completedCount = useMemo(() => 
    todos.filter(todo => todo.completed).length, 
    [todos]
  );

  const handleClearCompleted = () => {
    if (completedCount > 0) {
      clearCompleted();
      toast.success(`Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`);
    }
  };

  return (
    <motion.div 
      className="mt-6 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="outline" 
        onClick={handleClearCompleted}
        disabled={completedCount === 0}
        className="hover:bg-primary/10"
      >
        Clear completed
      </Button>
    </motion.div>
  );
}
