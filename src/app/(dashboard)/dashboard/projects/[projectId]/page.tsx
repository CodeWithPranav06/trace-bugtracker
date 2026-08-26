import { getBugs } from "@/actions/bugs";
import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, List, LayoutGrid, ArrowLeft } from "lucide-react";
import { BugTable } from "@/components/bugs/bug-table";

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ status?: string; severity?: string; priority?: string; search?: string; assigneeId?: string }>;
}

export default async function ProjectBugsPage({ params, searchParams }: Props) {
  const { projectId } = await params;
  const filters = await searchParams;
  const project = await getProject(projectId);

  if (!project) notFound();

  const bugs = await getBugs(projectId, filters);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/dashboard/projects"
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Projects
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/projects/${projectId}/board`}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Board View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Link>
          <Link
            href={`/dashboard/projects/${projectId}/bugs/new`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            <Plus className="h-4 w-4" />
            New Bug
          </Link>
        </div>
      </div>

      <BugTable bugs={bugs} projectId={projectId} filters={filters} />
    </div>
  );
}
