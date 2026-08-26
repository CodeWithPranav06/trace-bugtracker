"use client";

import { useState } from "react";
import { updateBugAssignee } from "@/actions/bugs";
import { getInitials } from "@/lib/utils";
import { ChevronDown, Loader2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssigneePickerProps {
  bugId: string;
  currentAssigneeId: string | null;
  users: { id: string; name: string; email: string; role: string }[];
}

export function AssigneePicker({ bugId, currentAssigneeId, users }: AssigneePickerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const currentAssignee = users.find((u) => u.id === currentAssigneeId);
  const assignableUsers = users.filter((u) => u.role !== "reporter");

  async function handleSelect(userId: string | null) {
    setLoading(true);
    setOpen(false);
    await updateBugAssignee(bugId, userId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="relative mt-1">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
      >
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : currentAssignee ? (
            <>
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-medium">
                {getInitials(currentAssignee.name)}
              </div>
              <span>{currentAssignee.name}</span>
            </>
          ) : (
            <>
              <UserX className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Unassigned</span>
            </>
          )}
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg py-1">
            <button
              onClick={() => handleSelect(null)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 text-gray-400"
            >
              <UserX className="h-4 w-4" />
              Unassigned
            </button>
            {assignableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
              >
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px] font-medium">
                  {getInitials(user.name)}
                </div>
                <span>{user.name}</span>
                <span className="text-xs text-gray-400">({user.role})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
