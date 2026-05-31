import { Suspense } from "react";
import type { RequestInfo } from "rwsdk/worker";
import LazyArticleComposer from "~platform/components/article-composer-lazy";
import { parseArticleContent } from "~platform/lib/posts";
import { redirect } from "~platform/utils/request-context";
import { PostResolver } from "~platform/@resolvers/post";
import { CollectionResolver } from "~platform/@resolvers/collection";

export default async function PlatformEditArticle({ params, request, ctx }: RequestInfo) {
    const contentId = params.cid;

    if (!ctx.user || !contentId) {
        return redirect("/platform/content/new", { request });
    }

    const content = await PostResolver.instance().getPostByIdAndAuthor(contentId, ctx.user.id);

    if (!content) {
        return redirect("/platform/content/new", { request });
    }

    const collections = ctx.user.organizationId
        ? await CollectionResolver.instance().getCollections(ctx.user.organizationId)
        : [];

    const collectionOptions = collections.map((c: { id: string; label: string; slug: string }) => ({
        id: c.id,
        label: c.label,
        slug: c.slug,
    }));

    const postCollections = await CollectionResolver.instance().getCollectionsByPost(contentId);
    const initialCollectionIds = postCollections.map((c: { id: string }) => c.id);

    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <LazyArticleComposer
                enableLocalCache={false}
                articleId={content.id}
                isPublished={content.published === 1}
                initialData={parseArticleContent(content.content) ?? {}}
                availableCollections={collectionOptions}
                initialCollectionIds={initialCollectionIds}
                backHref={`/platform/content/${content.id}`}
                backLabel="Back to article"
            />
        </Suspense>
    );
}
