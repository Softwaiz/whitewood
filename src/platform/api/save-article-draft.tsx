"use server";

import { getRequestInfo, serverAction } from "rwsdk/worker";
import { eq } from "drizzle-orm";
import { db } from "~db/db";
import { posts } from "~db/schema";
import { applyArticleSlug, normalizeArticlePayload } from "~platform/lib/posts";
import { DraftCookie } from "~platform/cookies/draft.server";

type SaveArticleDraftInput = {
    article: Record<string, any>;
    articleId?: string;
};

async function ensureUniquePostSlug(baseSlug: string, currentPostId?: string) {
    let attempt = 0;

    while (true) {
        const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
        const [existingPost] = await db
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.slug, candidateSlug))
            .limit(1)
            .execute();

        if (!existingPost || existingPost.id === currentPostId) {
            return candidateSlug;
        }

        attempt += 1;
    }
}

export const saveArticleDraft = serverAction(async (input: SaveArticleDraftInput) => {
    const requestInfo = getRequestInfo();
    const user = requestInfo.ctx.user;

    if (!user) {
        return {
            success: false,
            title: "Unauthorized",
            message: "Please sign in again before saving your article.",
        };
    }

    const article = input?.article;

    if (!article || typeof article !== "object") {
        return {
            success: false,
            title: "Malformed article",
            message: "The submitted article payload is invalid.",
        };
    }

    const explicitArticleId = input.articleId?.trim();
    const existingDraftId = DraftCookie.parseRequest(requestInfo.request);
    const targetArticleId = explicitArticleId || existingDraftId;

    try {
        if (targetArticleId) {
            const [existingPost] = await db
                .select({ id: posts.id, authorId: posts.authorId })
                .from(posts)
                .where(eq(posts.id, targetArticleId))
                .limit(1)
                .execute();

            if (existingPost) {
                if (existingPost.authorId !== user.id) {
                    return {
                        success: false,
                        title: "Unauthorized",
                        message: "You do not have permission to edit this article.",
                    };
                }

                const normalizedArticlePayload = normalizeArticlePayload(article);
                const slug = await ensureUniquePostSlug(normalizedArticlePayload.slug, targetArticleId);
                const normalizedArticle = applyArticleSlug(normalizedArticlePayload.article, slug);
                const content = JSON.stringify(normalizedArticle);

                await db
                    .update(posts)
                    .set({
                        title: normalizedArticlePayload.title,
                        description: normalizedArticlePayload.description,
                        slug,
                        content,
                        authorId: user.id,
                        updatedAt: new Date().toISOString(),
                    })
                    .where(eq(posts.id, targetArticleId))
                    .execute();

                requestInfo.response.headers.set(
                    "Set-Cookie",
                    DraftCookie.serialize(targetArticleId, {
                        maxAge: 60 * 60 * 24 * 365,
                        path: "/",
                    })
                );

                return {
                    success: true,
                    title: "Saved",
                    message: "Your article draft was updated.",
                    articleId: targetArticleId,
                    slug,
                };
            }
        }

        const normalizedArticlePayload = normalizeArticlePayload(article);
        const slug = await ensureUniquePostSlug(normalizedArticlePayload.slug);
        const normalizedArticle = applyArticleSlug(normalizedArticlePayload.article, slug);
        const content = JSON.stringify(normalizedArticle);

        const [createdPost] = await db
            .insert(posts)
            .values({
                title: normalizedArticlePayload.title,
                description: normalizedArticlePayload.description,
                slug,
                content,
                published: 0,
                authorId: user.id,
            })
            .returning({ id: posts.id })
            .execute();

        requestInfo.response.headers.set(
            "Set-Cookie",
            DraftCookie.serialize(createdPost.id, {
                maxAge: 60 * 60 * 24 * 365,
                path: "/",
            })
        );

        return {
            success: true,
            title: "Saved",
            message: "Your article was saved as a draft.",
            articleId: createdPost.id,
            slug,
        };
    } catch (error: any) {
        return {
            success: false,
            title: "Unable to save draft",
            message: error?.message || "An unexpected error occurred while saving your article.",
        };
    }
}, { method: "POST" });
