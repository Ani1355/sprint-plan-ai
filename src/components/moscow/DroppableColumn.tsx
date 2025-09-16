import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
  columnId: string;
  children: React.ReactNode;
}

export function DroppableColumn({ columnId, children }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] rounded-lg transition-colors p-2 ${
        isOver 
          ? 'bg-primary/10 border-2 border-primary border-dashed' 
          : 'border-2 border-transparent'
      }`}
    >
      {children}
    </div>
  );
}