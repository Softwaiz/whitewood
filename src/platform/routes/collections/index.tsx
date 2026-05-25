import type { RequestInfo } from "rwsdk/worker";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { CollectionResolver } from "~platform/@resolvers/collection";
import type { Collection } from "~db/schema";

export default async function CollectionsList(props: RequestInfo) {
    const currentUser = props.ctx.user;

    if (!currentUser || !currentUser.organizationId) {
        return (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-4 text-sm text-destructive">
                You must be signed in to view collections.
            </div>
        );
    }

    const collections = await CollectionResolver.instance().getCollections(currentUser.organizationId);

    return (
        <div className="space-y-10 pb-12">
            <PageTopbar
                eyebrow="Collections"
                title="Content collections"
                description="Organize your articles into collections. Readers can browse articles by collection."
                actions={(
                    <>
                        {currentUser.role === "root" && (
                            <a
                                href="/platform/collections/new"
                                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/85"
                            >
                                New collection
                            </a>
                        )}
                    </>
                )}
            />

            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="mb-5 flex items-center gap-4">
                    <div className="rounded-2xl border border-border/40 bg-card px-6 py-4">
                        <p className="text-xs font-medium text-muted-foreground">Total collections</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{collections.length}</p>
                    </div>
                </div>

                {collections.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
                        <p className="text-base font-medium text-foreground">No collections yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your first collection to start categorizing articles.
                        </p>
                    </div>
                ) : (
                    <article className="overflow-hidden rounded-2xl border border-border/40 bg-card">
                        <table className="min-w-full divide-y divide-border">
                            <thead>
                                <tr className="bg-muted/40">
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Label</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Slug</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Description</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {collections.map((collection: Collection) => (
                                    <tr key={collection.id} className="transition-colors hover:bg-muted/20">
                                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                                            {collection.label}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                                            {collection.slug}
                                        </td>
                                        <td className="max-w-xs truncate px-6 py-4 text-sm text-muted-foreground">
                                            {collection.description || "\u2014"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {collection.createdAt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>
                )}
            </section>
        </div>
    );
}
