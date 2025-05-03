import { useState, useCallback } from "react";
import { z } from "zod";
import { useTodoStore } from "@/store/todo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { parseTimeToToday } from "@/utils/date-utils";

// Define schema for todo validation with stricter time validation
const todoSchema = z.object({
  title: z.string().min(1, "Task name cannot be empty").max(100, "Task name is too long"),
  startTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || parseTimeToToday(val) !== null,
      "Invalid start time format. Use HH:MM AM/PM (e.g., 2:30 PM)"
    ),
  dueTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || parseTimeToToday(val) !== null,
      "Invalid due time format. Use HH:MM AM/PM (e.g., 2:30 PM)"
    ),
});

export function TodoForm() {
  // Local state for form inputs
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [errors, setErrors] = useState<{ title?: string; startTime?: string; dueTime?: string }>({});

  // Store action to add a todo
  const addTodo = useTodoStore((state) => state.addTodo);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // Validate form inputs
        const validatedData = todoSchema.parse({ title, startTime, dueTime });

        // Convert time inputs to ISO strings with today's date
        const startTimeISO = parseTimeToToday(validatedData.startTime);
        const dueTimeISO = parseTimeToToday(validatedData.dueTime);

        // Add todo to store
        addTodo(validatedData.title, startTimeISO || undefined, dueTimeISO || undefined);

        // Reset form
        setTitle("");
        setStartTime("");
        setDueTime("");
        setErrors({});
        toast.success("Task added successfully", { duration: 2000 });
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors = err.errors.reduce(
            (acc, error) => ({
              ...acc,
              [error.path[0]]: error.message,
            }),
            {}
          );
          setErrors(fieldErrors);
          toast.error(fieldErrors.title || fieldErrors.startTime || fieldErrors.dueTime, {
            duration: 3000,
          });
        } else {
          setErrors({ title: "Something went wrong" });
          toast.error("Something went wrong", { duration: 3000 });
        }
      }
    },
    [title, startTime, dueTime, addTodo]
  );

  // Handle input blur to validate individual fields
  const handleBlur = useCallback(
    (field: "title" | "startTime" | "dueTime", value: string) => {
      try {
        todoSchema.parse({ [field]: value });
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      } catch (err) {
        if (err instanceof z.ZodError) {
          setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
        }
      }
    },
    []
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-card rounded-lg shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Add new task form"
    >
      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-muted-foreground mb-1"
        >
          Task Title
        </label>
        <Input
          id="task-title"
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur("title", title)}
          className={`w-full ${errors.title ? "border-destructive" : ""}`}
          aria-label="Task title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          maxLength={100}
        />
        {errors.title && (
          <p id="title-error" className="text-xs text-destructive mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="start-time"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Start Time (e.g., 2:30 PM)
          </label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            onBlur={() => handleBlur("startTime", startTime)}
            className={`w-full ${errors.startTime ? "border-destructive" : ""}`}
            aria-label="Start time"
            aria-invalid={!!errors.startTime}
            aria-describedby={errors.startTime ? "start-time-error" : undefined}
            step="300" // 5-minute intervals
          />
          {errors.startTime && (
            <p id="start-time-error" className="text-xs text-destructive mt-1">
              {errors.startTime}
            </p>
          )}
        </div>

        <div className="flex-1">
          <label
            htmlFor="due-time"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Due Time (e.g., 2:30 PM)
          </label>
          <Input
            id="due-time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            onBlur={() => handleBlur("dueTime", dueTime)}
            className={`w-full ${errors.dueTime ? "border-destructive" : ""}`}
            aria-label="Due time"
            aria-invalid={!!errors.dueTime}
            aria-describedby={errors.dueTime ? "due-time-error" : undefined}
            step="300" // 5-minute intervals
          />
          {errors.dueTime && (
            <p id="due-time-error" className="text-xs text-destructive mt-1">
              {errors.dueTime}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        aria-label="Add task"
        disabled={!!errors.title || title.trim() === ""}
      >
        Add Task
      </Button>
    </motion.form>
  );
}