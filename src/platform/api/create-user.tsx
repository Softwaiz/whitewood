"use server";

import { env } from "cloudflare:workers";
import { getRequestInfo, serverAction } from "rwsdk/worker";
import { hashPassword } from "~lib/auth";
import { CreateUserInput, CreateUserSchema } from "~platform/schemas/users";
import { UserResolver } from "~platform/@resolvers/user";

function createUserSlug(email: string) {
    return `${email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;
}

export const createUser = serverAction(async (input: CreateUserInput) => {
    const requestInfo = getRequestInfo();
    const currentUser = requestInfo.ctx.user;
    const result = CreateUserSchema.safeParse(input);

    if (!currentUser) {
        return { success: false, error: "You must be signed in to add a user." };
    }

    if (currentUser.role !== "root") {
        return { success: false, error: "Only the root user can add members." };
    }

    if (!currentUser.organizationId) {
        return { success: false, error: "No organization is attached to the current user." };
    }

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const existingUser = await UserResolver.instance().getUserByEmail(result.data.email);

    if (existingUser) {
        return { success: false, error: "Email is already registered." };
    }

    const workFactorRaw = env.PASSWORD_WORK_FACTOR;
    const workFactor = parseInt(workFactorRaw?.toString() || "12", 10);
    const hashedPassword = await hashPassword(result.data.password, workFactor);

    await UserResolver.instance().createUser({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: hashedPassword,
        role: result.data.role,
        organizationId: currentUser.organizationId,
        slug: createUserSlug(result.data.email),
        googleAuthEmail: null,
        googleAuthId: null,
    });

    return { success: true };
}, { method: "POST" });
