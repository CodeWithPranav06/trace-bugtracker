"use client";

import { useState } from "react";
import { createComment } from "@/actions/comments";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  bugId: string;
}

export function CommentForm({ bugId }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.set("body", body);

    const result = await createComment(bugId, formData);

    if (result?.success) {
      setBody("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment... (Markdown supported)"
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y text-sm font-mono"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Comment
        </button>
      </div>
    </form>
  );
}
