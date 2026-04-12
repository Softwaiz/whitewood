import { env } from "cloudflare:workers";
import type { RequestInfo } from "rwsdk/worker";
import { createMediaPath, getMediaExtension, isSupportedImageType, type MediaUploadResponse } from "~platform/lib/media";

export default async function PlatformMediaUpload({ request, ctx }: RequestInfo) {
    if (request.method.toUpperCase() !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    if (!ctx.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return Response.json({ message: "A file is required." }, { status: 400 });
    }

    if (!isSupportedImageType(file.type)) {
        return Response.json({ message: "Unsupported image type." }, { status: 400 });
    }

    const extension = getMediaExtension(file.name, file.type);
    const key = `media-${crypto.randomUUID()}.${extension}`;
    const path = createMediaPath(key);

    await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
        httpMetadata: {
            contentType: file.type,
        },
        customMetadata: {
            originalName: file.name,
            uploadedBy: ctx.user.id,
            size: String(file.size),
        },
    });

    return Response.json<MediaUploadResponse>({
        media: {
            url: path,
            path,
            name: file.name,
            type: file.type,
            size: file.size,
        },
    });
}
