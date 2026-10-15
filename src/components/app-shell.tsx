import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Search, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { PREVIEW_ROLE, visibleNav } from "@/lib/nav";
import logo from "@/assets/sbs-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {visibleNav(PREVIEW_ROLE).map((item) => {
        const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-6 py-5">
      <img src={logo.url} alt="SBS — شباب بتساعد شباب" className="h-11 w-11 rounded-lg object-contain" />
      <div>
        <p className="text-sm font-semibold text-sidebar-foreground">SBS HR</p>
        <p className="text-xs text-mint-foreground" lang="ar" dir="rtl">شباب بتساعد شباب</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = visibleNav(PREVIEW_ROLE).find((i) => (i.to === "/" ? path === "/" : path.startsWith(i.to)));

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <NavList />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-sidebar shadow-elevated">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="truncate text-base font-semibold">{current?.title ?? "SBS HR"}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground md:flex" title="Search becomes available once member data is connected">
              <Search className="h-4 w-4" />
              <input disabled placeholder="Search (coming soon)" className="w-48 bg-transparent outline-none disabled:cursor-not-allowed" />
            </div>
            <Link to="/notifications" aria-label="Notifications" className="rounded-md p-2 text-muted-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 rounded-lg px-2 py-1" title="Preview mode — sign-in not yet enabled">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">PV</div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium leading-tight">Preview user</p>
                <p className="text-[11px] capitalize leading-tight text-muted-foreground">{PREVIEW_ROLE} view</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
