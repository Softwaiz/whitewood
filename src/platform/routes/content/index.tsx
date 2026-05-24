import { Render } from "@puckeditor/core";
import { and, eq } from "drizzle-orm";
import type { RequestInfo } from "rwsdk/worker";
import { db } from "~db/db";
import { posts } from "~db/schema";
import { PuckEditorConfig } from "~platform/blog/components/blocks/config";
import { Button } from "~components/ui/button";
import { redirect } from "~platform/utils/request-context";
import { parseArticleContent } from "~platform/lib/posts";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { PostResolver } from "~platform/@resolvers/post";

export default async function PlatformContentDetail({ params, request, ctx }: RequestInfo) {
    const contentId = params.cid;

    if (!ctx.user || !contentId) {
        return redirect("/platform/content/new", { request });
    }

    const content = await PostResolver.instance().getPostByIdAndAuthor(contentId, ctx.user.id);

    if (!content) {
        return redirect("/platform/content/new", { request });
    }

    const article = parseArticleContent(content.content);

    if (!article) {
        return redirect(`/platform/content/${content.id}/edit`, { request });
    }

    return (
        <div className="space-y-8">
            <PageTopbar
                eyebrow="Article"
                title={content.title || "Untitled article"}
                description={content.description || "No description yet. Open the editor to continue shaping this draft."}
                actions={(
                    <>
                        <Button asChild variant="outline" className="rounded-full">
                            <a href="/platform/content/new">New article</a>
                        </Button>
                        <Button asChild className="rounded-full">
                            <a href={`/platform/content/${content.id}/edit`}>Edit article</a>
                        </Button>
                    </>
                )}
            />
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium uppercase tracking-[0.18em] text-neutral-700">
                        {content.published ? "Published" : "Draft"}
                    </span>
                    <span>Slug: {content.slug}</span>
                </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                <Render data={article} config={PuckEditorConfig} />
            </section>
        </div>
    );
}
