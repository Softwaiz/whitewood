"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import { User } from "~db/schema";

const IdentityContext = createContext<{ user: User }>(undefined as any);


export function useIdentity() {
    const value = useContext(IdentityContext);

    if (!value) {
        throw new Error("useIdentity must be used within an IdentityProvider");
    }
    return value;
}


export function IdentityProvider(props: PropsWithChildren<{ user: User }>) {
    return <IdentityContext.Provider value={{ user: props.user }}>
        {props.children}
    </IdentityContext.Provider>
}