import { getProject } from "@/actions/projects";
import { getUsers, getLabels } from "@/actions/bugs";
import { notFound } from "next/navigation";
import { BugForm } from "@/components/bugs/bug-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function NewBugPage({ params }: Props) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const [users, labels] = await Promise.all([getUsers(), getLabels()]);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {project.name}
      </Link>

      <h1 className="text-2xl font-bold mb-6">Report a Bug</h1>

      <BugForm projectId={projectId} users={users} labels={labels} />
    </div>
  );
}
