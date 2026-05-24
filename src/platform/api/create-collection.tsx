"use server";

import { getRequestInfo, serverAction } from "rwsdk/worker";
import { CreateCollectionInput, CreateCollectionSchema } from "~platform/schemas/collection";
import { CollectionResolver } from "~platform/@resolvers/collection";

export const createCollection = serverAction(async (input: CreateCollectionInput) => {
    const requestInfo = getRequestInfo();
    const currentUser = requestInfo.ctx.user;

    if (!currentUser) {
        return { success: false, error: "You must be signed in to create a collection." };
    }

    if (currentUser.role !== "root") {
        return { success: false, error: "Only the root user can manage collections." };
    }

    if (!currentUser.organizationId) {
        return { success: false, error: "No organization is attached to the current user." };
    }

    const result = CreateCollectionSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const existing = await CollectionResolver.instance().getCollectionBySlug(
        result.data.slug,
        currentUser.organizationId,
    );

    if (existing) {
        return { success: false, error: "A collection with this slug already exists." };
    }

    const collection = await CollectionResolver.instance().createCollection({
        label: result.data.label,
        description: result.data.description || null,
        slug: result.data.slug,
        organizationId: currentUser.organizationId,
    });

    return { success: true, collection };
}, { method: "POST" });
