import type { RequestInfo } from "rwsdk/worker";
import { db } from "~db/db";
import { posts } from "~db/schema";
import { ArticleComposer } from "~platform/components/article-composer";
import { DraftCookie } from "~platform/cookies/draft.server";
import { parseArticleContent } from "~platform/lib/posts";
import { and, eq } from "drizzle-orm";

export default async function PlatformNewArticle({ request, ctx }: RequestInfo) {
    const draftId = DraftCookie.parseRequest(request);

    if (!ctx.user || !draftId) {
        return <ArticleComposer enableLocalCache />;
    }

    const [draft] = await db
        .select({
            id: posts.id,
            content: posts.content,
        })
        .from(posts)
        .where(and(eq(posts.id, draftId), eq(posts.authorId, ctx.user.id)))
        .limit(1)
        .execute();

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
