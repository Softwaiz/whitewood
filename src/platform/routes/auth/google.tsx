import { RequestInfo } from "rwsdk/worker";
import { redirect } from "~platform/utils/request-context";

export async function handleAccessCodeReturn(args: RequestInfo) {
    let { request } = args;
    let destination = new URL(request.url);
    let code = destination.searchParams.get("code");

    if (!code) {
        return redirect("/", { request });
    }

    let url = process.env.GOOGLE_RETURN_URL || "/auth/google";

    const data = await GoogleAuth.exchangeCodeForToken(url, code);

    if (!data?.access_token) {
        return redirect("/", { request });
    }

    let db = args.context.get(DbContext);

    if (!db) {
        return redirect("/", { request });
    }

    const profile = await GoogleAuth.userInfo(data.access_token);

    let user = db.select().from(users).where(eq(users.googleAuthEmail, profile.email)).limit(1).execute().at(0);

    if (!user) {
        return redirect("/", { request });
    }

    let serialized = await UserCookie.serialize(user.id, {
        secure: true,
        maxAge: 60 * 60 * 3,
        path: "/",
    });

    return redirect("/platform/", {
        request,
        headers: {
            'Set-Cookie': serialized
        }
    });
};
