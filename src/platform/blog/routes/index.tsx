import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useEffect, useMemo } from "react";
import { PuckEditorConfig, type EditorComponents } from "~platform/blog/components/blocks/config";
import { AdminContext, DbContext } from "~platform/context";
import z from "zod";
import crypto from "crypto";
import { DraftCookie } from "~platform/cookies/draft.server";
import { type Post } from "../../../@types";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { NavLink } from "~components/nav-link";

export function clientLoader(args: Route.ClientLoaderArgs) {
    const cacheData = localStorage.getItem("article.new");
    if (cacheData) {
        return {
            cached: JSON.parse(cacheData) as Data<EditorComponents>
        }
    }
    return {
        cached: {}
    }
}

clientLoader.hydrate = true as const;


const DraftActionSchema = z.object({
    action: z.enum(['publish', 'saveDraft']),
    article: z.record(z.string(), z.any())
});

export async function action(args: Route.ActionArgs) {
    const db = args.context.get(DbContext);
    const user = args.context.get(AdminContext);

    const body = DraftActionSchema.safeParse(await args.request.json());

    if (body.success) {

        if (body.data.action === "saveDraft") {
            let serializedId = await DraftCookie.parse(args.request.headers.get('cookie')) as string;
            let insert = false;

            if (!serializedId) {
                serializedId = crypto.randomUUID();
                insert = true;
            }

            let slug = body.data.article.root.props?.slug;

            let post = insert ? await db?.table<Partial<Post>>("posts").insert({
                id: serializedId,
                slug: slug,
                article: body.data.article as any,
                authorId: user?.id,
                isDraft: true,
                isPublished: false,
                createdAt: new Date() as any,
            }).run() : await db?.table<Partial<Post>>("posts").get(serializedId).update({
                article: body.data.article,
                updatedAt: new Date() as any,
            }).run();

            let serialized = await DraftCookie.serialize(
                serializedId,
                {
                    maxAge: 60 * 60 * 24 * 365,
                }
            )

            return Response.json(
                {
                    success: true,
                    title: "Saved",
                    message: "Your article was saved as draft."
                }, {
                headers: {
                    'Set-Cookie': serialized
                }
            })
        }

    }
    else {
        return {
            success: false,
            title: "Error",
            message: "The action you submitted was malformed."
        }
    }

}

export function HydrateFallback() {
    return <div className="w-full min-h-dvh p-8 flex flex-col items-center justify-center">
        <h1 className="font-heading text-xl">Loading your editor</h1>
        <p className="mt-2 text-sm">It won't take long. Please wait...</p>
    </div>
}

export default function Home(props: Route.ComponentProps) {

    const initialData = useMemo(() => {
        return props.loaderData.cached;
    }, [props.loaderData.cached]);

    const fetcher = useFetcher<Route.ComponentProps['actionData']>();

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success(
                    fetcher.data.title, {
                    description: <span className="text-on-light text-sm">
                        {fetcher.data.message}
                    </span>
                }
                )
            }
            else {
                toast.error(
                    fetcher.data.title, {
                    description: <span className="text-on-light text-sm">
                        {fetcher.data.message}
                    </span>
                }
                )
            }
        }
    }, [fetcher.data]);

    return (
        <div className="w-full min-h-dvh bg-background text-foreground">
            <title>
                Content Editor - Whitewood
            </title>
            <div className="w-full h-12 bg-card border-b border-border flex items-center px-4 sticky top-0 z-50">
                <NavLink href={`/platform`} className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
                    <ArrowLeft size={14} />
                    Back to platform
                </NavLink>
            </div>
            <ArticleComposer
                data={initialData}
                onPublish={(data) => {
                    localStorage.setItem("article.new", JSON.stringify(data));
                    fetcher.submit({
                        action: "saveDraft",
                        article: data
                    } as any,
                        {
                            encType: "application/json",
                            method: "POST"
                        })
                }}
            />
        </div>
    );
}


function ArticleComposer(props: { data: Partial<Data<EditorComponents>>, onPublish: (data: Data<EditorComponents>) => void; }) {
    return <Puck
        data={props.data}
        config={PuckEditorConfig}
        onPublish={props.onPublish}
    />
}