"use client";

import { useState } from "react";
import { updateBugStatus } from "@/actions/bugs";
import { getValidTransitions, STATUS_COLORS } from "@/lib/workflow";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatusChangerProps {
  bugId: string;
  currentStatus: string;
  isAdmin: boolean;
}

export function StatusChanger({ bugId, currentStatus, isAdmin }: StatusChangerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validTransitions = getValidTransitions(currentStatus, isAdmin);

  async function handleChange(newStatus: string) {
    setLoading(true);
    setOpen(false);
    const result = await updateBugStatus(bugId, newStatus);
    if (result?.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading || validTransitions.length === 0}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition",
          STATUS_COLORS[currentStatus]
        )}
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        {currentStatus}
        {validTransitions.length > 0 && <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg py-1">
            {validTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleChange(status)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
              >
                <span className={cn("w-2 h-2 rounded-full", STATUS_COLORS[status].split(" ")[0])} />
                {status}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
