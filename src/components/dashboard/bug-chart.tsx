"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BugChartProps {
  data: { date: string; opened: number; resolved: number }[];
}

export function BugChart({ data }: BugChartProps) {
  // Show only every 5th label to avoid crowding
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Bugs Opened vs Resolved (Last 30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              interval={4}
            />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              labelFormatter={(value) => formatDate(String(value))}
              contentStyle={{
                backgroundColor: "var(--color-gray-900, #111827)",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="opened" fill="#3b82f6" name="Opened" radius={[2, 2, 0, 0]} />
            <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
