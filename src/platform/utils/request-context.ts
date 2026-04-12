import { getRequestInfo } from "rwsdk/worker";

type RedirectOptions = {
    request?: Request;
    status?: number;
    headers?: HeadersInit;
};

export function redirect(path: string, options: RedirectOptions = {}) {
    const request = options.request ?? getRequestInfo()?.request;
    const location = request ? new URL(path, request.url).toString() : path;

    return new Response(null, {
        status: options.status ?? 302,
        headers: {
            Location: location,
            ...options.headers,
        },
    });
}
