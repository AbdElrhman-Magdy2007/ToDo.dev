
import { Button } from "@/components/ui/button";
import { Check, ListTodo } from "lucide-react";

interface EmptyStateProps {
  onAddSampleTasks?: () => void;
}

export function EmptyState({ onAddSampleTasks }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <ListTodo className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>
      <p className="text-muted-foreground max-w-sm mb-6">
        Add your first task using the form above or click below to add some sample tasks to get started.
      </p>
      <Button onClick={onAddSampleTasks}>
        <Check className="mr-2 h-4 w-4" /> Add sample tasks
      </Button>
    </div>
  );
}
