import type { RequestInfo } from "rwsdk/worker";
import { UserCookie } from "~platform/cookies/user.server";
import { redirect } from "~platform/utils/request-context";
import { UserResolver } from "~platform/@resolvers/user";

export async function loadCurrentUser({ request, ctx }: RequestInfo) {
    const userId = UserCookie.parseRequest(request);

    if (!userId) {
        ctx.user = null;
        return;
    }

    const user = await UserResolver.instance().getUser(userId);

    ctx.user = user ?? null;
}

export function requirePlatformUser({ request, ctx }: RequestInfo) {
    if (!ctx.user) {
        return redirect("/platform/auth/login", { request });
    }
}

export async function isPlatformInitialized() {
    const userCount = await UserResolver.instance().countUsers();

    return userCount > 0;
}
