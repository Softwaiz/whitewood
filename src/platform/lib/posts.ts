function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

function createFallbackSlug() {
    return `article-${Date.now().toString(36)}`;
}

export function normalizeArticlePayload(article: Record<string, any>) {
    const rootProps = article.root?.props ?? {};
    const title = String(rootProps.title || "Untitled article").trim();
    const description = String(rootProps.description || "").trim();
    const preferredSlug = String(rootProps.slug || title || "").trim();
    const slug = slugify(preferredSlug) || createFallbackSlug();

    return {
        title,
        description,
        slug,
        content: JSON.stringify(article),
    };
}

export function parseArticleContent(content: string) {
    try {
        return JSON.parse(content);
    } catch {
        return null;
    }
}
