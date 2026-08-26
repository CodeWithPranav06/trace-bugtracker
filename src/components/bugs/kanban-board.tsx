"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateBugStatus } from "@/actions/bugs";
import { STATUSES, STATUS_COLORS, SEVERITY_COLORS, PRIORITY_LABELS } from "@/lib/workflow";
import { cn, getInitials } from "@/lib/utils";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface Bug {
  id: string;
  title: string;
  status: string;
  severity: string;
  priority: string;
  projectId: string;
  reporter: { name: string };
  assignee: { name: string } | null;
  labels: { label: { id: string; name: string; color: string } }[];
  _count: { comments: number };
}

interface KanbanBoardProps {
  bugs: Bug[];
  projectId: string;
}

export function KanbanBoard({ bugs: initialBugs, projectId }: KanbanBoardProps) {
  const [bugs, setBugs] = useState(initialBugs);
  const router = useRouter();

  const columns = STATUSES.map((status) => ({
    status,
    bugs: bugs.filter((b) => b.status === status),
  }));

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, destination } = result;
      if (!destination) return;

      const newStatus = destination.droppableId;
      const bug = bugs.find((b) => b.id === draggableId);
      if (!bug || bug.status === newStatus) return;

      // Optimistic update
      setBugs((prev) =>
        prev.map((b) => (b.id === draggableId ? { ...b, status: newStatus } : b))
      );

      const result2 = await updateBugStatus(draggableId, newStatus);
      if (result2?.error) {
        // Revert on error
        setBugs((prev) =>
          prev.map((b) => (b.id === draggableId ? { ...b, status: bug.status } : b))
        );
        alert(result2.error);
      } else {
        router.refresh();
      }
    },
    [bugs, router]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ status, bugs: columnBugs }) => (
          <div
            key={status}
            className="flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-900 rounded-xl"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", STATUS_COLORS[status])}>
                  {status}
                </span>
                <span className="text-xs text-gray-500">{columnBugs.length}</span>
              </div>
            </div>

            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "p-2 min-h-[200px] transition-colors",
                    snapshot.isDraggingOver && "bg-blue-50 dark:bg-blue-900/10"
                  )}
                >
                  {columnBugs.map((bug, index) => (
                    <Draggable key={bug.id} draggableId={bug.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow",
                            snapshot.isDragging && "shadow-lg ring-2 ring-blue-500"
                          )}
                        >
                          <Link
                            href={`/dashboard/projects/${projectId}/bugs/${bug.id}`}
                            className="block"
                            onClick={(e) => {
                              if (snapshot.isDragging) e.preventDefault();
                            }}
                          >
                            <p className="text-sm font-medium mb-2 line-clamp-2">
                              {bug.title}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mb-2">
                              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", SEVERITY_COLORS[bug.severity])}>
                                {bug.severity}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {PRIORITY_LABELS[bug.priority]}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                {bug.labels.slice(0, 2).map(({ label }) => (
                                  <span
                                    key={label.id}
                                    className="text-[10px] px-1.5 py-0.5 rounded-full border"
                                    style={{ borderColor: label.color, color: label.color }}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                {bug._count.comments > 0 && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                                    <MessageSquare className="h-3 w-3" />
                                    {bug._count.comments}
                                  </span>
                                )}
                                {bug.assignee && (
                                  <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px] font-medium">
                                    {getInitials(bug.assignee.name)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
