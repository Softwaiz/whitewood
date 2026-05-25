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
                <div className="w-full rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
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
                <span className="text-xs text-muted-foreground/50">OR</span>
                <hr className="grow" />
            </div>

            <Button
                size="lg"
                className="w-full border text-foreground hover:text-foreground/80"
                variant="outline"
                type="button"
                asChild>
                <a href="/platform/auth/login?channel=google">
                    Register with Google
                </a>
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account? <a href="/platform/auth/login" className="font-medium text-primary hover:underline">Log in</a>
            </p>
        </form>
    );
}
