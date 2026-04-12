"use client";
import { ArrowRight, Cloud, Code2, Code, Feather, Layers3, Sparkles } from "lucide-react";
import { Button } from "~components/ui/button";

const pillars = [
  {
    icon: Cloud,
    title: "Cloudflare-native",
    description:
      "Ship Whitewood to your own Cloudflare instance with the same Worker-first foundation the app is built on.",
  },
  {
    icon: Code,
    title: "Open-source by default",
    description:
      "Fork it, audit it, and keep full ownership of your content platform instead of renting access to one.",
  },
  {
    icon: Layers3,
    title: "Made to extend",
    description:
      "Clone the project, add fields, adjust the editor, and shape the CMS around the way you actually publish.",
  },
];

const highlights = [
  "Clean writing and publishing workflow",
  "One codebase for blog, CMS, and deployment",
  "Schema-backed content you can customize",
  "Designed to be forked, not merely configured",
];

const extensionIdeas = [
  "Add new metadata fields for SEO, categories, sponsors, or series.",
  "Create custom content blocks for embeds, callouts, galleries, and code samples.",
  "Adapt the admin flow to your team, your brand, and your publishing rules.",
];

export const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff7ed_0%,#fef3c7_20%,#f8fafc_55%,#e0f2fe_100%)] text-slate-950">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[linear-gradient(135deg,rgba(251,146,60,0.18),rgba(14,165,233,0.16),rgba(15,23,42,0.04))]" />
        <div className="absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute right-[-6rem] top-10 -z-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

        <section className="mx-auto flex max-w-7xl flex-col gap-14 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <header className="flex flex-col gap-8 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Feather className="size-4" />
                </span>
                Whitewood
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-sm text-slate-600">
                <Sparkles className="size-4 text-orange-500" />
                Open-source blogging platform for Cloudflare
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Publish from your own infrastructure
                </p>
                <h1 className="max-w-4xl font-heading text-5xl leading-none tracking-tight text-balance sm:text-6xl lg:text-7xl">
                  A clean blogging platform you can deploy, fork, and grow with.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                  Whitewood gives you a polished starting point for publishing on
                  Cloudflare. Drop it onto your own instance, launch from GitHub,
                  and keep the source close so you can extend the model whenever
                  your blog needs more than the defaults.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="h-11 rounded-full px-5 text-sm">
                    <a href="/platform/auth/login">
                      Open the platform
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-full border-slate-300/80 bg-white/70 px-5 text-sm"
                  >
                    <a href="https://developers.cloudflare.com/workers/" target="_blank" rel="noreferrer">
                      Cloudflare deployment
                    </a>
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Deploy flow</span>
                  <span>Cloudflare Worker</span>
                </div>
                <div className="mt-4 space-y-3 font-mono text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100">
                    git clone your-fork
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100">
                    npm install
                  </div>
                  <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-orange-100">
                    npm run release
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  The project already ships with a Worker deployment path, so
                  the jump from local fork to hosted instance stays pleasantly
                  short.
                </p>
              </div>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 font-heading text-2xl tracking-tight text-slate-950">
                  {title}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-700">{description}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <article className="rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                <Code2 className="size-3.5" />
                Built to be modified
              </div>
              <h2 className="mt-5 font-heading text-3xl tracking-tight">
                Open source means you are not boxed in.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                Whitewood is a project you can actually own. When your editorial
                model changes, you can change the software too instead of waiting
                for a vendor to add the exact field, workflow, or block you need.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-200">
                {extensionIdeas.map((idea) => (
                  <li key={idea} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {idea}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1.75rem] border border-white/70 bg-white/75 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                What you are starting from
              </p>
              <h2 className="mt-4 font-heading text-3xl tracking-tight text-slate-950">
                A sharper default for publishing teams and solo writers.
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/90 px-4 py-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-sky-200 bg-sky-50/80 p-5">
                <p className="text-sm font-medium text-sky-900">
                  One-click deploy from GitHub belongs naturally in this flow.
                </p>
                <p className="mt-2 text-sm leading-6 text-sky-950/80">
                  The product story is simple: fork Whitewood, connect it to
                  your Cloudflare account, and start from a clean base you can
                  keep evolving in code.
                </p>
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
};
