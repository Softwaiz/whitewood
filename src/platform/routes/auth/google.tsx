import { RequestInfo } from "rwsdk/worker";
import { redirect } from "~platform/utils/request-context";

export async function handleAccessCodeReturn(args: RequestInfo) {
    const { request } = args;
    const destination = new URL(request.url);
    const code = destination.searchParams.get("code");

    if (!code) {
        return redirect("/platform/auth/login", { request });
    }

    // Google OAuth not yet implemented — redirect to login
    return redirect("/platform/auth/login", { request });
}
