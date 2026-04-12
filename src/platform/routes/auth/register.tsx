import { RequestInfo } from "rwsdk/worker";
import { isPlatformInitialized } from "~platform/middleware/auth";
import { redirect } from "~platform/utils/request-context";

export default async function PlatformRegister(props: RequestInfo) {
    if (props.ctx.user) {
        return redirect("/platform", { request: props.request, status: 302 });
    }

    const initialized = await isPlatformInitialized();

    if (!initialized) {
        return redirect("/platform/setup", { request: props.request, status: 302 });
    }

    return redirect("/platform/auth/login", { request: props.request, status: 302 });
}
