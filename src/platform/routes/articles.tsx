import type { RequestInfo } from "rwsdk/worker";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { PostResolver } from "~platform/@resolvers/post";
import { CollectionResolver } from "~platform/@resolvers/collection";
import type { Collection } from "~db/schema";

export default async function PlatformArticles(props: RequestInfo) {
    const totalArticles = await PostResolver.instance().countPosts();

    const publishedArticles = await PostResolver.instance().countPosts({ published: 1 });

    const articles = await PostResolver.instance().getPosts({
        orderBy: 'updatedAt',
        orderDir: 'desc',
    });

    const postIds = articles.map(a => a.id);
    const collectionsByPost = await CollectionResolver.instance().getCollectionsByPostIds(postIds);

    const draftArticles = Math.max(totalArticles - publishedArticles, 0);
    const publicationRate = totalArticles > 0
        ? Math.round((publishedArticles / totalArticles) * 100)
        : 0;

    return (
        <div className="space-y-8">
            <PageTopbar
                eyebrow="Articles"
                title="Your publishing workspace"
                description="Track the current state of your content and jump straight into opening or editing any article in the system."
                actions={(
                    <>
                        <a href="/platform/articles" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                            Refresh articles
                        </a>
                        <a href="/platform/content/new" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
                            Create article
                        </a>
                        <a href="/platform/users" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                            Manage users
                        </a>
                        {props.ctx.user?.role === "root" && (
                            <a href="/platform/collections" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                                Manage collections
                            </a>
                        )}
                    </>
                )}
            />

            <section className="grid gap-4 md:grid-cols-3 px-2 md:px-4">
                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-neutral-500">Published articles</p>
                    <p className="mt-3 text-4xl font-semibold text-neutral-950">{publishedArticles}</p>
                    <p className="mt-2 text-sm text-neutral-500">Currently visible to readers.</p>
                </article>

                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-neutral-500">Total articles</p>
                    <p className="mt-3 text-4xl font-semibold text-neutral-950">{totalArticles}</p>
                    <p className="mt-2 text-sm text-neutral-500">All article records in the platform.</p>
                </article>

                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-neutral-500">Pending articles</p>
                    <p className="mt-3 text-4xl font-semibold text-neutral-950">{draftArticles}</p>
                    <p className="mt-2 text-sm text-neutral-500">{publicationRate}% of articles are published.</p>
                </article>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr] px-2 md:px-4">
                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-950">Quick actions</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <a href="/platform/content/new" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-300 hover:bg-neutral-100">
                            <p className="font-medium text-neutral-950">Create new article</p>
                            <p className="mt-1 text-sm text-neutral-500">Open the composer and save a fresh draft.</p>
                        </a>
                        <a href="/platform/users" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-300 hover:bg-neutral-100">
                            <p className="font-medium text-neutral-950">Open users</p>
                            <p className="mt-1 text-sm text-neutral-500">Review platform members and access.</p>
                        </a>
                    </div>
                </article>

                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-950">Current session</h2>
                    <p className="mt-4 text-sm text-neutral-500">Signed in as</p>
                    <p className="mt-2 text-xl font-semibold text-neutral-950">
                        {props.ctx.user ? `${props.ctx.user.firstName} ${props.ctx.user.lastName}` : "Unknown user"}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">{props.ctx.user?.email || "No email available"}</p>
                </article>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm mx-2 md:mx-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Library</p>
                        <h2 className="text-2xl font-semibold text-neutral-950">All articles</h2>
                        <p className="mt-1 text-sm text-neutral-500">
                            Open an article to review it, or jump into edit mode to continue writing.
                        </p>
                    </div>
                    <a
                        href="/platform/content/new"
                        className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                    >
                        New article
                    </a>
                </div>

                {articles.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
                        <p className="text-base font-medium text-neutral-950">No articles yet</p>
                        <p className="mt-2 text-sm text-neutral-500">
                            Start with a fresh draft and it will appear here once saved.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Article</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Collections</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Updated</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                                {articles.map((article) => (
                                    <tr key={article.id} className="align-top hover:bg-neutral-50">
                                        <td className="px-6 py-4">
                                            <div className="max-w-xl">
                                                <p className="text-sm font-semibold text-neutral-950">
                                                    {article.title || "Untitled article"}
                                                </p>
                                                <p className="mt-1 text-sm text-neutral-500">
                                                    {article.description || "No description yet."}
                                                </p>
                                                <p className="mt-2 text-xs text-neutral-400">
                                                    /{article.slug}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(collectionsByPost[article.id] || []).length === 0 ? (
                                                    <span className="text-xs text-neutral-400">—</span>
                                                ) : (
                                                    (collectionsByPost[article.id] || []).map((col: Collection) => (
                                                        <span key={col.id} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                                            {col.label}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700">
                                                {article.published ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {article.updatedAt || article.createdAt}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={`/platform/content/${article.id}`}
                                                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-white hover:text-neutral-950"
                                                >
                                                    Open
                                                </a>
                                                <a
                                                    href={`/platform/content/${article.id}/edit`}
                                                    className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
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
            </section>
        </div>
    );
}
