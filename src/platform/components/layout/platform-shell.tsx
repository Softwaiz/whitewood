import type { LayoutProps } from "rwsdk/router";
import { PlatformSidebar } from "./platform-sidebar";
import { OrganizationResolver } from "~platform/@resolvers/organization";
import { IdentityProvider } from "~platform/contexts/identity";

export async function PlatformShell({ children, requestInfo }: LayoutProps) {
    const user = requestInfo?.ctx.user;
    const pathname = requestInfo?.request ? new URL(requestInfo.request.url).pathname : "";
    const organization = user?.organizationId
        ? await OrganizationResolver.instance().getOrganization(user.organizationId)
        : null;
    const organizationLabel = organization?.label || "Whitewood";
    const organizationDescription = organization?.description || "Publishing platform";

    return (
        <IdentityProvider user={user!}>
            <PlatformSidebar
                organizationLabel={organizationLabel}
                organizationDescription={organizationDescription}
                pathname={pathname}
                user={user ?? null}
            >
                {children}
            </PlatformSidebar>
        </IdentityProvider>
    );
}
