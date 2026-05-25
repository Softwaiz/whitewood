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
import { updateUser } from "~platform/api/update-user";
import { UpdateUserInput, UpdateUserSchema } from "~platform/schemas/users";
import type { User } from "~db/schema";

type Props = {
    targetUser: User;
};

export function UserUpdateForm({ targetUser }: Props) {
    const [serverError, setServerError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<UpdateUserInput>({
        resolver: standardSchemaResolver(UpdateUserSchema),
        defaultValues: {
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            email: targetUser.email,
            password: "",
            role: targetUser.role as "member" | "editor",
        },
    });

    const onSubmit = async (data: UpdateUserInput) => {
        setServerError("");

        try {
            const result = await updateUser({ ...data, userId: targetUser.id });

            if (result?.error) {
                setServerError(result.error);
                return;
            }

            navigate("/platform/users");
        } catch (error: any) {
            setServerError(error?.message || "Unable to update the user.");
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div>
                <NavLink href="/platform/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
                    <ChevronLeft className="size-4" />
                    Back to users
                </NavLink>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">Users</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Update {targetUser.firstName} {targetUser.lastName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Modify the member's details below. Leave the password field empty to keep it unchanged.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                    {serverError && (
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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
                                    <Label htmlFor="password">New password (leave blank to keep)</Label>
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
                        {isSubmitting ? "Updating..." : "Update user"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
