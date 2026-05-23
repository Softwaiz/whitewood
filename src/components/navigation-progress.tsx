"use client";

import { useEffect, useState } from "react";
import { subscribeNavigation } from "./navigation-events";

export function NavigationProgress() {
    const [pending, setPending] = useState(false);

    useEffect(() => {
        return subscribeNavigation(setPending);
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5 overflow-hidden"
        >
            <div
                className={`h-full bg-neutral-900 transition-opacity duration-200 ${pending ? "opacity-100" : "opacity-0"}`}
            >
                <div className="h-full w-1/2 animate-[navigation-progress_1.1s_ease-in-out_infinite]" />
            </div>
        </div>
    );
}
