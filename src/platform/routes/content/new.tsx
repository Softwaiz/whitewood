import type { RequestInfo } from "rwsdk/worker";
import { ArticleComposer } from "~platform/components/article-composer";
import { DraftCookie } from "~platform/cookies/draft.server";
import { parseArticleContent } from "~platform/lib/posts";
import { PostResolver } from "~platform/@resolvers/post";

export default async function PlatformNewArticle({ request, ctx }: RequestInfo) {
    const draftId = DraftCookie.parseRequest(request);

    if (!ctx.user || !draftId) {
        return <ArticleComposer enableLocalCache />;
    }

    const draft = await PostResolver.instance().getPostByIdAndAuthor(draftId, ctx.user.id);

    if (!draft) {
        return <ArticleComposer enableLocalCache />;
    }

    return (
        <ArticleComposer
            enableLocalCache={false}
            articleId={draft.id}
            initialData={parseArticleContent(draft.content) ?? {}}
            backHref={`/platform/content/${draft.id}`}
            backLabel="Back to article"
        />
    );
}
