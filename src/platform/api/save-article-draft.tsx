"use server";

import { getRequestInfo, serverAction } from "rwsdk/worker";
import { applyArticleSlug, ensureUniquePostSlug, normalizeArticlePayload } from "~platform/lib/posts";
import { DraftCookie } from "~platform/cookies/draft.server";
import { PostResolver } from "~platform/@resolvers/post";
import { CollectionResolver } from "~platform/@resolvers/collection";

type SaveArticleDraftInput = {
    article: Record<string, any>;
    articleId?: string;
    collectionIds?: string[];
    published?: number;
};


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
    const collectionIds = input.collectionIds ?? [];

    try {
        if (targetArticleId) {
            const existingPost = await PostResolver.instance().getPost(targetArticleId);

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

                const published = input.published ?? existingPost.published;

                await PostResolver.instance().updatePost(targetArticleId, {
                    title: normalizedArticlePayload.title,
                    description: normalizedArticlePayload.description,
                    slug,
                    content,
                    published,
                    authorId: user.id,
                    updatedAt: new Date().toISOString(),
                });

                await CollectionResolver.instance().setPostCollections(targetArticleId, collectionIds);

                requestInfo.response.headers.set(
                    "Set-Cookie",
                    DraftCookie.serialize(targetArticleId, {
                        maxAge: 60 * 60 * 24 * 365,
                        path: "/",
                    })
                );

                const isNowPublished = published === 1;
                return {
                    success: true,
                    title: isNowPublished ? "Published" : "Saved",
                    message: isNowPublished
                        ? "Your article was saved and published."
                        : "Your article draft was updated.",
                    articleId: targetArticleId,
                    slug,
                    published,
                };
            }
        }

        const normalizedArticlePayload = normalizeArticlePayload(article);
        const slug = await ensureUniquePostSlug(normalizedArticlePayload.slug);
        const normalizedArticle = applyArticleSlug(normalizedArticlePayload.article, slug);
        const content = JSON.stringify(normalizedArticle);

        const published = input.published ?? 0;

        const createdPost = await PostResolver.instance().createPost({
            title: normalizedArticlePayload.title,
            description: normalizedArticlePayload.description,
            slug,
            content,
            published,
            authorId: user.id,
            language: "en",
            keywords: JSON.stringify([]),
        });

        await CollectionResolver.instance().setPostCollections(createdPost.id, collectionIds);

        requestInfo.response.headers.set(
            "Set-Cookie",
            DraftCookie.serialize(createdPost.id, {
                maxAge: 60 * 60 * 24 * 365,
                path: "/",
            })
        );

        const isNowPublished = published === 1;
        return {
            success: true,
            title: isNowPublished ? "Published" : "Saved",
            message: isNowPublished
                ? "Your article was created and published."
                : "Your article was saved as a draft.",
            articleId: createdPost.id,
            slug,
            published,
        };
    } catch (error: any) {
        return {
            success: false,
            title: "Unable to save draft",
            message: error?.message || "An unexpected error occurred while saving your article.",
        };
    }
}, { method: "POST" });
