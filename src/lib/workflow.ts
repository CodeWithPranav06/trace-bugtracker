export const STATUSES = [
  "Open",
  "In Progress",
  "In Review",
  "Resolved",
  "Closed",
  "Reopened",
] as const;

export type Status = (typeof STATUSES)[number];

export const SEVERITIES = ["Critical", "Major", "Minor", "Trivial"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const PRIORITIES = ["P0", "P1", "P2", "P3"] as const;
export type Priority = (typeof PRIORITIES)[number];

// Valid transitions map: status -> list of statuses it can transition to
const VALID_TRANSITIONS: Record<Status, Status[]> = {
  Open: ["In Progress"],
  "In Progress": ["In Review", "Open"],
  "In Review": ["Resolved", "In Progress"],
  Resolved: ["Closed", "Reopened"],
  Closed: ["Reopened"],
  Reopened: ["Open", "In Progress"],
};

export function getValidTransitions(
  currentStatus: string,
  isAdmin: boolean = false
): Status[] {
  if (isAdmin) {
    return STATUSES.filter((s) => s !== currentStatus);
  }
  return VALID_TRANSITIONS[currentStatus as Status] || [];
}

export function isValidTransition(
  from: string,
  to: string,
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;
  const valid = VALID_TRANSITIONS[from as Status];
  if (!valid) return false;
  return valid.includes(to as Status);
}

// UI helpers
export const STATUS_COLORS: Record<string, string> = {
  Open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "In Progress":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "In Review":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Resolved:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  Reopened: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Major:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Minor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Trivial: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export const PRIORITY_COLORS: Record<string, string> = {
  P0: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  P1: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  P2: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  P3: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export const PRIORITY_LABELS: Record<string, string> = {
  P0: "P0 (Urgent)",
  P1: "P1 (High)",
  P2: "P2 (Medium)",
  P3: "P3 (Low)",
};
