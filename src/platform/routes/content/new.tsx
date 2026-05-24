import type { RequestInfo } from "rwsdk/worker";
import { ArticleComposer } from "~platform/components/article-composer";
import { DraftCookie } from "~platform/cookies/draft.server";
import { parseArticleContent } from "~platform/lib/posts";
import { PostResolver } from "~platform/@resolvers/post";
import { CollectionResolver } from "~platform/@resolvers/collection";

export default async function PlatformNewArticle({ request, ctx }: RequestInfo) {
    const draftId = DraftCookie.parseRequest(request);
    const collections = ctx.user?.organizationId
        ? await CollectionResolver.instance().getCollections(ctx.user.organizationId)
        : [];

    const collectionOptions = collections.map((c) => ({
        id: c.id,
        label: c.label,
        slug: c.slug,
    }));

    if (!ctx.user || !draftId) {
        return <ArticleComposer enableLocalCache availableCollections={collectionOptions} />;
    }

    const draft = await PostResolver.instance().getPostByIdAndAuthor(draftId, ctx.user.id);

    if (!draft) {
        return <ArticleComposer enableLocalCache availableCollections={collectionOptions} />;
    }

    return (
        <ArticleComposer
            enableLocalCache={false}
            articleId={draft.id}
            initialData={parseArticleContent(draft.content) ?? {}}
            availableCollections={collectionOptions}
            backHref={`/platform/content/${draft.id}`}
            backLabel="Back to article"
        />
    );
}
