import { env } from "cloudflare:workers";
import type { RequestInfo } from "rwsdk/worker";

export default async function PublicMediaObject({ params }: RequestInfo) {
    const key = params.key;

    if (!key) {
        return new Response("Not Found", { status: 404 });
    }

    const object = await env.MEDIA_BUCKET.get(key);

    if (!object) {
        return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(object.body, {
        headers,
    });
}
