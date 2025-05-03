
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
  const { filteredTodos, reorderTodos } = useTodoStore((state) => ({
    filteredTodos: state.filteredTodos,
    reorderTodos: state.reorderTodos,
  }));

  const todos = filteredTodos();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoIds = useMemo(() => todos.map((todo) => todo.id), [todos]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = todoIds.indexOf(active.id as string);
      const newIndex = todoIds.indexOf(over.id as string);
      
      reorderTodos(oldIndex, newIndex);
    }
  };

  if (todos.length === 0) {
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
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
