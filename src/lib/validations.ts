import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["reporter", "developer", "admin"]).default("reporter"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).default(""),
});

export const bugSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().default(""),
  severity: z.enum(["Critical", "Major", "Minor", "Trivial"]).default("Minor"),
  priority: z.enum(["P0", "P1", "P2", "P3"]).default("P2"),
  assigneeId: z.string().optional().nullable(),
  labelIds: z.array(z.string()).default([]),
});

export const commentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty"),
});

export const statusChangeSchema = z.object({
  status: z.enum([
    "Open",
    "In Progress",
    "In Review",
    "Resolved",
    "Closed",
    "Reopened",
  ]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type BugInput = z.infer<typeof bugSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type StatusChangeInput = z.infer<typeof statusChangeSchema>;
