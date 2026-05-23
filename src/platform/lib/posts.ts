const DEFAULT_ARTICLE_SLUG = "story/this-is-my-story";

export function slugify(value: string) {
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
    const providedSlug = String(rootProps.slug || "").trim();
    const preferredSlug = providedSlug && providedSlug !== DEFAULT_ARTICLE_SLUG
        ? providedSlug
        : title;
    const slug = slugify(preferredSlug) || createFallbackSlug();
    const normalizedArticle = {
        ...article,
        root: {
            ...article.root,
            props: {
                ...rootProps,
                title,
                description,
                slug,
            },
        },
    };

    return {
        title,
        description,
        slug,
        article: normalizedArticle,
        content: JSON.stringify(normalizedArticle),
    };
}

export function applyArticleSlug(article: Record<string, any>, slug: string) {
    const rootProps = article.root?.props ?? {};

    return {
        ...article,
        root: {
            ...article.root,
            props: {
                ...rootProps,
                slug,
            },
        },
    };
}

export function parseArticleContent(content: string) {
    try {
        return JSON.parse(content);
    } catch {
        return null;
    }
}
