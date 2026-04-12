import type { LayoutProps } from "rwsdk/router";
import { PlatformShell } from "~platform/components/layout/platform-shell";
import { isPlatformInitialized } from "~platform/middleware/auth";

export default async function ProtectedLayout({ children, requestInfo }: LayoutProps) {
    const initialized = await isPlatformInitialized();

    if (!initialized) {
        requestInfo?.response.headers.set("Location", "/platform/setup");
        requestInfo!.response.status = 302;
        return <>
        {children}
        </>
    }

    if (!requestInfo?.ctx.user) {
        requestInfo?.response.headers.set("Location", "/platform/auth/login");
        requestInfo!.response.status = 302;
        return <>
        {children}
        </>
    }

    return <PlatformShell requestInfo={requestInfo}>{children}</PlatformShell>;
}
