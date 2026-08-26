"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn, timeAgo, getInitials } from "@/lib/utils";
import { STATUS_COLORS, SEVERITY_COLORS, PRIORITY_COLORS, PRIORITY_LABELS, STATUSES, SEVERITIES, PRIORITIES } from "@/lib/workflow";
import { MessageSquare, Search, X } from "lucide-react";
import { useState } from "react";

interface Bug {
  id: string;
  title: string;
  status: string;
  severity: string;
  priority: string;
  createdAt: Date;
  projectId: string;
  reporter: { name: string };
  assignee: { name: string } | null;
  labels: { label: { id: string; name: string; color: string } }[];
  _count: { comments: number };
}

interface BugTableProps {
  bugs: Bug[];
  projectId: string;
  filters: {
    status?: string;
    severity?: string;
    priority?: string;
    search?: string;
    assigneeId?: string;
  };
}

export function BugTable({ bugs, projectId, filters }: BugTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(filters.search || "");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    const newFilters = { ...filters, [key]: value };
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
    setSearch("");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search);
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bugs..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </form>

          <select
            value={filters.status || ""}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.severity || ""}
            onChange={(e) => updateFilter("severity", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All Severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.priority || ""}
            onChange={(e) => updateFilter("priority", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bug list */}
      {bugs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {hasFilters ? "No bugs match your filters." : "No bugs reported yet. Create the first one!"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Bug</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Assignee</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {bugs.map((bug) => (
                  <tr key={bug.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/projects/${projectId}/bugs/${bug.id}`}
                        className="block"
                      >
                        <p className="text-sm font-medium hover:text-blue-600 transition">
                          {bug.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {bug.labels.map(({ label }) => (
                            <span
                              key={label.id}
                              className="text-xs px-1.5 py-0.5 rounded-full border"
                              style={{ borderColor: label.color, color: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                          {bug._count.comments > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MessageSquare className="h-3 w-3" />
                              {bug._count.comments}
                            </span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", STATUS_COLORS[bug.status])}>
                        {bug.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", SEVERITY_COLORS[bug.severity])}>
                        {bug.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", PRIORITY_COLORS[bug.priority])}>
                        {PRIORITY_LABELS[bug.priority]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {bug.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-medium">
                            {getInitials(bug.assignee.name)}
                          </div>
                          <span className="text-sm">{bug.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {timeAgo(bug.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500">
            {bugs.length} bug{bugs.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
