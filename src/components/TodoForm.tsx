import { useState, useCallback } from "react";
import { z } from "zod";
import { useTodoStore } from "@/store/todo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { parseTimeToToday } from "@/utils/date-utils";

// Define schema for todo validation
const todoSchema = z.object({
  title: z.string().min(1, "Task name cannot be empty").max(100, "Task name is too long"),
  startTime: z.string().optional(),
  dueTime: z.string().optional(),
});

export function TodoForm() {
  // Local state for form inputs
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Store action to add a todo
  const addTodo = useTodoStore((state) => state.addTodo);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // Validate form inputs
        todoSchema.parse({ title, startTime, dueTime });

        // Convert time inputs to ISO strings with today's date
        const startTimeISO = parseTimeToToday(startTime);
        const dueTimeISO = parseTimeToToday(dueTime);

        // Add todo to store
        addTodo(title, startTimeISO || undefined, dueTimeISO || undefined);

        // Reset form
        setTitle("");
        setStartTime("");
        setDueTime("");
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
    },
    [title, startTime, dueTime, addTodo]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Add new task form"
    >
      <div>
        <Input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full ${error ? "border-destructive" : ""}`}
          aria-label="Task title"
          maxLength={100}
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="start-time"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Start Time
          </label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full"
            aria-label="Start time"
            step="300" // 5-minute intervals
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="due-time"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Due Time
          </label>
          <Input
            id="due-time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full"
            aria-label="Due time"
            step="300" // 5-minute intervals
          />
        </div>
      </div>

      <Button type="submit" className="w-full" aria-label="Add task">
        Add Task
      </Button>
    </motion.form>
  );
}