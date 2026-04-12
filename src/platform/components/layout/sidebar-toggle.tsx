"use client";

import { ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { Button } from "~components/ui/button";
import { useSidebar } from "~components/ui/sidebar";

type SidebarToggleProps = {
    className?: string;
    mobile?: boolean;
};

export function SidebarToggle({ className, mobile = false }: SidebarToggleProps) {
    const { state, toggleSidebar } = useSidebar();

    if (mobile) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={className}
                onClick={toggleSidebar}
            >
                <PanelLeft className="size-4" />
                <span className="sr-only">Open navigation</span>
            </Button>
        );
    }

    const isExpanded = state === "expanded";

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={className}
            onClick={toggleSidebar}
        >
            {isExpanded ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            <span className="sr-only">{isExpanded ? "Collapse sidebar" : "Expand sidebar"}</span>
        </Button>
    );
}
