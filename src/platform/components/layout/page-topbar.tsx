import type { ReactNode } from "react";

type PageTopbarProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
};

export function PageTopbar({ eyebrow, title, description, actions }: PageTopbarProps) {
    return (
        <div className="sticky top-0 z-20 border-b border-border/50 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                <div className="space-y-1">
                    {eyebrow && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                            {eyebrow}
                        </p>
                    )}
                    <p className="text-xl font-semibold tracking-tight text-foreground">{title}</p>
                    {description && (
                        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-wrap items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
