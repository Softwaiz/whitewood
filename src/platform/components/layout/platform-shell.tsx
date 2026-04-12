import type { LayoutProps } from "rwsdk/router";
import { eq } from "drizzle-orm";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from "~components/ui/sidebar";
import { db } from "~db/db";
import { organizations } from "~db/schema";
import { Toaster } from "~components/ui/sonner";
import { TooltipProvider } from "~components/ui/tooltip";
import { FileText, PenSquare, ShieldCheck, UserRound } from "lucide-react";
import { NavLink } from "~components/nav-link";
import { SidebarToggle } from "./sidebar-toggle";

export async function PlatformShell({ children, requestInfo }: LayoutProps) {
    const user = requestInfo?.ctx.user;
    const pathname = requestInfo?.request ? new URL(requestInfo.request.url).pathname : "";
    const [organization] = user?.organizationId
        ? await db
            .select({
                label: organizations.label,
                description: organizations.description,
            })
            .from(organizations)
            .where(eq(organizations.id, user.organizationId))
            .limit(1)
            .execute()
        : [];
    const organizationLabel = organization?.label || "Whitewood";
    const organizationDescription = organization?.description || "Publishing platform";

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen>
                <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border/70">
                <SidebarContent>
                    <SidebarGroup className="pt-4">
                        <div className="flex items-start justify-between gap-2 px-2 pb-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
                            <NavLink href="/platform/articles" className="block">
                                <p className="font-heading text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                                    {organizationLabel}
                                </p>
                                <p className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                                    {organizationDescription}
                                </p>
                                <div className="hidden size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:flex">
                                    <FileText className="size-4" />
                                </div>
                            </NavLink>
                            <SidebarToggle className="rounded-full border border-sidebar-border bg-sidebar" />
                        </div>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === "/platform/articles" || pathname === "/platform"}
                                        tooltip="Articles"
                                    >
                                        <NavLink href="/platform/articles">
                                            <FileText />
                                            <span>Articles</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === "/platform/content/new"}
                                        tooltip="Compose"
                                    >
                                        <NavLink href="/platform/content/new">
                                            <PenSquare />
                                            <span>Compose</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith("/platform/users")}
                                        tooltip="Users"
                                    >
                                        <NavLink href="/platform/users">
                                            <UserRound />
                                            <span>Users</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-sidebar-border/70 p-3">
                    <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 px-3 py-3 text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                            <ShieldCheck className="size-4" />
                        </div>
                        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                            <p className="truncate text-sm font-medium">
                                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                            </p>
                            <p className="truncate text-xs text-sidebar-foreground/70">
                                {user?.email || "No active session"}
                            </p>
                            {user?.role && (
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55">
                                    {user.role}
                                </p>
                            )}
                        </div>
                    </div>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

                <SidebarInset className="min-h-dvh bg-neutral-100">
                    <div className="sticky top-0 z-20 border-b border-neutral-200/80 bg-neutral-100/90 backdrop-blur">
                        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
                        <div className="flex items-center gap-3">
                                <SidebarToggle mobile className="rounded-full border border-neutral-200 bg-white md:hidden" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-950">{organizationLabel}</p>
                                    <p className="text-xs text-neutral-500">
                                        {organizationDescription}
                                    </p>
                                </div>
                            </div>

                            <NavLink
                                href="/platform/content/new"
                                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                            >
                                New article
                            </NavLink>
                        </div>
                    </div>

                    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
                        {children}
                    </main>
                </SidebarInset>

                <Toaster richColors position="top-right" />
            </SidebarProvider>
        </TooltipProvider>
    );
}
