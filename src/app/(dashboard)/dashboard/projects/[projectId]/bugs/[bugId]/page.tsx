import { getBug, getUsers } from "@/actions/bugs";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { cn, timeAgo, formatDateTime, getInitials } from "@/lib/utils";
import { STATUS_COLORS, SEVERITY_COLORS, PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/workflow";
import { CommentThread } from "@/components/comments/comment-thread";
import { CommentForm } from "@/components/comments/comment-form";
import { StatusChanger } from "@/components/bugs/status-changer";
import { AssigneePicker } from "@/components/bugs/assignee-picker";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { ActivityTimeline } from "@/components/bugs/activity-timeline";

interface Props {
  params: Promise<{ projectId: string; bugId: string }>;
}

export default async function BugDetailPage({ params }: Props) {
  const { projectId, bugId } = await params;
  const [bug, session, users] = await Promise.all([
    getBug(bugId),
    auth(),
    getUsers(),
  ]);

  if (!bug) notFound();

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {bug.project.name}
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-xl font-bold">{bug.title}</h1>
              <StatusChanger
                bugId={bug.id}
                currentStatus={bug.status}
                isAdmin={isAdmin}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-6">
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium", SEVERITY_COLORS[bug.severity])}>
                {bug.severity}
              </span>
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium", PRIORITY_COLORS[bug.priority])}>
                {PRIORITY_LABELS[bug.priority]}
              </span>
              {bug.labels.map(({ label }) => (
                <span
                  key={label.id}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{ borderColor: label.color, color: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>

            {bug.description ? (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <MarkdownRenderer content={bug.description} />
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No description provided.</p>
            )}
          </div>

          {/* Comments */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Comments ({bug.comments.length})
            </h2>
            <CommentThread comments={bug.comments} />
            <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
              <CommentForm bugId={bug.id} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Assignee</label>
              <AssigneePicker
                bugId={bug.id}
                currentAssigneeId={bug.assigneeId}
                users={users}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Reporter</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-medium">
                  {getInitials(bug.reporter.name)}
                </div>
                <span className="text-sm">{bug.reporter.name}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Created</label>
              <p className="text-sm mt-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                {formatDateTime(bug.createdAt)}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Updated</label>
              <p className="text-sm mt-1 text-gray-500">{timeAgo(bug.updatedAt)}</p>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="text-sm font-semibold mb-3">Activity</h3>
            <ActivityTimeline activities={bug.activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
