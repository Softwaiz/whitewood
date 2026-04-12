import type { RequestInfo } from "rwsdk/worker";
import { redirect } from "~platform/utils/request-context";

export default function PlatformIndex({ request }: RequestInfo) {
    return redirect("/platform/articles", { request });
}

