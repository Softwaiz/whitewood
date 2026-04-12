"use server";

import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getRequestInfo, serverAction } from "rwsdk/worker";
import { db } from "~db/db";
import { hashPassword } from "~lib/auth";
import { organizations, users } from "~db/schema";
import { UserCookie } from "~platform/cookies/user.server";
import { SetupInput, SetupSchema } from "~platform/schemas/setup";

function createUserSlug(email: string) {
    return `${email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;
}

export const setupPlatform = serverAction(async (input: SetupInput) => {
    const requestInfo = getRequestInfo();
    const result = SetupSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .limit(1)
        .execute();

    if (existingUser) {
        return { success: false, error: "Whitewood has already been initialized." };
    }

    const existingEmail = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, result.data.email))
        .limit(1)
        .execute();

    if (existingEmail.length > 0) {
        return { success: false, error: "Email is already registered." };
    }

    const workFactorRaw = env.PASSWORD_WORK_FACTOR;
    const workFactor = parseInt(workFactorRaw?.toString() || "12", 10);
    const hashedPassword = await hashPassword(result.data.password, workFactor);

    const [organization] = await db.insert(organizations).values({
        label: result.data.organizationLabel,
        description: result.data.organizationDescription || null,
        image: result.data.organizationImage || null,
    }).returning().execute();

    const [user] = await db.insert(users).values({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: hashedPassword,
        role: "root",
        organizationId: organization.id,
        slug: createUserSlug(result.data.email),
    }).returning().execute();

    const serialized = await UserCookie.serialize(user.id);
    requestInfo.response.headers.set("Set-Cookie", serialized);

    return { success: true };
}, { method: "POST" });
