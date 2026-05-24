import { Suspense } from "react";
import type { RequestInfo } from "rwsdk/worker";
import LazyArticleComposer from "~platform/components/article-composer-lazy";
import { parseArticleContent } from "~platform/lib/posts";
import { redirect } from "~platform/utils/request-context";
import { PostResolver } from "~platform/@resolvers/post";

export default async function PlatformEditArticle({ params, request, ctx }: RequestInfo) {
    const contentId = params.cid;

    if (!ctx.user || !contentId) {
        return redirect("/platform/content/new", { request });
    }

    const content = await PostResolver.instance().getPostByIdAndAuthor(contentId, ctx.user.id);

    if (!content) {
        return redirect("/platform/content/new", { request });
    }

    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <LazyArticleComposer
                enableLocalCache={false}
                articleId={content.id}
                initialData={parseArticleContent(content.content) ?? {}}
                backHref={`/platform/content/${content.id}`}
                backLabel="Back to article"
            />
        </Suspense>
    );
}
