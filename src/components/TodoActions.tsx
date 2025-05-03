
import { useTodoStore } from "@/store/todo-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TodoActions() {
  const { todos, clearCompleted } = useTodoStore(state => ({
    todos: state.todos,
    clearCompleted: state.clearCompleted
  }));

  const completedCount = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = () => {
    if (completedCount > 0) {
      clearCompleted();
      toast.success(`Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`);
    }
  };

  return (
    <div className="mt-6 flex justify-end">
      <Button 
        variant="outline" 
        onClick={handleClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </Button>
    </div>
  );
}
