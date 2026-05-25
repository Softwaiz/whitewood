import type { RequestInfo } from "rwsdk/worker";
import { UserUpdateForm } from "~platform/components/user-update-form";
import { UserResolver } from "~platform/@resolvers/user";
import { redirect } from "~platform/utils/request-context";

export default async function PlatformUpdateUser({ params, request, ctx }: RequestInfo) {
    const userId = params.uid;

    if (!ctx.user || !userId) {
        return redirect("/platform/users", { request });
    }

    if (ctx.user.role !== "root") {
        return redirect("/platform/users", { request });
    }

    const targetUser = await UserResolver.instance().getUser(userId);

    if (!targetUser) {
        return redirect("/platform/users", { request });
    }

    return <UserUpdateForm targetUser={targetUser} />;
}
