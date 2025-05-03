
import { useState } from "react";
import { useTodoStore } from "@/store/todo-store";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Edit, Clock, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { getDeadlineStatus, formatTime } from "@/utils/date-utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo, updateTodoTitle, updateTodoTimes } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedStartTime, setEditedStartTime] = useState(todo.startTime || "");
  const [editedDueTime, setEditedDueTime] = useState(todo.dueTime || "");
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
    
    // Convert ISO strings to local datetime-local format
    if (todo.startTime) {
      try {
        const startDate = new Date(todo.startTime);
        setEditedStartTime(startDate.toISOString().slice(0, 16));
      } catch (e) {
        setEditedStartTime("");
      }
    }
    
    if (todo.dueTime) {
      try {
        const dueDate = new Date(todo.dueTime);
        setEditedDueTime(dueDate.toISOString().slice(0, 16));
      } catch (e) {
        setEditedDueTime("");
      }
    }
  };

  const saveEdit = () => {
    if (editedTitle.trim() !== "") {
      updateTodoTitle(todo.id, editedTitle);
      
      // Convert local datetime-local format to ISO strings
      const startTimeISO = editedStartTime ? new Date(editedStartTime).toISOString() : undefined;
      const dueTimeISO = editedDueTime ? new Date(editedDueTime).toISOString() : undefined;
      
      updateTodoTimes(todo.id, startTimeISO, dueTimeISO);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  const deadlineStatus = getDeadlineStatus(todo.dueTime);
  
  const getStatusColor = () => {
    if (todo.completed) return "bg-muted text-muted-foreground border-muted";
    switch (deadlineStatus) {
      case 'overdue': return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/60";
      case 'due-soon': return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/60";
      case 'on-track': return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/60";
      default: return "bg-card";
    }
  };
  
  const getTimeColor = () => {
    if (todo.completed) return "text-muted-foreground";
    switch (deadlineStatus) {
      case 'overdue': return "text-red-600 dark:text-red-400";
      case 'due-soon': return "text-amber-600 dark:text-amber-400";
      case 'on-track': return "text-green-600 dark:text-green-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <motion.div 
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      className={`todo-item group border ${getStatusColor()} ${todo.completed ? "opacity-70" : ""}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="outline"
        size="icon"
        className={`rounded-full flex-shrink-0 ${
          todo.completed ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={handleToggle}
      >
        {todo.completed && <Check className="h-4 w-4" />}
      </Button>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-3">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Start Time
              </label>
              <Input
                type="datetime-local"
                value={editedStartTime}
                onChange={(e) => setEditedStartTime(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Due Time
              </label>
              <Input
                type="datetime-local"
                value={editedDueTime}
                onChange={(e) => setEditedDueTime(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="flex-1 cursor-default select-none"
          {...listeners}
        >
          <div className="flex flex-col space-y-1">
            <span
              className={`relative ${
                todo.completed
                  ? "text-muted-foreground"
                  : ""
              }`}
            >
              {todo.title}
              {todo.completed && (
                <span className="absolute left-0 top-1/2 h-0.5 bg-muted-foreground animate-task-complete" />
              )}
            </span>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
              {todo.startTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Start: {formatTime(todo.startTime)}</span>
                </div>
              )}
              
              {todo.dueTime && (
                <div className={`flex items-center gap-1 ${getTimeColor()}`}>
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatTime(todo.dueTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={startEditing}
          disabled={isEditing || todo.completed}
          className="flex-shrink-0 h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="flex-shrink-0 h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
