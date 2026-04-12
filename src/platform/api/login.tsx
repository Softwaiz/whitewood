"use server";

import { serverAction, getRequestInfo } from "rwsdk/worker";
import { eq } from "drizzle-orm";
import { users } from "~db/schema";
import { verifyPassword } from "~lib/auth";
import { UserCookie } from "~platform/cookies/user.server";
import { db } from "~db/db";
import { LoginInput, LoginSchema } from "../schemas/login";

export const login = serverAction(async (input: LoginInput) => {
    const requestInfo = getRequestInfo();
    const result = LoginSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const { email, password } = result.data;

    const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .execute();

    const user = userResult[0];

    if (!user?.password) {
        return { success: false, error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
        return { success: false, error: "Invalid email or password." };
    }

    const serialized = await UserCookie.serialize(user.id);
    requestInfo.response.headers.set("Set-Cookie", serialized);

    return { success: true };
}, { method: "POST" });
