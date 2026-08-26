"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bugSchema } from "@/lib/validations";
import { isValidTransition } from "@/lib/workflow";
import { revalidatePath } from "next/cache";

export async function createBug(projectId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const labelIds = formData.getAll("labelIds") as string[];

  const parsed = bugSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    severity: formData.get("severity"),
    priority: formData.get("priority"),
    assigneeId: formData.get("assigneeId") || null,
    labelIds,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const bug = await prisma.bug.create({
    data: {
      projectId,
      title: parsed.data.title,
      description: parsed.data.description,
      severity: parsed.data.severity,
      priority: parsed.data.priority,
      reporterId: session.user.id,
      assigneeId: parsed.data.assigneeId,
      labels: {
        create: parsed.data.labelIds.map((labelId) => ({ labelId })),
      },
    },
  });

  // Create activity
  await prisma.activity.create({
    data: {
      bugId: bug.id,
      actorId: session.user.id,
      action: "created",
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true, bugId: bug.id };
}

export async function getBugs(projectId: string, filters?: {
  status?: string;
  severity?: string;
  priority?: string;
  assigneeId?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = { projectId };

  if (filters?.status) where.status = filters.status;
  if (filters?.severity) where.severity = filters.severity;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  return prisma.bug.findMany({
    where,
    include: {
      reporter: true,
      assignee: true,
      labels: { include: { label: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBug(bugId: string) {
  return prisma.bug.findUnique({
    where: { id: bugId },
    include: {
      reporter: true,
      assignee: true,
      project: true,
      labels: { include: { label: true } },
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      activities: {
        include: { actor: true },
        orderBy: { createdAt: "asc" },
      },
      attachments: true,
    },
  });
}

export async function updateBugStatus(bugId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const bug = await prisma.bug.findUnique({ where: { id: bugId } });
  if (!bug) return { error: "Bug not found" };

  const isAdmin = session.user.role === "admin";
  if (!isValidTransition(bug.status, newStatus, isAdmin)) {
    return { error: `Cannot transition from ${bug.status} to ${newStatus}` };
  }

  await prisma.bug.update({
    where: { id: bugId },
    data: { status: newStatus },
  });

  await prisma.activity.create({
    data: {
      bugId,
      actorId: session.user.id,
      action: "status_change",
      field: "status",
      oldValue: bug.status,
      newValue: newStatus,
    },
  });

  revalidatePath(`/dashboard/projects/${bug.projectId}`);
  revalidatePath(`/dashboard/projects/${bug.projectId}/bugs/${bugId}`);
  return { success: true };
}

export async function updateBugAssignee(bugId: string, assigneeId: string | null) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const bug = await prisma.bug.findUnique({ where: { id: bugId } });
  if (!bug) return { error: "Bug not found" };

  await prisma.bug.update({
    where: { id: bugId },
    data: { assigneeId },
  });

  const assignee = assigneeId
    ? await prisma.user.findUnique({ where: { id: assigneeId } })
    : null;
  const oldAssignee = bug.assigneeId
    ? await prisma.user.findUnique({ where: { id: bug.assigneeId } })
    : null;

  await prisma.activity.create({
    data: {
      bugId,
      actorId: session.user.id,
      action: "assignment",
      field: "assignee",
      oldValue: oldAssignee?.name || "Unassigned",
      newValue: assignee?.name || "Unassigned",
    },
  });

  revalidatePath(`/dashboard/projects/${bug.projectId}`);
  revalidatePath(`/dashboard/projects/${bug.projectId}/bugs/${bugId}`);
  return { success: true };
}

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
}

export async function getLabels() {
  return prisma.label.findMany({ orderBy: { name: "asc" } });
}
