"use server";

import { env } from "cloudflare:workers";
import { getRequestInfo, serverAction } from "rwsdk/worker";
import { hashPassword } from "~lib/auth";
import { UpdateUserInput, UpdateUserSchema } from "~platform/schemas/users";
import { UserResolver } from "~platform/@resolvers/user";

export const updateUser = serverAction(async (input: UpdateUserInput & { userId: string }) => {
    const requestInfo = getRequestInfo();
    const currentUser = requestInfo.ctx.user;

    if (!currentUser) {
        return { success: false, error: "You must be signed in to update a user." };
    }

    if (currentUser.role !== "root") {
        return { success: false, error: "Only the root user can update members." };
    }

    if (!currentUser.organizationId) {
        return { success: false, error: "No organization is attached to the current user." };
    }

    const { userId, ...fields } = input;
    const result = UpdateUserSchema.safeParse(fields);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const targetUser = await UserResolver.instance().getUser(userId);

    if (!targetUser) {
        return { success: false, error: "User not found." };
    }

    if (targetUser.organizationId !== currentUser.organizationId) {
        return { success: false, error: "You do not have permission to update this user." };
    }

    if (result.data.email && result.data.email !== targetUser.email) {
        const emailConflict = await UserResolver.instance().getUserByEmail(result.data.email);
        if (emailConflict) {
            return { success: false, error: "Email is already registered." };
        }
    }

    const updateData: Record<string, unknown> = {};

    if (result.data.firstName !== undefined) updateData.firstName = result.data.firstName;
    if (result.data.lastName !== undefined) updateData.lastName = result.data.lastName;
    if (result.data.email !== undefined) updateData.email = result.data.email;
    if (result.data.role !== undefined) updateData.role = result.data.role;

    if (result.data.password) {
        const workFactorRaw = env.PASSWORD_WORK_FACTOR;
        const workFactor = parseInt(workFactorRaw?.toString() || "12", 10);
        updateData.password = await hashPassword(result.data.password, workFactor);
    }

    await UserResolver.instance().updateUser(userId, updateData);

    return { success: true };
}, { method: "POST" });
