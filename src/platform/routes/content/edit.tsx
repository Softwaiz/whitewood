import { and, eq } from "drizzle-orm";
import type { RequestInfo } from "rwsdk/worker";
import { db } from "~db/db";
import { posts } from "~db/schema";
import { ArticleComposer } from "~platform/components/article-composer";
import { parseArticleContent } from "~platform/lib/posts";
import { redirect } from "~platform/utils/request-context";

export default async function PlatformEditArticle({ params, request, ctx }: RequestInfo) {
    const contentId = params.cid;

    if (!ctx.user || !contentId) {
        return redirect("/platform/content/new", { request });
    }

    const [content] = await db
        .select({
            id: posts.id,
            content: posts.content,
        })
        .from(posts)
        .where(and(eq(posts.id, contentId), eq(posts.authorId, ctx.user.id)))
        .limit(1)
        .execute();

    if (!content) {
        return redirect("/platform/content/new", { request });
    }

    return (
        <ArticleComposer
            enableLocalCache={false}
            articleId={content.id}
            initialData={parseArticleContent(content.content) ?? {}}
            backHref={`/platform/content/${content.id}`}
            backLabel="Back to article"
        />
    );
}
