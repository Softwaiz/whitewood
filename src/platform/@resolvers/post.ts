import { db } from "~db/db";
import { Post, posts } from "~db/schema";
import { and, count, desc, eq } from "drizzle-orm";

export class PostResolver {

    static instance() {
        if (!globalThis.postResolver) {
            globalThis.postResolver = new PostResolver();
        }
        return globalThis.postResolver;
    }

    async getPost(postId: string) {
        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId))
            .limit(1)
            .execute();

        return post;
    }

    async getPostBySlug(slug: string) {
        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1)
            .execute();

        return post;
    }

    async getPostByIdAndAuthor(postId: string, authorId: string) {
        const [post] = await db
            .select()
            .from(posts)
            .where(and(eq(posts.id, postId), eq(posts.authorId, authorId)))
            .limit(1)
            .execute();

        return post;
    }

    async updatePost(postId: string, data: Partial<Post>) {
        const [post] = await db
            .update(posts)
            .set({
                ...data,
            })
            .where(eq(posts.id, postId))
            .returning({ id: posts.id })
            .execute();

        return post;
    }


    async publishPost(postId: string) {
        return this.updatePost(postId, {
            published: 1,
        });
    }

    async unpublishPost(postId: string) {
        return this.updatePost(postId, {
            published: 0,
        });
    }

    async createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
        let date = new Date().toISOString();
        const [post] = await db
            .insert(posts)
            .values({
                ...data,
                createdAt: date,
                updatedAt: date,
            })
            .returning()
            .execute();

        return post;
    }

    async countPosts(options?: { published?: number; authorId?: string }) {
        const query = db.select({ value: count() }).from(posts);
        const conditions = [];
        if (options?.published !== undefined) {
            conditions.push(eq(posts.published, options.published));
        }
        if (options?.authorId !== undefined) {
            conditions.push(eq(posts.authorId, options.authorId));
        }
        if (conditions.length > 0) {
            query.where(and(...conditions));
        }
        const [result] = await query.execute();
        return result?.value ?? 0;
    }

    async getPosts(options?: {
        published?: number;
        authorId?: string;
        orderBy?: 'createdAt' | 'updatedAt';
        orderDir?: 'asc' | 'desc';
    }) {
        const query = db.select().from(posts);
        const conditions = [];

        if (options?.published !== undefined) {
            conditions.push(eq(posts.published, options.published));
        }
        if (options?.authorId !== undefined) {
            conditions.push(eq(posts.authorId, options.authorId));
        }

        if (conditions.length > 0) {
            query.where(and(...conditions));
        }

        const sortBy = options?.orderBy === 'createdAt' ? posts.createdAt : posts.updatedAt;
        const sortOrder = options?.orderDir === 'asc' ? sortBy : desc(sortBy);

        query.orderBy(sortOrder);

        return query.execute();
    }

    async getAllPosts(options: {
        pageSize?: number;
        page?: number;
        published?: boolean,
        authorId?: string
    }) {
        const pageSize = options.pageSize ?? 10;
        const page = options.page ?? 1;
        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        if (offset < 0 || page < 1 || pageSize < 1) {
            throw new Error("Invalid page number or page size");
        }

        const postsList = await db
            .select()
            .from(posts)
            .where(eq(posts.published, options.published ? 1 : 0))
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset)
            .execute();
        return postsList;
    }

    async getPostsByAuthor(options: {
        pageSize?: number;
        page?: number;
        published?: boolean,
        authorId: string
    }) {
        const pageSize = options.pageSize ?? 10;
        const page = options.page ?? 1;
        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        if (offset < 0 || page < 1 || pageSize < 1) {
            throw new Error("Invalid page number or page size");
        }
        const postsList = await db
            .select()
            .from(posts)
            .where(
                and(
                    eq(posts.authorId, options.authorId),
                    ...(options.published !== undefined ? [eq(posts.published, options.published ? 1 : 0)] : []),
                )
            )
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset)
            .execute();

        return postsList;
    }

    async deletePost(postId: string) {
        await db
            .delete(posts)
            .where(eq(posts.id, postId))
            .execute();

        return { success: true };
    }
}