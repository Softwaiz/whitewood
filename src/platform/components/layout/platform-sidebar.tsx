"use client";

import { type ReactNode } from "react";
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
import { Toaster } from "~components/ui/sonner";
import { TooltipProvider } from "~components/ui/tooltip";
import { FileText, PenSquare, ShieldCheck, UserRound } from "lucide-react";
import { NavLink } from "~components/nav-link";
import { SidebarToggle } from "./sidebar-toggle";
import { NavigationProgress } from "~components/navigation-progress";
import { useLocation } from "~platform/hooks/useLocation";

type PlatformSidebarUser = {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
}

type PlatformSidebarProps = {
    children: ReactNode;
    organizationLabel: string;
    organizationDescription: string;
    pathname: string;
    user: PlatformSidebarUser | null;
};

export function PlatformSidebar({
    children,
    organizationLabel,
    organizationDescription,
    pathname,
    user,
}: PlatformSidebarProps) {

    const location = useLocation();

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen>
                <NavigationProgress />
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

                <SidebarInset className="min-h-dvh">
                    <div className="pointer-events-none fixed left-4 top-4 z-30 md:hidden">
                        <SidebarToggle mobile className="pointer-events-auto rounded-full border border-border bg-card shadow-sm" />
                    </div>
                    <main className="w-full">
                        {children}
                    </main>
                </SidebarInset>

                <Toaster richColors position="top-right" />
            </SidebarProvider>
        </TooltipProvider>
    );
}
