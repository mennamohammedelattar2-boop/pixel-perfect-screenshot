import {
  LayoutDashboard, Users, Building2, ClipboardCheck, HeartHandshake,
  GraduationCap, MessageSquareText, BarChart3, Bell, Settings, type LucideIcon,
} from "lucide-react";
import type { AppRole } from "@/lib/auth";

export type Permission =
  | "dashboard.view" | "members.view" | "committees.view" | "evaluations.view"
  | "followup.view" | "development.view" | "surveys.view" | "reports.view"
  | "notifications.view" | "settings.view";

/**
 * Controls which menu items are shown. This is a convenience only —
 * actual data access is enforced by the database access rules.
 */
export const rolePermissions: Record<AppRole, Permission[]> = {
  system_admin: ["dashboard.view", "committees.view", "notifications.view", "settings.view"],
  head_hr: [
    "dashboard.view", "members.view", "committees.view", "evaluations.view", "followup.view",
    "development.view", "surveys.view", "reports.view", "notifications.view", "settings.view",
  ],
  vice_head_hr: [
    "dashboard.view", "members.view", "committees.view", "evaluations.view", "followup.view",
    "development.view", "surveys.view", "reports.view", "notifications.view",
  ],
  hr_member: [
    "dashboard.view", "members.view", "committees.view", "followup.view",
    "development.view", "surveys.view", "notifications.view",
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

export function visibleNav(roles: AppRole[]) {
  const allowed = new Set(roles.flatMap((r) => rolePermissions[r]));
  return navItems.filter((i) => allowed.has(i.permission));
}
