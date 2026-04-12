import { count, eq } from "drizzle-orm";
import type { RequestInfo } from "rwsdk/worker";
import { db } from "~db/db";
import { users } from "~db/schema";
import { UserCookie } from "~platform/cookies/user.server";
import { redirect } from "~platform/utils/request-context";

export async function loadCurrentUser({ request, ctx }: RequestInfo) {
    const userId = UserCookie.parseRequest(request);

    if (!userId) {
        ctx.user = null;
        return;
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .execute();

    ctx.user = user ?? null;
}

export function requirePlatformUser({ request, ctx }: RequestInfo) {
    if (!ctx.user) {
        return redirect("/platform/auth/login", { request });
    }
}

export async function isPlatformInitialized() {
    const [result] = await db
        .select({ value: count() })
        .from(users)
        .execute();

    return (result?.value ?? 0) > 0;
}
