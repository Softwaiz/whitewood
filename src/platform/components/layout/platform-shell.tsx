import type { LayoutProps } from "rwsdk/router";
import { eq } from "drizzle-orm";
import { db } from "~db/db";
import { organizations } from "~db/schema";
import { PlatformSidebar } from "./platform-sidebar";

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
        <PlatformSidebar
            organizationLabel={organizationLabel}
            organizationDescription={organizationDescription}
            pathname={pathname}
            user={user ?? null}
        >
            {children}
        </PlatformSidebar>
    );
}
