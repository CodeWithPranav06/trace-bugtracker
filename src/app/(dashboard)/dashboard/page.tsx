import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { BugChart } from "@/components/dashboard/bug-chart";
import { BugListCompact } from "@/components/dashboard/bug-list-compact";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Stats
  const [totalOpen, criticalCount, assignedToMe, reportedByMe] = await Promise.all([
    prisma.bug.count({ where: { status: { not: "Closed" } } }),
    prisma.bug.count({ where: { severity: "Critical", status: { not: "Closed" } } }),
    prisma.bug.count({ where: { assigneeId: userId, status: { not: "Closed" } } }),
    prisma.bug.count({ where: { reporterId: userId } }),
  ]);

  // My assigned bugs
  const myBugs = await prisma.bug.findMany({
    where: { assigneeId: userId, status: { notIn: ["Closed", "Resolved"] } },
    include: {
      project: true,
      labels: { include: { label: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  // Reported by me
  const myReports = await prisma.bug.findMany({
    where: { reporterId: userId },
    include: {
      project: true,
      assignee: true,
      labels: { include: { label: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Chart data — bugs created per day for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentBugs = await prisma.bug.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, status: true },
  });

  const resolvedBugs = await prisma.activity.findMany({
    where: {
      action: "status_change",
      newValue: { in: ["Resolved", "Closed"] },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true },
  });

  // Group by day
  const chartData: { date: string; opened: number; resolved: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const opened = recentBugs.filter(
      (b) => b.createdAt.toISOString().split("T")[0] === dateStr
    ).length;
    const resolved = resolvedBugs.filter(
      (b) => b.createdAt.toISOString().split("T")[0] === dateStr
    ).length;
    chartData.push({ date: dateStr, opened, resolved });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {session.user.name}
        </p>
      </div>

      <StatsCards
        totalOpen={totalOpen}
        criticalCount={criticalCount}
        assignedToMe={assignedToMe}
        reportedByMe={reportedByMe}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <BugChart data={chartData} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Bugs</h2>
            <span className="text-sm text-gray-500">{myBugs.length} active</span>
          </div>
          {myBugs.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-500">
              <p className="text-sm">No bugs assigned to you. 🎉</p>
            </div>
          ) : (
            <BugListCompact bugs={myBugs} showProject />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Reported by Me</h2>
            <span className="text-sm text-gray-500">{myReports.length} total</span>
          </div>
          {myReports.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-500">
              <p className="text-sm">You haven&apos;t reported any bugs yet.</p>
            </div>
          ) : (
            <BugListCompact bugs={myReports} showProject />
          )}
        </div>
      </div>
    </div>
  );
}
