"use server";

import { serverAction, getRequestInfo } from "rwsdk/worker";
import { verifyPassword } from "~lib/auth";
import { UserCookie } from "~platform/cookies/user.server";
import { LoginInput, LoginSchema } from "../schemas/login";
import { UserResolver } from "~platform/@resolvers/user";

export const login = serverAction(async (input: LoginInput) => {
    const requestInfo = getRequestInfo();
    const result = LoginSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const { email, password } = result.data;

    const user = await UserResolver.instance().getUserByEmail(email);

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
