import {
  LayoutDashboard, Users, Building2, ClipboardCheck, HeartHandshake,
  GraduationCap, MessageSquareText, BarChart3, Bell, Settings, type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "hr" | "committee_leader" | "member";

export type Permission =
  | "dashboard.view" | "members.view" | "committees.view" | "evaluations.view"
  | "followup.view" | "development.view" | "surveys.view" | "reports.view"
  | "notifications.view" | "settings.view";

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "dashboard.view", "members.view", "committees.view", "evaluations.view", "followup.view",
    "development.view", "surveys.view", "reports.view", "notifications.view", "settings.view",
  ],
  hr: [
    "dashboard.view", "members.view", "committees.view", "evaluations.view", "followup.view",
    "development.view", "surveys.view", "reports.view", "notifications.view",
  ],
  committee_leader: [
    "dashboard.view", "members.view", "committees.view", "evaluations.view",
    "development.view", "notifications.view",
  ],
  member: ["dashboard.view", "development.view", "surveys.view", "notifications.view"],
};

export interface NavItem { title: string; to: string; icon: LucideIcon; permission: Permission }

export const navItems: NavItem[] = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard, permission: "dashboard.view" },
  { title: "Members", to: "/members", icon: Users, permission: "members.view" },
  { title: "Committees", to: "/committees", icon: Building2, permission: "committees.view" },
  { title: "Task Evaluations", to: "/evaluations", icon: ClipboardCheck, permission: "evaluations.view" },
  { title: "HR Follow-up", to: "/follow-up", icon: HeartHandshake, permission: "followup.view" },
  { title: "Development Tasks", to: "/development", icon: GraduationCap, permission: "development.view" },
  { title: "Improvement Surveys", to: "/surveys", icon: MessageSquareText, permission: "surveys.view" },
  { title: "Reports & Analytics", to: "/reports", icon: BarChart3, permission: "reports.view" },
  { title: "Notifications", to: "/notifications", icon: Bell, permission: "notifications.view" },
  { title: "Settings", to: "/settings", icon: Settings, permission: "settings.view" },
];

/**
 * Until sign-in exists, the shell previews the admin view.
 * Replace with the signed-in user's role from the database later.
 */
export const PREVIEW_ROLE: Role = "admin";

export function visibleNav(role: Role) {
  const allowed = new Set(rolePermissions[role]);
  return navItems.filter((i) => allowed.has(i.permission));
}

/** Eight SBS committees — official names to be supplied. */
export const committees = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Committee ${i + 1}`,
  pendingName: true,
}));
