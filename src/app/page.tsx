import Link from "next/link";
import { Bug, ArrowRight, Shield, Zap, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Trace</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Bug tracking,{" "}
            <span className="text-blue-600">modernized.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Trace is a fast, opinionated bug tracker built for modern teams.
            Ditch the 90s-era forms. Ship faster with clarity.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              Start Tracking <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Demo Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Zap className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Optimistic UI updates. Status changes, comments, and assignments feel instant. No page reloads.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Shield className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Enforced Workflows</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Status transitions follow a defined state machine. No more jumping from Open to Closed without review.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <LayoutDashboard className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Kanban + List</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Switch between kanban board and list view. Drag-and-drop bugs between statuses. Use Cmd+K to navigate.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
