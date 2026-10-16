import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLE_LABELS: Record<AppRole, string> = {
  system_admin: "System Administrator",
  head_hr: "Head HR",
  vice_head_hr: "Vice Head HR",
  hr_member: "HR Member",
  committee_leader: "Committee Leader",
  member: "Member",
};

export interface CurrentUser {
  id: string;
  email: string | null;
  fullName: string | null;
  roles: AppRole[];
}

/** Roles are read from the server-protected user_roles table — never from client metadata. */
export const currentUserQuery = queryOptions({
  queryKey: ["current-user"],
  queryFn: async (): Promise<CurrentUser | null> => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return null;
    const [{ data: roles, error: rErr }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    ]);
    if (rErr) throw rErr;
    return {
      id: user.id,
      email: user.email ?? null,
      fullName: profile?.full_name ?? null,
      roles: (roles ?? []).map((r) => r.role),
    };
  },
  staleTime: 60_000,
});

export function useCurrentUser() {
  return useQuery(currentUserQuery);
}

export function primaryRole(roles: AppRole[]): AppRole {
  const order: AppRole[] = ["system_admin", "head_hr", "vice_head_hr", "hr_member", "committee_leader", "member"];
  return order.find((r) => roles.includes(r)) ?? "member";
}
