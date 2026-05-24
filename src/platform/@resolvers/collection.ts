import { db } from "~db/db";
import { Collection, collections, postCollections } from "~db/schema";
import { and, eq, inArray } from "drizzle-orm";

export class CollectionResolver {

    static instance() {
        if (!globalThis.collectionResolver) {
            globalThis.collectionResolver = new CollectionResolver();
        }
        return globalThis.collectionResolver;
    }

    async getCollection(collectionId: string) {
        const [collection] = await db
            .select()
            .from(collections)
            .where(eq(collections.id, collectionId))
            .limit(1)
            .execute();

        return collection;
    }

    async getCollectionBySlug(slug: string, organizationId: string) {
        const [collection] = await db
            .select()
            .from(collections)
            .where(and(
                eq(collections.slug, slug),
                eq(collections.organizationId, organizationId),
            ))
            .limit(1)
            .execute();

        return collection;
    }

    async getCollections(organizationId: string) {
        const list = await db
            .select()
            .from(collections)
            .where(eq(collections.organizationId, organizationId))
            .orderBy(collections.label)
            .execute();

        return list;
    }

    async createCollection(data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) {
        const date = new Date().toISOString();
        const [collection] = await db
            .insert(collections)
            .values({
                ...data,
                createdAt: date,
                updatedAt: date,
            })
            .returning()
            .execute();

        return collection;
    }

    async updateCollection(collectionId: string, data: Partial<Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>>) {
        const [collection] = await db
            .update(collections)
            .set({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(collections.id, collectionId))
            .returning()
            .execute();

        return collection;
    }

    async deleteCollection(collectionId: string) {
        await db
            .delete(postCollections)
            .where(eq(postCollections.collectionId, collectionId))
            .execute();

        await db
            .delete(collections)
            .where(eq(collections.id, collectionId))
            .execute();

        return { success: true };
    }

    // --- Post-Collection associations ---

    async getCollectionsByPost(postId: string) {
        const rows = await db
            .select({ collection: collections })
            .from(postCollections)
            .innerJoin(collections, eq(postCollections.collectionId, collections.id))
            .where(eq(postCollections.postId, postId))
            .execute();

        return rows.map(r => r.collection);
    }

    async getCollectionsByPostIds(postIds: string[]) {
        if (postIds.length === 0) return {};

        const rows = await db
            .select({
                postId: postCollections.postId,
                collection: collections,
            })
            .from(postCollections)
            .innerJoin(collections, eq(postCollections.collectionId, collections.id))
            .where(inArray(postCollections.postId, postIds))
            .execute();

        const grouped: Record<string, typeof rows[number]['collection'][]> = {};
        for (const row of rows) {
            if (!grouped[row.postId]) {
                grouped[row.postId] = [];
            }
            grouped[row.postId].push(row.collection);
        }
        return grouped;
    }

    async getPostIdsByCollection(collectionId: string) {
        const rows = await db
            .select({ postId: postCollections.postId })
            .from(postCollections)
            .where(eq(postCollections.collectionId, collectionId))
            .execute();

        return rows.map(r => r.postId);
    }

    async addPostToCollection(postId: string, collectionId: string) {
        await db
            .insert(postCollections)
            .values({ postId, collectionId })
            .onConflictDoNothing()
            .execute();
    }

    async removePostFromCollection(postId: string, collectionId: string) {
        await db
            .delete(postCollections)
            .where(and(
                eq(postCollections.postId, postId),
                eq(postCollections.collectionId, collectionId),
            ))
            .execute();
    }

    async setPostCollections(postId: string, collectionIds: string[]) {
        await db
            .delete(postCollections)
            .where(eq(postCollections.postId, postId))
            .execute();

        if (collectionIds.length > 0) {
            await db
                .insert(postCollections)
                .values(collectionIds.map(collectionId => ({ postId, collectionId })))
                .execute();
        }
    }
}
