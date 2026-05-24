import type { RequestInfo } from "rwsdk/worker";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { UserResolver } from "~platform/@resolvers/user";

export default async function UsersList(props: RequestInfo) {
    const platformUsers = await UserResolver.instance().getUsers();

    return (
        <div className="space-y-6">
            <PageTopbar
                eyebrow="Users"
                title="Platform members"
                description="Review everyone who currently has an account in the platform."
                actions={(
                    <>
                        {props.ctx.user?.role === "root" && (
                            <a
                                href="/platform/users/new"
                                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                            >
                                Add user
                            </a>
                        )}
                        <div className="rounded-full border border-neutral-200 bg-white px-4 py-2">
                            <p className="text-sm text-neutral-500">Total users</p>
                            <p className="text-2xl font-semibold text-neutral-950">{platformUsers.length}</p>
                        </div>
                    </>
                )}
            />

            <table className="min-w-full divide-y divide-neutral-200 mx-2 md:mx-4">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                    {platformUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-neutral-50">
                            <td className="px-6 py-4 text-sm font-medium text-neutral-950">
                                {user.firstName} {user.lastName}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700">
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">{user.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
