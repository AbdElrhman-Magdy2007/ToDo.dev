
import { useState } from "react";
import { z } from "zod";
import { useTodoStore } from "@/store/todo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const todoSchema = z.object({
  title: z.string().min(1, "Task name cannot be empty").max(100, "Task name is too long"),
});

export function TodoForm() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      todoSchema.parse({ title });
      addTodo(title);
      setTitle("");
      setError(null);
      toast.success("Task added successfully");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        toast.error(err.errors[0].message);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full ${error ? 'border-destructive' : ''}`}
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  );
}
