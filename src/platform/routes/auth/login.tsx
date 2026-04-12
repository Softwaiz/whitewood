import { stringify } from "querystring";
import { RequestInfo } from "rwsdk/worker";
import { LoginForm } from "~platform/components/auth/login-form";
import { isPlatformInitialized } from "~platform/middleware/auth";
import { redirect } from "~platform/utils/request-context";

export default async function PlatformLogin(props: RequestInfo) {
    if (props.ctx.user) {
        return redirect("/platform", { request: props.request, status: 302 });
    }

    const initialized = await isPlatformInitialized();

    if (!initialized) {
        return redirect("/platform/setup", { request: props.request, status: 302 });
    }

    const params = new URL(props.request.url);
    const channel = params.searchParams.get("channel");

    if (channel?.toLowerCase() === "google") {
        let authParams = stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: process.env.GOOGLE_RETURN_URL,
            scope: [
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
            ].join(" "),
            response_type: "code",
            access_type: "offline",
            prompt: "consent",
        });

        const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`;

        return redirect(googleLoginUrl, { request: props.request, status: 302 });
    }

    return (
        <div className="w-full min-h-dvh bg-neutral-200 text-neutral-600 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg flex flex-col shadow-md rounded-md p-8 space-y-6 bg-neutral-50">
                <div className="space-y-3 text-center">
                    <h1 className="font-display text-xl md:text-2xl lg:text-3xl">Sign in to Whitewood</h1>
                    <p className="text-sm leading-6 text-neutral-500">
                        Whitewood accounts are provisioned inside the organization. If you need access, ask the root user to add you.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
