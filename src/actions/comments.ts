"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { commentSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createComment(bugId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const parsed = commentSchema.safeParse({
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.comment.create({
    data: {
      bugId,
      authorId: session.user.id,
      body: parsed.data.body,
    },
  });

  await prisma.activity.create({
    data: {
      bugId,
      actorId: session.user.id,
      action: "comment",
    },
  });

  const bug = await prisma.bug.findUnique({ where: { id: bugId } });
  if (bug) {
    revalidatePath(`/dashboard/projects/${bug.projectId}/bugs/${bugId}`);
  }

  return { success: true };
}
