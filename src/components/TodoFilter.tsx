
import { useMemo } from "react";
import { useTodoStore } from "@/store/todo-store";
import { TodoFilter as FilterType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function TodoFilter() {
  // Use separate selectors to minimize re-renders
  const filter = useTodoStore(state => state.filter);
  const setFilter = useTodoStore(state => state.setFilter);
  const todos = useTodoStore(state => state.todos);
  
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  // Use useMemo to prevent recalculating on every render
  const { activeTodoCount, completedCount, dueSoonCount, overdueCount } = useMemo(() => {
    const active = todos.filter(todo => !todo.completed).length;
    const completed = todos.filter(todo => todo.completed).length;
    
    const now = new Date();
    const dueSoon = todos.filter(todo => {
      if (!todo.dueTime || todo.completed) return false;
      const dueDate = new Date(todo.dueTime);
      const diffMs = dueDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffMs > 0 && diffHours <= 24;
    }).length;
    
    const overdue = todos.filter(todo => {
      if (!todo.dueTime || todo.completed) return false;
      const dueDate = new Date(todo.dueTime);
      return dueDate < now;
    }).length;
    
    return { 
      activeTodoCount: active, 
      completedCount: completed,
      dueSoonCount: dueSoon,
      overdueCount: overdue
    };
  }, [todos]);
  
  return (
    <motion.div 
      className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm text-muted-foreground">
        {activeTodoCount} task{activeTodoCount !== 1 ? 's' : ''} left
        {completedCount > 0 && ` • ${completedCount} completed`}
        {overdueCount > 0 && (
          <span className="text-red-500 dark:text-red-400"> • {overdueCount} overdue</span>
        )}
        {dueSoonCount > 0 && (
          <span className="text-amber-500 dark:text-amber-400"> • {dueSoonCount} due soon</span>
        )}
      </div>
      
      <div className="flex space-x-2">
        {filters.map((filterOption) => (
          <Button
            key={filterOption.value}
            variant={filter === filterOption.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.value)}
            className={filter === filterOption.value ? "" : "hover:bg-primary/10"}
          >
            {filterOption.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
