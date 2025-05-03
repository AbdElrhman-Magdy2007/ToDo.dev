
import { useTodoStore } from "@/store/todo-store";
import { TodoFilter as FilterType } from "@/types/todo";
import { Button } from "@/components/ui/button";

export function TodoFilter() {
  const { filter, setFilter, todos } = useTodoStore(state => ({
    filter: state.filter,
    setFilter: state.setFilter,
    todos: state.todos
  }));
  
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
      <div className="text-sm text-muted-foreground">
        {activeTodoCount} task{activeTodoCount !== 1 ? 's' : ''} left
        {completedCount > 0 && ` • ${completedCount} completed`}
      </div>
      
      <div className="flex space-x-2">
        {filters.map((filterOption) => (
          <Button
            key={filterOption.value}
            variant={filter === filterOption.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.value)}
          >
            {filterOption.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
