"use server";

import { serverAction } from "rwsdk/worker";
import { RegistrationInput, RegistrationSchema } from "../schemas/register";
import { isPlatformInitialized } from "~platform/middleware/auth";

export const register = serverAction(async (input: RegistrationInput) => {
    const result = RegistrationSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const initialized = await isPlatformInitialized();

    if (initialized) {
        return {
            success: false,
            error: "Public registration is disabled. Ask the organization root user to add you.",
        };
    }
    return {
        success: false,
        error: "Use /platform/setup to initialize Whitewood before signing in.",
    };
}, { method: "POST" });
