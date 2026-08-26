import type { Bug, Comment, User, Project, Label, Activity, Attachment, BugLabel } from "@prisma/client";

export type BugWithRelations = Bug & {
  reporter: User;
  assignee: User | null;
  project: Project;
  comments: (Comment & { author: User })[];
  labels: (BugLabel & { label: Label })[];
  activities: (Activity & { actor: User })[];
  attachments: Attachment[];
  _count?: {
    comments: number;
  };
};

export type BugListItem = Bug & {
  reporter: User;
  assignee: User | null;
  labels: (BugLabel & { label: Label })[];
  _count: {
    comments: number;
  };
};

export type ProjectWithCounts = Project & {
  owner: User;
  _count: {
    bugs: number;
  };
  openBugCount?: number;
};

export type CommentWithAuthor = Comment & {
  author: User;
};

export type ActivityWithActor = Activity & {
  actor: User;
};
