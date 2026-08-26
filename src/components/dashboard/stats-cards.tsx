import { AlertTriangle, Bug, UserCheck, FileText } from "lucide-react";

interface StatsCardsProps {
  totalOpen: number;
  criticalCount: number;
  assignedToMe: number;
  reportedByMe: number;
}

export function StatsCards({ totalOpen, criticalCount, assignedToMe, reportedByMe }: StatsCardsProps) {
  const stats = [
    {
      label: "Open Bugs",
      value: totalOpen,
      icon: Bug,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Critical",
      value: criticalCount,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    },
    {
      label: "Assigned to Me",
      value: assignedToMe,
      icon: UserCheck,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Reported by Me",
      value: reportedByMe,
      icon: FileText,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
