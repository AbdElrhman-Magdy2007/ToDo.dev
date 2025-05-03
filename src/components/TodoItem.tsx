
import { useState } from "react";
import { useTodoStore } from "@/store/todo-store";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Edit } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo, updateTodoTitle } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  
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
  };

  const saveEdit = () => {
    if (editedTitle.trim() !== "") {
      updateTodoTitle(todo.id, editedTitle);
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

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      className={`todo-item group ${todo.completed ? "opacity-70" : ""}`}
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
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1"
        />
      ) : (
        <div 
          className="flex-1 cursor-default select-none"
          {...listeners}
        >
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
    </div>
  );
}
