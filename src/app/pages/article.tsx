import { Render } from "@puckeditor/core";
import type { RequestInfo } from "rwsdk/worker";
import { PostResolver } from "~platform/@resolvers/post";
import { UserResolver } from "~platform/@resolvers/user";
import { PuckEditorConfig } from "~platform/blog/components/blocks/config";
import { parseArticleContent } from "~platform/lib/posts";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-200">404</h1>
        <p className="mt-4 text-lg text-slate-500">This page could not be found.</p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}

function parseKeywords(keywords: string): string[] {
  try {
    const parsed = JSON.parse(keywords);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildArticleSchema(post: {
  id: string;
  title: string;
  description: string;
  language: string | null;
  keywords: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}, authorName: string | null, url: string) {
  const keywords = parseKeywords(post.keywords ?? "[]");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
        }
      : undefined,
    inLanguage: post.language || "fr-FR",
    ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
  };
}

export default async function PublicArticlePage({ params, request }: RequestInfo) {
  const slug = params.slug;

  if (!slug) {
    return <NotFound />;
  }

  const post = await PostResolver.instance().getPostBySlug(slug);

  if (!post || !post.published) {
    return <NotFound />;
  }

  const article = parseArticleContent(post.content);

  if (!article) {
    return <NotFound />;
  }

  const [author] = await Promise.all([
    UserResolver.instance().getUser(post.authorId),
  ]);

  const authorName = author ? `${author.firstName} ${author.lastName}`.trim() : null;
  const pageUrl = request ? new URL(request.url).href : "";
  const schema = buildArticleSchema(post, authorName, pageUrl);

  const title = String(article.root?.props?.title || post.title || "Untitled article");
  const description = String(article.root?.props?.description || post.description || "");

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
          >
            Whitewood
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <header className="mb-10">
          <h1 className="font-heading text-4xl leading-tight tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </header>

        <div className="prose prose-slate prose-lg max-w-none">
          <Render data={article} config={PuckEditorConfig} />
        </div>
      </article>
    </main>
  );
}
