
import { useMemo } from "react";
import { useTodoStore } from "@/store/todo-store";
import { TodoItem } from "@/components/TodoItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function TodoList() {
  // Fix: Use a selector function that returns an object, and extract filteredTodos function
  const { todos, reorderTodos, filter } = useTodoStore((state) => ({
    todos: state.todos,
    reorderTodos: state.reorderTodos,
    filter: state.filter
  }));

  // Move the filtering logic to this component to avoid unnecessary renders
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoIds = useMemo(() => filteredTodos.map((todo) => todo.id), [filteredTodos]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = todoIds.indexOf(active.id as string);
      const newIndex = todoIds.indexOf(over.id as string);
      
      reorderTodos(oldIndex, newIndex);
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
