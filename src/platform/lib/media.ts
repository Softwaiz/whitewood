const IMAGE_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
]);

export interface MediaObject {
    url: string;
    path: string;
    name: string;
    type: string;
    size: number;
}

export interface MediaUploadResponse {
    media: MediaObject;
}

export function isSupportedImageType(type: string) {
    return IMAGE_MIME_TYPES.has(type);
}

export function getMediaExtension(filename: string, type: string) {
    const normalized = filename.split(".").pop()?.toLowerCase();

    if (normalized) {
        return normalized;
    }

    switch (type) {
        case "image/jpeg":
            return "jpg";
        case "image/png":
            return "png";
        case "image/webp":
            return "webp";
        case "image/gif":
            return "gif";
        case "image/svg+xml":
            return "svg";
        default:
            return "bin";
    }
}

export function createMediaPath(key: string) {
    return `/media/${key}`;
}
