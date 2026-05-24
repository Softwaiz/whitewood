"use server";

import { getRequestInfo, serverAction } from "rwsdk/worker";
import { UpdateCollectionInput, UpdateCollectionSchema } from "~platform/schemas/collection";
import { CollectionResolver } from "~platform/@resolvers/collection";

export const updateCollection = serverAction(async (input: UpdateCollectionInput & { collectionId: string }) => {
    const requestInfo = getRequestInfo();
    const currentUser = requestInfo.ctx.user;

    if (!currentUser) {
        return { success: false, error: "You must be signed in to update a collection." };
    }

    if (currentUser.role !== "root") {
        return { success: false, error: "Only the root user can manage collections." };
    }

    if (!currentUser.organizationId) {
        return { success: false, error: "No organization is attached to the current user." };
    }

    const { collectionId, ...fields } = input;
    const result = UpdateCollectionSchema.safeParse(fields);

    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const existing = await CollectionResolver.instance().getCollection(collectionId);

    if (!existing) {
        return { success: false, error: "Collection not found." };
    }

    if (existing.organizationId !== currentUser.organizationId) {
        return { success: false, error: "You do not have permission to update this collection." };
    }

    if (result.data.slug && result.data.slug !== existing.slug) {
        const slugConflict = await CollectionResolver.instance().getCollectionBySlug(
            result.data.slug,
            currentUser.organizationId,
        );

        if (slugConflict) {
            return { success: false, error: "A collection with this slug already exists." };
        }
    }

    const updateData: Record<string, unknown> = {};
    if (result.data.label !== undefined) updateData.label = result.data.label;
    if (result.data.description !== undefined) updateData.description = result.data.description || null;
    if (result.data.slug !== undefined) updateData.slug = result.data.slug;

    const collection = await CollectionResolver.instance().updateCollection(collectionId, updateData);

    return { success: true, collection };
}, { method: "POST" });
