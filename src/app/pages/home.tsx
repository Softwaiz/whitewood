import type { RequestInfo } from "rwsdk/worker";
import { PostResolver } from "~platform/@resolvers/post";
import { UserResolver } from "~platform/@resolvers/user";
import { ArrowRight } from "~/components/icons";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function Home({ request }: RequestInfo) {
  const posts = await PostResolver.instance().getPosts({
    published: 1,
    orderBy: "createdAt",
    orderDir: "desc",
  });

  // Resolve authors
  const authorIds = [...new Set(posts.map((p) => p.authorId))];
  const authors = await Promise.all(authorIds.map((id) => UserResolver.instance().getUser(id)));
  const authorMap = new Map(authors.filter(Boolean).map((u) => [u!.id, u!]));

  const latest = posts[0] ?? null;
  const recent = posts.slice(latest ? 1 : 0, latest ? 7 : 6);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="text-lg font-semibold tracking-tight text-slate-900">
            Whitewood
          </a>
          <nav className="flex items-center gap-4 text-sm text-slate-500">
            <a href="/platform/auth/login" className="hover:text-slate-900 transition-colors">
              Sign in
            </a>
          </nav>
        </div>
      </header>

      <div className="flex-1">
        {latest ? (
          <>
            {/* Hero — latest article */}
            <section className="border-b border-slate-100 bg-slate-50/50">
              <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Latest article
                </p>
                <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-tight tracking-tight text-slate-950 sm:text-5xl">
                  <a href={`/${latest.slug}`} className="hover:text-slate-600 transition-colors">
                    {latest.title || "Untitled"}
                  </a>
                </h1>
                {latest.description && (
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
                    {latest.description}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                  {authorMap.has(latest.authorId) && (
                    <span>{authorMap.get(latest.authorId)!.firstName} {authorMap.get(latest.authorId)!.lastName}</span>
                  )}
                  <span>{formatDate(latest.createdAt)}</span>
                </div>
                <a
                  href={`/${latest.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Read article
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </section>

            {/* Recent articles */}
            {recent.length > 0 && (
              <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
                <h2 className="font-heading text-2xl tracking-tight text-slate-950">
                  Recent articles
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recent.map((post) => {
                    const author = authorMap.get(post.authorId);
                    return (
                      <article
                        key={post.id}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                      >
                        <a href={`/${post.slug}`} className="block">
                          <h3 className="font-semibold text-slate-950 group-hover:text-slate-600 transition-colors leading-snug">
                            {post.title || "Untitled"}
                          </h3>
                          {post.description && (
                            <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                              {post.description}
                            </p>
                          )}
                        </a>
                        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                          {author && <span>{author.firstName} {author.lastName}</span>}
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
          /* No articles yet — minimal welcome */
          <section className="flex h-full flex-col items-center justify-center px-6 py-32 text-center">
            <h1 className="font-heading text-4xl tracking-tight text-slate-950 sm:text-5xl">
              Your site is live.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-500">
              Publish your first article from the platform to see it appear here.
            </p>
            <a
              href="/platform/auth/login"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Open the platform
              <ArrowRight className="size-3.5" />
            </a>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-slate-400">
          Powered by{" "}
          <a
            href="https://github.com/Softwaiz/whitewood"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Whitewood
          </a>
        </div>
      </footer>
    </div>
  );
}
