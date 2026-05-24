"use server";

import { getRequestInfo, serverAction } from "rwsdk/worker";
import { CollectionResolver } from "~platform/@resolvers/collection";

export const deleteCollection = serverAction(async (input: { collectionId: string }) => {
    const requestInfo = getRequestInfo();
    const currentUser = requestInfo.ctx.user;

    if (!currentUser) {
        return { success: false, error: "You must be signed in to delete a collection." };
    }

    if (currentUser.role !== "root") {
        return { success: false, error: "Only the root user can manage collections." };
    }

    if (!currentUser.organizationId) {
        return { success: false, error: "No organization is attached to the current user." };
    }

    const existing = await CollectionResolver.instance().getCollection(input.collectionId);

    if (!existing) {
        return { success: false, error: "Collection not found." };
    }

    if (existing.organizationId !== currentUser.organizationId) {
        return { success: false, error: "You do not have permission to delete this collection." };
    }

    await CollectionResolver.instance().deleteCollection(input.collectionId);

    return { success: true };
}, { method: "POST" });
