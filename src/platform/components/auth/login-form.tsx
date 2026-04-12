"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { navigate } from "rwsdk/client";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";
import { PasswordInput } from "~components/ui/password-input";
import { login } from "~platform/api/login";
import { LoginInput, LoginSchema } from "~platform/schemas/login";

export function LoginForm() {
    const [serverError, setServerError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginInput>({
        resolver: standardSchemaResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setServerError("");

        try {
            const result = await login(data);

            if (result?.error) {
                setServerError(result.error);
                return;
            }

            navigate("/platform");
        } catch (err: any) {
            setServerError(err?.error || err?.message || "An unexpected error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-2">
            {serverError && (
                <div className="w-full bg-red-100 text-red-600 border border-red-200 p-3 rounded-md text-sm text-center">
                    {serverError}
                </div>
            )}

            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="w-full flex flex-col space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" disabled={isSubmitting} {...field} />
                        {fieldState.error && (
                            <p className="mt-2 text-xs text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="w-full flex flex-col space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput id="password" disabled={isSubmitting} {...field} />
                        {fieldState.error && (
                            <p className="text-xs text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

            <Button
                size="lg"
                type="submit"
                className="w-full mt-2"
                disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            <div className="w-full flex flex-row items-center justify-center gap-4 mt-6">
                <hr className="grow" />
                <span className="text-xs text-neutral-400">OR</span>
                <hr className="grow" />
            </div>

            <Button
                size="lg"
                className="w-full text-neutral-700 hover:text-neutral-900 border"
                variant="outline"
                type="button"
                asChild>
                <a href="/platform/auth/login?channel=google">
                    Login with Google
                </a>
            </Button>

            <p className="mt-4 text-center text-sm text-neutral-500">
                Need access? Contact the organization root user to provision your account.
            </p>
        </form>
    );
}
