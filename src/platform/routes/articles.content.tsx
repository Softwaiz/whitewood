"use client";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { PostResolver } from "~platform/@resolvers/post";
import type { Collection } from "~db/schema";
import { FileText, PenLine, Clock } from "lucide-react";
import { useIdentity } from "~platform/contexts/identity";

export default function PlatformArticlesContent({
    totalArticles,
    publishedArticles,
    articles,
    collectionsByPost,
    draftArticles,
    publicationRate
}: {
    totalArticles: number,
    publishedArticles: number,
    articles: Awaited<ReturnType<PostResolver['getPosts']>>,
    collectionsByPost: Record<string, Collection[]>,
    draftArticles: number,
    publicationRate: number,
}) {

    const {user} = useIdentity();

    return (
        <div className="space-y-10 pb-12">
            <PageTopbar
                eyebrow="Articles"
                title="Your publishing workspace"
                description="Track the current state of your content and jump straight into opening or editing any article in the system."
                actions={(
                    <>
                        <a href="/platform/content/new" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/85">
                            Create article
                        </a>
                    </>
                )}
            />

            {/* ── Stat cards ── */}
            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                    <article className="rounded-2xl border border-border/40 bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                                <FileText className="size-5" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Published</p>
                        </div>
                        <p className="mt-5 text-4xl font-semibold tracking-tight text-foreground">{publishedArticles}</p>
                        <p className="mt-2 text-sm text-muted-foreground">Currently visible to readers.</p>
                    </article>

                    <article className="rounded-2xl border border-border/40 bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground/70">
                                <PenLine className="size-5" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Total articles</p>
                        </div>
                        <p className="mt-5 text-4xl font-semibold tracking-tight text-foreground">{totalArticles}</p>
                        <p className="mt-2 text-sm text-muted-foreground">All article records in the platform.</p>
                    </article>

                    <article className="rounded-2xl border border-border/40 bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                <Clock className="size-5" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        </div>
                        <p className="mt-5 text-4xl font-semibold tracking-tight text-foreground">{draftArticles}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{publicationRate}% of articles are published.</p>
                    </article>
                </div>
            </section>

            {/* ── Quick actions + Session ── */}
            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                    <article className="rounded-2xl border border-border/40 bg-card p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Quick actions</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <a href="/platform/content/new" className="group rounded-2xl border border-border/40 bg-muted/50 p-5 transition hover:border-primary/30 hover:bg-secondary/30">
                                <p className="font-medium text-foreground group-hover:text-primary">Create new article</p>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Open the composer and save a fresh draft.</p>
                            </a>
                            <a href="/platform/users" className="group rounded-2xl border border-border/40 bg-muted/50 p-5 transition hover:border-primary/30 hover:bg-secondary/30">
                                <p className="font-medium text-foreground group-hover:text-primary">Open users</p>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Review platform members and access.</p>
                            </a>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-border/40 bg-card p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Current session</h2>
                        <p className="mt-5 text-sm text-muted-foreground">Signed in as</p>
                        <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
                            {user ? `${user.firstName} ${user.lastName}` : "Unknown user"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{user?.email || "No email available"}</p>
                    </article>
                </div>
            </section>

            {/* ── Article table ── */}
            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <article className="rounded-2xl border border-border/40 bg-card">
                    <div className="flex flex-col gap-3 p-6 pb-0 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Library</p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">All articles</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Open an article to review it, or jump into edit mode to continue writing.
                            </p>
                        </div>
                        <a
                            href="/platform/content/new"
                            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/85"
                        >
                            New article
                        </a>
                    </div>

                    {articles.length === 0 ? (
                        <div className="m-6 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
                            <p className="text-base font-medium text-foreground">No articles yet</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Start with a fresh draft and it will appear here once saved.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr className="bg-muted/40">
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Article</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Collections</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Status</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Updated</th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {articles.map((article) => (
                                        <tr key={article.id} className="align-top transition-colors hover:bg-muted/20">
                                            <td className="px-6 py-4">
                                                <div className="max-w-xl">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {article.title || "Untitled article"}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                        {article.description || "No description yet."}
                                                    </p>
                                                    <p className="mt-2 text-xs text-muted-foreground/60">
                                                        /{article.slug}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(collectionsByPost[article.id] || []).length === 0 ? (
                                                        <span className="text-xs text-muted-foreground/50">&mdash;</span>
                                                    ) : (
                                                        (collectionsByPost[article.id] || []).map((col: Collection) => (
                                                            <span key={col.id} className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground/80">
                                                                {col.label}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${article.published ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'}`}>
                                                    <span className={`size-1.5 rounded-full ${article.published ? 'bg-accent' : 'bg-muted-foreground/40'}`} />
                                                    {article.published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {article.updatedAt || article.createdAt}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={`/platform/content/${article.id}`}
                                                        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                                                    >
                                                        Open
                                                    </a>
                                                    <a
                                                        href={`/platform/content/${article.id}/edit`}
                                                        className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/85"
                                                    >
                                                        Edit
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </article>
            </section>
        </div>
    );
}
