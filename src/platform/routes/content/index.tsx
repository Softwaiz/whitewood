import { Render } from "@puckeditor/core";
import { and, eq } from "drizzle-orm";
import type { RequestInfo } from "rwsdk/worker";
import { db } from "~db/db";
import { posts } from "~db/schema";
import type { Collection } from "~db/schema";
import { PuckEditorConfig } from "~platform/blog/components/blocks/config";
import { Button } from "~components/ui/button";
import { redirect } from "~platform/utils/request-context";
import { parseArticleContent } from "~platform/lib/posts";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { PostResolver } from "~platform/@resolvers/post";
import { CollectionResolver } from "~platform/@resolvers/collection";

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

    const postCollections = await CollectionResolver.instance().getCollectionsByPost(contentId);

    return (
        <div className="space-y-10 pb-12">
            <PageTopbar
                eyebrow="Article"
                title={content.title || "Untitled article"}
                description={content.description || "No description yet. Open the editor to continue shaping this draft."}
                actions={(
                    <>
                        <Button asChild variant="outline" className="rounded-full border-border">
                            <a href="/platform/content/new">New article</a>
                        </Button>
                        <Button asChild className="rounded-full">
                            <a href={`/platform/content/${content.id}/edit`}>Edit article</a>
                        </Button>
                    </>
                )}
            />

            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <article className="rounded-2xl border border-border/40 bg-card p-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${content.published ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'}`}>
                            <span className={`size-1.5 rounded-full ${content.published ? 'bg-accent' : 'bg-muted-foreground/40'}`} />
                            {content.published ? "Published" : "Draft"}
                        </span>
                        <span className="text-sm text-muted-foreground">Slug: <span className="font-mono text-xs text-muted-foreground/70">{content.slug}</span></span>
                    </div>
                    {postCollections.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground/60">Collections:</span>
                            {postCollections.map((col: Collection) => (
                                <span key={col.id} className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground/80">
                                    {col.label}
                                </span>
                            ))}
                        </div>
                    )}
                </article>
            </section>

            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <article className="rounded-2xl border border-border/40 bg-card p-8">
                    <Render data={article} config={PuckEditorConfig} />
                </article>
            </section>
        </div>
    );
}
