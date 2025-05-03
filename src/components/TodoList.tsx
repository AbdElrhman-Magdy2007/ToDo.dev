import { useMemo, useCallback } from "react";
import { useTodoStore } from "@/store/todo-store";
import { TodoItem } from "@/components/TodoItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";

// Define strict Todo interface
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  startTime?: string;
  dueTime?: string;
}

type FilterType = "all" | "active" | "completed" | "due-soon";

/**
 * Filters todos based on the selected filter type.
 * @param todos - Array of Todo objects.
 * @param filter - Filter type to apply.
 * @returns Filtered array of Todo objects.
 */
const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  const now = new Date();

  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "due-soon":
      return todos.filter((todo) => {
        if (!todo.dueTime || todo.completed) return false;
        const dueDate = new Date(todo.dueTime);
        if (isNaN(dueDate.getTime())) return false;
        const diffMs = dueDate.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffMs > 0 && diffHours <= 24;
      });
    default:
      return todos;
  }
};

export function TodoList() {
  // Select specific state slices to optimize re-renders
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const reorderTodos = useTodoStore((state) => state.reorderTodos);

  // Memoize filtered todos to prevent unnecessary recalculations
  const filteredTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);

  // Memoize todo IDs for SortableContext
  const todoIds = useMemo(() => filteredTodos.map((todo) => todo.id), [filteredTodos]);

  // Configure drag-and-drop sensors for desktop and mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Delay to distinguish from scroll
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag-and-drop reordering
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = todoIds.indexOf(active.id as string);
      const newIndex = todoIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTodos(oldIndex, newIndex);
      }
    },
    [todoIds, reorderTodos]
  );

  // Render empty state with animation
  if (filteredTodos.length === 0) {
    return (
      <motion.div
        className="py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        role="status"
        aria-live="polite"
      >
        <p className="text-muted-foreground text-sm font-medium">
          No tasks found for the current filter.
        </p>
      </motion.div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
        <motion.div
          className="space-y-2 px-2 sm:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          role="list"
          aria-label="Todo list"
        >
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}