"use client";

import type React from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import { navigate } from "rwsdk/client";

type NavLinkProps = React.ComponentProps<"a"> & {
    pendingClassName?: string;
    onPendingChange?: (pending: boolean) => void;
    forceReload?: boolean;
    fallbackDelayMs?: number;
};

function joinClassName(...values: Array<string | undefined>) {
    return values.filter(Boolean).join(" ");
}

export function NavLink({
    href = "#",
    onClick,
    target,
    className,
    pendingClassName,
    onPendingChange,
    forceReload = false,
    fallbackDelayMs = 1200,
    ...props
}: NavLinkProps) {
    const [isPending, setIsPending] = useState(false);
    const [isTransitioning, startTransition] = useTransition();
    const pendingHrefRef = useRef<string | null>(null);
    const fallbackTimerRef = useRef<number | null>(null);

    useEffect(() => {
        onPendingChange?.(isPending);
    }, [isPending, onPendingChange]);

    useEffect(() => {
        if (!isPending) {
            if (fallbackTimerRef.current) {
                window.clearTimeout(fallbackTimerRef.current);
                fallbackTimerRef.current = null;
            }
            return;
        }

        let rafId = 0;
        const pendingHref = pendingHrefRef.current;
        const deadline = Date.now() + 12000;

        if (pendingHref) {
            fallbackTimerRef.current = window.setTimeout(() => {
                const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
                if (currentPath !== pendingHref) {
                    window.location.href = pendingHref;
                }
            }, fallbackDelayMs);
        }

        const check = () => {
            if (!pendingHref) {
                setIsPending(false);
                return;
            }

            const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

            if (currentPath === pendingHref || Date.now() > deadline) {
                setIsPending(false);
                pendingHrefRef.current = null;
                return;
            }

            rafId = window.requestAnimationFrame(check);
        };

        rafId = window.requestAnimationFrame(check);

        return () => {
            window.cancelAnimationFrame(rafId);
            if (fallbackTimerRef.current) {
                window.clearTimeout(fallbackTimerRef.current);
                fallbackTimerRef.current = null;
            }
        };
    }, [isPending]);

    return (
        <a
            href={href}
            target={target}
            onClick={(event) => {
                onClick?.(event);

                if (
                    target === "_blank" ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return;
                }

                if (href.includes("#")) {
                    return;
                }

                const url = new URL(href, window.location.origin);

                if (url.origin !== window.location.origin) {
                    return;
                }

                const nextPath = `${url.pathname}${url.search}${url.hash}`;
                const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

                if (nextPath === currentPath) {
                    return;
                }

                pendingHrefRef.current = nextPath;
                setIsPending(true);

                if (forceReload) {
                    event.preventDefault();
                    window.location.href = nextPath;
                    return;
                }

                if (!event.defaultPrevented) {
                    event.preventDefault();
                    startTransition(() => {
                        void navigate(nextPath);
                    });
                }
            }}
            aria-busy={isPending || undefined}
            data-pending={isPending ? "true" : undefined}
            className={joinClassName(className, isPending ? pendingClassName : undefined)}
            {...props}
        />
    );
}
