"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { navigate } from "rwsdk/client";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";
import { PasswordInput } from "~components/ui/password-input";
import { setupPlatform } from "~platform/api/setup";
import { SetupInput, SetupSchema } from "~platform/schemas/setup";

export function SetupForm() {
    const [serverError, setServerError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SetupInput>({
        resolver: standardSchemaResolver(SetupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            organizationLabel: "",
            organizationDescription: "",
            organizationImage: "",
        },
    });

    const onSubmit = async (data: SetupInput) => {
        setServerError("");

        try {
            const result = await setupPlatform(data);

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
            {serverError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                    {serverError}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" type="text" disabled={isSubmitting} {...field} />
                            {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="lastName"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" type="text" disabled={isSubmitting} {...field} />
                            {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            </div>

            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="email">Root email</Label>
                        <Input id="email" type="email" disabled={isSubmitting} {...field} />
                        {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput id="password" disabled={isSubmitting} {...field} />
                            {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <PasswordInput id="confirmPassword" disabled={isSubmitting} {...field} />
                            {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            </div>

            <Controller
                name="organizationLabel"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="organizationLabel">Organization label</Label>
                        <Input id="organizationLabel" type="text" disabled={isSubmitting} {...field} />
                        {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Controller
                name="organizationDescription"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="organizationDescription">Organization description</Label>
                        <textarea
                            id="organizationDescription"
                            className="min-h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 transition focus-visible:ring-3"
                            disabled={isSubmitting}
                            {...field}
                        />
                        {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Controller
                name="organizationImage"
                control={control}
                render={({ field, fieldState }) => (
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="organizationImage">Organization image URL</Label>
                        <Input id="organizationImage" type="url" disabled={isSubmitting} {...field} />
                        {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Button size="lg" type="submit" className="mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Initializing..." : "Initialize Whitewood"}
            </Button>
        </form>
    );
}
