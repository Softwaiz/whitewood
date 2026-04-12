import type { RequestInfo } from "rwsdk/worker";
import { SetupForm } from "~platform/components/auth/setup-form";
import { isPlatformInitialized } from "~platform/middleware/auth";
import { redirect } from "~platform/utils/request-context";

export default async function PlatformSetup(props: RequestInfo) {
    const initialized = await isPlatformInitialized();

    if (initialized) {
        if (props.ctx.user) {
            return redirect("/platform", { request: props.request });
        }

        return redirect("/platform/auth/login", { request: props.request });
    }

    return (
        <div className="flex min-h-dvh w-full items-center justify-center bg-neutral-200 p-4 text-neutral-600">
            <div className="w-full max-w-3xl rounded-2xl bg-neutral-50 p-8 shadow-md">
                <div className="mb-8">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                        First-time setup
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-neutral-950">
                        Initialize your Whitewood installation
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                        The first person here creates the root account and the organization profile.
                        After this step, public signup is closed and new members must be added by the root user.
                    </p>
                </div>

                <SetupForm />
            </div>
        </div>
    );
}
