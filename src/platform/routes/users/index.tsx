import type { RequestInfo } from "rwsdk/worker";
import { PageTopbar } from "~platform/components/layout/page-topbar";
import { UserResolver } from "~platform/@resolvers/user";

export default async function UsersList(props: RequestInfo) {
    const platformUsers = await UserResolver.instance().getUsers();

    return (
        <div className="space-y-10 pb-12">
            <PageTopbar
                eyebrow="Users"
                title="Platform members"
                description="Review everyone who currently has an account in the platform."
                actions={(
                    <>
                        {props.ctx.user?.role === "root" && (
                            <a
                                href="/platform/users/new"
                                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/85"
                            >
                                Add user
                            </a>
                        )}
                    </>
                )}
            />

            <section className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="mb-5 flex items-center gap-4">
                    <div className="rounded-2xl border border-border/40 bg-card px-6 py-4">
                        <p className="text-xs font-medium text-muted-foreground">Total users</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{platformUsers.length}</p>
                    </div>
                </div>

                <article className="overflow-hidden rounded-2xl border border-border/40 bg-card">
                    <table className="min-w-full divide-y divide-border">
                        <thead>
                            <tr className="bg-muted/40">
                                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Name</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Email</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Role</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Created</th>
                                {props.ctx.user?.role === "root" && (
                                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {platformUsers.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-muted/20">
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-secondary/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary-foreground/80">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.createdAt}</td>
                                    {props.ctx.user?.role === "root" && (
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={`/platform/users/${user.id}/update`}
                                                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/85"
                                            >
                                                Edit
                                            </a>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </article>
            </section>
        </div>
    );
}
