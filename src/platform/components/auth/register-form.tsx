"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";
import { PasswordInput } from "~components/ui/password-input";
import { register } from "~platform/api/register";
import { RegistrationInput, RegistrationSchema } from "~platform/schemas/register";
import { navigate } from "rwsdk/client";

export function RegisterForm() {
    const [serverError, setServerError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RegistrationInput>({
        resolver: standardSchemaResolver(RegistrationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegistrationInput) => {
        setServerError("");
        try {
            const result = await register(data);
            if (result && result.error) {
                setServerError(result.error);
            }
            else {
                navigate("/platform/auth/login");
            }
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
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="w-full flex flex-col space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" type="text" disabled={isSubmitting} {...field} />
                        {fieldState.error && (
                            <p className="mt-2 text-xs text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

            <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="w-full flex flex-col space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" type="text" disabled={isSubmitting} {...field} />
                        {fieldState.error && (
                            <p className="mt-2 text-xs text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

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

            <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="w-full flex flex-col space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <PasswordInput id="confirmPassword" disabled={isSubmitting} {...field} />
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
                {isSubmitting ? "Registering..." : "Register"}
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
                    Register with Google
                </a>
            </Button>

            <p className="text-sm text-center text-neutral-500 mt-4">
                Already have an account? <a href="/platform/auth/login" className="text-neutral-900 font-medium hover:underline">Log in</a>
            </p>
        </form>
    );
}
