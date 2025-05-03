import { useState, useCallback, useMemo } from "react";
import { useTodoStore } from "@/store/todo-store";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Edit, Clock, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { getDeadlineStatus, formatTime } from "@/utils/date-utils";
import { toast } from "sonner";

interface TodoItemProps {
  todo: Todo;
}

type DeadlineStatus = "overdue" | "due-soon" | "on-track" | "none" | null;

/**
 * Utility function to format ISO date for time input.
 * @param isoDate - ISO date string (e.g., "2025-05-03T14:30:00.000Z").
 * @returns Time string in HH:MM format (e.g., "14:30") or empty string.
 */
const formatForTimeInput = (isoDate?: string): string => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  } catch {
    return "";
  }
};

/**
 * Utility function to parse time input to ISO date for today.
 * @param time - Time string in HH:MM format (e.g., "14:30").
 * @returns ISO date string or undefined if invalid.
 */
const parseTimeInput = (time?: string): string | undefined => {
  if (!time) return undefined;
  try {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) return undefined;
    const today = new Date();
    today.setHours(hours, minutes, 0, 0);
    return today.toISOString();
  } catch {
    return undefined;
  }
};

/**
 * Utility function to determine status-based styling.
 * @param status - Deadline status.
 * @param completed - Whether the todo is completed.
 * @returns CSS classes for background, text, and border.
 */
const getStatusStyles = (status: DeadlineStatus, completed: boolean) => {
  if (completed) {
    return {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-muted",
    };
  }
  switch (status) {
    case "overdue":
      return {
        bg: "bg-red-50 dark:bg-red-950/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800/60",
      };
    case "due-soon":
      return {
        bg: "bg-amber-50 dark:bg-amber-950/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800/60",
      };
    case "on-track":
      return {
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-600 dark:text-green-500",
        border: "border-green-200 dark:border-green-800/60",
      };
    default:
      return {
        bg: "bg-card",
        text: "text-muted-foreground",
        border: "border-border",
      };
  }
};

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo, updateTodoTitle, updateTodoTimes, reorderTodos } =
    useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedStartTime, setEditedStartTime] = useState(formatForTimeInput(todo.startTime));
  const [editedDueTime, setEditedDueTime] = useState(formatForTimeInput(todo.dueTime));

  // Drag-and-drop setup
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition]
  );

  // Compute deadline status and styles
  const deadlineStatus = getDeadlineStatus(todo.dueTime);
  const { bg, text, border } = useMemo(
    () => getStatusStyles(deadlineStatus, todo.completed),
    [deadlineStatus, todo.completed]
  );

  // Toggle todo completion
  const handleToggle = useCallback(() => {
    toggleTodo(todo.id);
    toast.success(`Task marked as ${todo.completed ? "incomplete" : "complete"}`, {
      duration: 2000,
    });
  }, [todo.id, todo.completed, toggleTodo]);

  // Remove todo
  const handleRemove = useCallback(() => {
    removeTodo(todo.id);
    toast.success("Task deleted", { duration: 2000 });
  }, [todo.id, removeTodo]);

  // Move todo to top or bottom
  const moveToTop = useCallback(() => {
    const todos = useTodoStore.getState().todos;
    const currentIndex = todos.findIndex((t) => t.id === todo.id);
    if (currentIndex !== -1 && currentIndex !== 0) {
      reorderTodos(currentIndex, 0);
      toast.success("Task moved to top", { duration: 2000 });
    }
  }, [todo.id, reorderTodos]);

  const moveToBottom = useCallback(() => {
    const todos = useTodoStore.getState().todos;
    const currentIndex = todos.findIndex((t) => t.id === todo.id);
    if (currentIndex !== -1 && currentIndex !== todos.length - 1) {
      reorderTodos(currentIndex, todos.length - 1);
      toast.success("Task moved to bottom", { duration: 2000 });
    }
  }, [todo.id, reorderTodos]);

  // Start editing mode
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditedTitle(todo.title);
    setEditedStartTime(formatForTimeInput(todo.startTime));
    setEditedDueTime(formatForTimeInput(todo.dueTime));
  }, [todo.title, todo.startTime, todo.dueTime]);

  // Save edits with validation
  const saveEdit = useCallback(() => {
    if (editedTitle.trim() === "") {
      toast.error("Task title cannot be empty", { duration: 3000 });
      return;
    }

    updateTodoTitle(todo.id, editedTitle.trim());
    updateTodoTimes(
      todo.id,
      parseTimeInput(editedStartTime),
      parseTimeInput(editedDueTime)
    );
    setIsEditing(false);
    toast.success("Task updated", { duration: 2000 });
  }, [editedTitle, editedStartTime, editedDueTime, todo.id, updateTodoTitle, updateTodoTimes]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setEditedTitle(todo.title);
        setEditedStartTime(formatForTimeInput(todo.startTime));
        setEditedDueTime(formatForTimeInput(todo.dueTime));
      }
    },
    [saveEdit, todo.title, todo.startTime, todo.dueTime]
  );

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-3 p-3 rounded-lg border ${bg} ${border} ${
        todo.completed ? "opacity-70" : ""
      } group touch-none select-none`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      role="listitem"
      aria-label={`Todo: ${todo.title}`}
    >
      {/* Completion Toggle */}
      <Button
        variant="outline"
        size="icon"
        className={`rounded-full flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 ${
          todo.completed ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={handleToggle}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && <Check className="h-4 w-4" />}
      </Button>

      {/* Editing Mode */}
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-3">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="text-sm"
            autoFocus
            aria-label="Edit task title"
            placeholder="Enter task title"
            maxLength={100}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor={`start-time-${todo.id}`}
                className="block text-xs text-muted-foreground mb-1"
              >
                Start Time (e.g., 2:30 PM)
              </label>
              <Input
                id={`start-time-${todo.id}`}
                type="time"
                value={editedStartTime}
                onChange={(e) => setEditedStartTime(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-xs"
                aria-label="Edit start time"
                step="300" // 5-minute intervals
              />
            </div>
            <div>
              <label
                htmlFor={`due-time-${todo.id}`}
                className="block text-xs text-muted-foreground mb-1"
              >
                Due Time (e.g., 2:30 PM)
              </label>
              <Input
                id={`due-time-${todo.id}`}
                type="time"
                value={editedDueTime}
                onChange={(e) => setEditedDueTime(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-xs"
                aria-label="Edit due time"
                step="300" // 5-minute intervals
              />
            </div>
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="flex-1 cursor-grab active:cursor-grabbing" {...listeners}>
          <div className="flex flex-col space-y-1">
            <span
              className={`text-sm font-medium ${
                todo.completed ? "text-muted-foreground line-through" : ""
              }`}
            >
              {todo.title}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
              {todo.startTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Start: {formatTime(todo.startTime)}</span>
                </div>
              )}
              {todo.dueTime && (
                <div className={`flex items-center gap-1 ${text}`}>
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatTime(todo.dueTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={moveToTop}
          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
          aria-label="Move task to top"
          disabled={isEditing}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={moveToBottom}
          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
          aria-label="Move task to bottom"
          disabled={isEditing}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={startEditing}
          disabled={isEditing || todo.completed}
          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
          aria-label="Edit task"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 text-destructive"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}