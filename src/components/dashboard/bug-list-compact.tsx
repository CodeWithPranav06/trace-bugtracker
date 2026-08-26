import Link from "next/link";
import { STATUS_COLORS, SEVERITY_COLORS, PRIORITY_LABELS } from "@/lib/workflow";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

interface BugListCompactProps {
  bugs: Array<{
    id: string;
    title: string;
    status: string;
    severity: string;
    priority: string;
    createdAt: Date;
    projectId: string;
    project?: { name: string } | null;
    assignee?: { name: string } | null;
  }>;
  showProject?: boolean;
}

export function BugListCompact({ bugs, showProject }: BugListCompactProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      {bugs.map((bug) => (
        <Link
          key={bug.id}
          href={`/dashboard/projects/${bug.projectId}/bugs/${bug.id}`}
          className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{bug.title}</p>
              <div className="flex items-center gap-2 mt-1">
                {showProject && bug.project && (
                  <span className="text-xs text-gray-500">{bug.project.name}</span>
                )}
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", STATUS_COLORS[bug.status])}>
                  {bug.status}
                </span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", SEVERITY_COLORS[bug.severity])}>
                  {bug.severity}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {timeAgo(bug.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
