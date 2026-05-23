import type { ReactNode } from "react";

type PageTopbarProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
};

export function PageTopbar({ eyebrow, title, description, actions }: PageTopbarProps) {
    return (
        <div className="sticky top-0 z-20 border-b border-neutral-200/80 bg-neutral-100/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="space-y-1">
                    {eyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                            {eyebrow}
                        </p>
                    )}
                    <p className="text-lg font-semibold text-neutral-950">{title}</p>
                    {description && (
                        <p className="text-sm text-neutral-500">{description}</p>
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
