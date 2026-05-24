"use server";

import { env } from "cloudflare:workers";
import { getRequestInfo, serverAction } from "rwsdk/worker";
import { hashPassword } from "~lib/auth";
import { UserCookie } from "~platform/cookies/user.server";
import { SetupInput, SetupSchema } from "~platform/schemas/setup";
import { OrganizationResolver } from "~platform/@resolvers/organization";
import { UserResolver } from "~platform/@resolvers/user";

function createUserSlug(email: string) {
    return `${email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;
}

export const setupPlatform = serverAction(async (input: SetupInput) => {
    const requestInfo = getRequestInfo();
    const result = SetupSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const userCount = await UserResolver.instance().countUsers();

    if (userCount > 0) {
        return { success: false, error: "Whitewood has already been initialized." };
    }

    const existingEmail = await UserResolver.instance().getUserByEmail(result.data.email);

    if (existingEmail) {
        return { success: false, error: "Email is already registered." };
    }

    const workFactorRaw = env.PASSWORD_WORK_FACTOR;
    const workFactor = parseInt(workFactorRaw?.toString() || "12", 10);
    const hashedPassword = await hashPassword(result.data.password, workFactor);

    const organization = await OrganizationResolver.instance().createOrganization({
        label: result.data.organizationLabel,
        description: result.data.organizationDescription || null,
        image: result.data.organizationImage || null,
    });

    const user = await UserResolver.instance().createUser({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: hashedPassword,
        role: "root",
        organizationId: organization.id,
        slug: createUserSlug(result.data.email),
        googleAuthEmail: null,
        googleAuthId: null,
    });

    const serialized = await UserCookie.serialize(user.id);
    requestInfo.response.headers.set("Set-Cookie", serialized);

    return { success: true };
}, { method: "POST" });
