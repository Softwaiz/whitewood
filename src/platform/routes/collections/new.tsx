"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { navigate } from "rwsdk/client";
import { ChevronLeft } from "lucide-react";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";
import { NavLink } from "~components/nav-link";
import { createCollection } from "~platform/api/create-collection";
import { CreateCollectionInput, CreateCollectionSchema } from "~platform/schemas/collection";

export default function PlatformNewCollection() {
    const [serverError, setServerError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<CreateCollectionInput>({
        resolver: standardSchemaResolver(CreateCollectionSchema),
        defaultValues: {
            label: "",
            description: "",
            slug: "",
        },
    });

    const onSubmit = async (data: CreateCollectionInput) => {
        setServerError("");

        try {
            const result = await createCollection(data);

            if (result?.error) {
                setServerError(result.error);
                return;
            }

            navigate("/platform/collections");
        } catch (error: any) {
            setServerError(error?.message || "Unable to create the collection.");
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div>
                <NavLink href="/platform/collections" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
                    <ChevronLeft className="size-4" />
                    Back to collections
                </NavLink>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">Collections</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Create a new collection</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Collections help organize your articles. Each collection has a unique slug used in its URL.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                    {serverError && (
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            {serverError}
                        </div>
                    )}

                    <Controller
                        name="label"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="label">Label</Label>
                                <Input id="label" placeholder="e.g. Technology" disabled={isSubmitting} {...field} />
                                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />

                    <Controller
                        name="slug"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" placeholder="e.g. technology" disabled={isSubmitting} {...field} />
                                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                                <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens only. Used in the URL.</p>
                            </div>
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <textarea id="description" placeholder="Brief description of this collection" className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting} {...field} />
                                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                </div>

                <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <NavLink href="/platform/collections">Cancel</NavLink>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create collection"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
