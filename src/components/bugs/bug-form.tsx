"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBug } from "@/actions/bugs";
import { SEVERITIES, PRIORITIES, PRIORITY_LABELS } from "@/lib/workflow";
import { Loader2 } from "lucide-react";

interface BugFormProps {
  projectId: string;
  users: { id: string; name: string; email: string; role: string }[];
  labels: { id: string; name: string; color: string }[];
}

export function BugForm({ projectId, users, labels }: BugFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const router = useRouter();

  function toggleLabel(labelId: string) {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // Add selected labels
    selectedLabels.forEach((id) => formData.append("labelIds", id));

    const result = await createBug(projectId, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success && result?.bugId) {
      router.push(`/dashboard/projects/${projectId}/bugs/${result.bugId}`);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1.5">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Brief description of the bug"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1.5">
            Description <span className="text-gray-400 font-normal">(Markdown supported)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y font-mono text-sm"
            placeholder="## Steps to Reproduce&#10;1. ...&#10;&#10;## Expected Behavior&#10;...&#10;&#10;## Actual Behavior&#10;..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="severity" className="block text-sm font-medium mb-1.5">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1.5">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium mb-1.5">
            Assignee
          </label>
          <select
            id="assigneeId"
            name="assigneeId"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="">Unassigned</option>
            {users
              .filter((u) => u.role !== "reporter")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Labels</label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleLabel(label.id)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedLabels.includes(label.id)
                    ? "bg-opacity-20 border-current"
                    : "border-gray-300 dark:border-gray-700 hover:border-current"
                }`}
                style={{
                  color: label.color,
                  backgroundColor: selectedLabels.includes(label.id)
                    ? `${label.color}20`
                    : undefined,
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit Bug Report
        </button>
      </form>
    </div>
  );
}
