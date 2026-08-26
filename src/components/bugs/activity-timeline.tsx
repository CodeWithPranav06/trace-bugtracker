import { timeAgo } from "@/lib/utils";
import { ArrowRight, MessageSquare, Plus, UserCheck, Tag } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: Date;
  actor: { name: string };
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  created: Plus,
  status_change: ArrowRight,
  comment: MessageSquare,
  assignment: UserCheck,
  label_change: Tag,
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return <p className="text-xs text-gray-400">No activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = ACTION_ICONS[activity.action] || ArrowRight;
        return (
          <div key={activity.id} className="flex gap-2 text-xs">
            <div className="mt-0.5">
              <Icon className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium">{activity.actor.name}</span>{" "}
              {activity.action === "created" && (
                <span className="text-gray-500">created this bug</span>
              )}
              {activity.action === "status_change" && (
                <span className="text-gray-500">
                  changed status from{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{activity.oldValue}</span>
                  {" "}→{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{activity.newValue}</span>
                </span>
              )}
              {activity.action === "assignment" && (
                <span className="text-gray-500">
                  changed assignee to{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{activity.newValue}</span>
                </span>
              )}
              {activity.action === "comment" && (
                <span className="text-gray-500">added a comment</span>
              )}
              <p className="text-gray-400 mt-0.5">{timeAgo(activity.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
