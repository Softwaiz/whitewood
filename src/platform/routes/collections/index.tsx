import type { RequestInfo } from "rwsdk/worker";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { CollectionResolver } from "~platform/@resolvers/collection";
import type { Collection } from "~db/schema";

export default async function CollectionsList(props: RequestInfo) {
    const currentUser = props.ctx.user;

    if (!currentUser || !currentUser.organizationId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                You must be signed in to view collections.
            </div>
        );
    }

    const collections = await CollectionResolver.instance().getCollections(currentUser.organizationId);

    return (
        <div className="space-y-6">
            <PageTopbar
                eyebrow="Collections"
                title="Content collections"
                description="Organize your articles into collections. Readers can browse articles by collection."
                actions={(
                    <>
                        {currentUser.role === "root" && (
                            <a
                                href="/platform/collections/new"
                                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                            >
                                New collection
                            </a>
                        )}
                        <div className="rounded-full border border-neutral-200 bg-white px-4 py-2">
                            <p className="text-sm text-neutral-500">Total collections</p>
                            <p className="text-2xl font-semibold text-neutral-950">{collections.length}</p>
                        </div>
                    </>
                )}
            />

            {collections.length === 0 ? (
                <div className="mx-2 md:mx-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
                    <p className="text-base font-medium text-neutral-950">No collections yet</p>
                    <p className="mt-2 text-sm text-neutral-500">
                        Create your first collection to start categorizing articles.
                    </p>
                </div>
            ) : (
                <div className="mx-2 md:mx-4 overflow-hidden rounded-2xl border border-neutral-200">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Label</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {collections.map((collection: Collection) => (
                                <tr key={collection.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 text-sm font-medium text-neutral-950">
                                        {collection.label}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 font-mono">
                                        {collection.slug}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">
                                        {collection.description || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">
                                        {collection.createdAt}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
