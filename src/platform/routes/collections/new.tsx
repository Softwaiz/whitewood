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
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <NavLink href="/platform/collections" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
                    <ChevronLeft className="size-4" />
                    Back to collections
                </NavLink>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-neutral-500">Collections</p>
                <h1 className="mt-2 text-3xl font-semibold text-neutral-950">Create a new collection</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                    Collections help organize your articles. Each collection has a unique slug used in its URL.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                    {serverError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
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
                                <p className="text-xs text-neutral-500">Lowercase letters, numbers, and hyphens only. Used in the URL.</p>
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
