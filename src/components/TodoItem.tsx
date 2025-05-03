import { useState, useCallback, useEffect } from "react";
import { useTodoStore } from "@/store/todo-store";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Edit, Clock, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { getDeadlineStatus, formatTime } from "@/utils/date-utils";

// Define interfaces for props and status
interface TodoItemProps {
  todo: Todo;
}

type DeadlineStatus = 'overdue' | 'due-soon' | 'on-track' | 'none';

// Utility function to format datetime-local input
const formatDateForInput = (isoDate?: string): string => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

// Utility function to convert local datetime to ISO
const toISODate = (localDate: string): string | undefined => {
  if (!localDate) return undefined;
  try {
    const date = new Date(localDate);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  } catch {
    return undefined;
  }
};

// Utility function for status-based styling
const getStatusStyles = (status: DeadlineStatus, completed: boolean) => {
  if (completed) {
    return {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-muted",
    };
  }
  switch (status) {
    case 'overdue':
      return {
        bg: "bg-red-50 dark:bg-red-950/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800/60",
      };
    case 'due-soon':
      return {
        bg: "bg-amber-50 dark:bg-amber-950/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800/60",
      };
    case 'on-track':
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
  // Store actions
  const { toggleTodo, removeTodo, updateTodoTitle, updateTodoTimes } = useTodoStore();

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedStartTime, setEditedStartTime] = useState(formatDateForInput(todo.startTime));
  const [editedDueTime, setEditedDueTime] = useState(formatDateForInput(todo.dueTime));

  // Drag-and-drop setup
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Compute deadline status
  const deadlineStatus = getDeadlineStatus(todo.dueTime);
  const { bg, text, border } = getStatusStyles(deadlineStatus, todo.completed);

  // Toggle todo completion
  const handleToggle = useCallback(() => {
    toggleTodo(todo.id);
  }, [todo.id, toggleTodo]);

  // Remove todo
  const handleRemove = useCallback(() => {
    removeTodo(todo.id);
  }, [todo.id, removeTodo]);

  // Start editing mode
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditedTitle(todo.title);
    setEditedStartTime(formatDateForInput(todo.startTime));
    setEditedDueTime(formatDateForInput(todo.dueTime));
  }, [todo.title, todo.startTime, todo.dueTime]);

  // Save edits
  const saveEdit = useCallback(() => {
    if (editedTitle.trim() === "") return;

    updateTodoTitle(todo.id, editedTitle.trim());
    updateTodoTimes(
      todo.id,
      toISODate(editedStartTime),
      toISODate(editedDueTime)
    );
    setIsEditing(false);
  }, [editedTitle, editedStartTime, editedDueTime, todo.id, updateTodoTitle, updateTodoTimes]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(todo.title);
      setEditedStartTime(formatDateForInput(todo.startTime));
      setEditedDueTime(formatDateForInput(todo.dueTime));
    }
  }, [saveEdit, todo.title, todo.startTime, todo.dueTime]);

  // Reset editing state when todo changes
  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(todo.title);
      setEditedStartTime(formatDateForInput(todo.startTime));
      setEditedDueTime(formatDateForInput(todo.dueTime));
    }
  }, [todo.title, todo.startTime, todo.dueTime, isEditing]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-3 p-3 rounded-lg border ${bg} ${border} ${
        todo.completed ? "opacity-70" : ""
      } group`}
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
        className={`rounded-full flex-shrink-0 ${
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
            autoFocus
            aria-label="Edit todo title"
            placeholder="Enter todo title"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1" htmlFor="start-time">
                Start Time
              </label>
              <Input
                id="start-time"
                type="datetime-local"
                value={editedStartTime}
                onChange={(e) => setEditedStartTime(e.target.value)}
                className="text-xs"
                aria-label="Edit start time"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1" htmlFor="due-time">
                Due Time
              </label>
              <Input
                id="due-time"
                type="datetime-local"
                value={editedDueTime}
                onChange={(e) => setEditedDueTime(e.target.value)}
                className="text-xs"
                aria-label="Edit due time"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="flex-1 cursor-grab select-none" {...listeners}>
          <div className="flex flex-col space-y-1">
            <span
              className={`relative text-sm font-medium ${
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
          onClick={startEditing}
          disabled={isEditing || todo.completed}
          className="flex-shrink-0 h-8 w-8"
          aria-label="Edit todo"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="flex-shrink-0 h-8 w-8 text-destructive"
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}