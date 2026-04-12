"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { navigate } from "rwsdk/client";
import { ChevronLeft } from "lucide-react";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";
import { PasswordInput } from "~components/ui/password-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~components/ui/select";
import { NavLink } from "~components/nav-link";
import { createUser } from "~platform/api/create-user";
import { CreateUserInput, CreateUserSchema } from "~platform/schemas/users";

export default function PlatformNewUser() {
    const [serverError, setServerError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<CreateUserInput>({
        resolver: standardSchemaResolver(CreateUserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "member",
        },
    });

    const onSubmit = async (data: CreateUserInput) => {
        setServerError("");

        try {
            const result = await createUser(data);

            if (result?.error) {
                setServerError(result.error);
                return;
            }

            navigate("/platform/users");
        } catch (error: any) {
            setServerError(error?.message || "Unable to create the user.");
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <NavLink href="/platform/users" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
                    <ChevronLeft className="size-4" />
                    Back to users
                </NavLink>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-neutral-500">Users</p>
                <h1 className="mt-2 text-3xl font-semibold text-neutral-950">Add a new member</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                    Create an account for someone in this organization. They will be able to sign in with the password you set here.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="space-y-5">
                    {serverError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" disabled={isSubmitting} {...field} />
                                    {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />

                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" disabled={isSubmitting} {...field} />
                                    {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" disabled={isSubmitting} {...field} />
                                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />

                    <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <PasswordInput id="password" disabled={isSubmitting} {...field} />
                                    {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />

                        <Controller
                            name="role"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger id="role" className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <NavLink href="/platform/users">Cancel</NavLink>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating user..." : "Add user"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
