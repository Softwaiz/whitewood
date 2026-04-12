"use client";

import type React from "react";
import { navigate } from "rwsdk/client";

type NavLinkProps = React.ComponentProps<"a">;

export function NavLink({ href = "#", onClick, target, ...props }: NavLinkProps) {
    return (
        <a
            href={href}
            target={target}
            onClick={(event) => {
                onClick?.(event);

                if (
                    event.defaultPrevented ||
                    target === "_blank" ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return;
                }

                const url = new URL(href, window.location.origin);

                if (url.origin !== window.location.origin) {
                    return;
                }

                event.preventDefault();
                navigate(`${url.pathname}${url.search}${url.hash}`);
            }}
            {...props}
        />
    );
}
