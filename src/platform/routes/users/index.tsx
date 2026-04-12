import type { RequestInfo } from "rwsdk/worker";
import { db } from "~db/db";
import { users } from "~db/schema";

export default async function UsersList(props: RequestInfo) {
    const platformUsers = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        })
        .from(users)
        .execute();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Users</p>
                    <h1 className="text-3xl font-semibold text-neutral-950">Platform members</h1>
                    <p className="mt-1 text-sm text-neutral-500">Review everyone who currently has an account in the platform.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {props.ctx.user?.role === "root" && (
                        <a
                            href="/platform/users/new"
                            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                        >
                            Add user
                        </a>
                    )}
                    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                        <p className="text-sm text-neutral-500">Total users</p>
                        <p className="text-2xl font-semibold text-neutral-950">{platformUsers.length}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-neutral-200">
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
        </div>
    );
}
