import { IdentityProvider } from "../contexts/identity";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "~components/ui/sidebar";
import { Plus } from "lucide-react";
import { LayoutProps, RequestInfo } from "rwsdk/worker";
import { navigate } from "rwsdk/client";
import { db } from "~db/db";
import { redirect } from "~platform/utils/request-context";

export async function loader(args: RequestInfo) {
    /*const drafts = await db.select()
    .from("posts")
    .where("authorId", args.context.get(IdentityProvider)?.user.id)
        .filter({
            authorId: user.id,
            isDraft: true,
        })
        .map((post) => {
            return {
                id: post.getField("id"),
                title: post.getField("article")("root")("props")("title"),
                slug: post.getField("article")("root")("props")("slug")
            }
        }).run() as { id: string; title: string, slug: string }[];

    const published = await db?.table<Post>("posts")
        .filter({
            isDraft: false,
            isPublished: true
        })
        .map((post) => {
            return {
                id: post.getField("id"),
                title: post.getField("article")("root")("props")("title"),
                slug: post.getField("article")("root")("props")("slug")
            }
        }).run() as { id: string; title: string, slug: string }[];

    const unpublished = await db?.table<Post>("posts")
        .filter({
            isDraft: false,
            isPublished: false
        })
        .map((post) => {
            return {
                id: post.getField("id"),
                title: post.getField("article")("root")("props")("title"),
                slug: post.getField("article")("root")("props")("slug")
            }
        }).run() as { id: string; title: string, slug: string }[];

    return {
        user,
        drafts,
        published,
        unpublished
    };*/
}

export default function PlatformLayout(props: LayoutProps<RequestInfo>) {
    const user = props.requestInfo?.ctx.user;

    if(!user) {
        return redirect("/platform/auth/login", { request: props.requestInfo?.request });
    }

    return <IdentityProvider user={user}>
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/platform/users">Users</a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Published posts</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus />
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    /*props.loaderData.published.map((content) => {
                                        return <SidebarMenuItem key={content.id}>
                                            <SidebarMenuButton
                                                className="w-full truncate"
                                                asChild>
                                                <a href={`/platform/content/${content.id}`}>
                                                    {content.title}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    })*/
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>My drafts</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus />
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    /*props.loaderData.drafts.map((content) => {
                                        return <SidebarMenuItem key={content.id}>
                                            <SidebarMenuButton
                                                className="w-full truncate"
                                                asChild>
                                                <a href={`/platform/content/${content.id}`}>
                                                    {content.title}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    })*/
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Unpublished posts</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus />
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    /*props.loaderData.unpublished.map((content) => {
                                        return <SidebarMenuItem key={content.id}>
                                            <SidebarMenuButton
                                                className="w-full truncate"
                                                asChild>
                                                <a href={`/platform/content/${content.id}`}>
                                                    {content.title}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    })*/
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenuButton
                        onClick={() => {
                            navigate(`/platform/user/${props.requestInfo?.ctx.user?.slug || props.requestInfo?.ctx.user?.id}`);
                        }}>{props.requestInfo?.ctx.user?.firstName} {props.requestInfo?.ctx.user?.lastName}</SidebarMenuButton>
                </SidebarFooter>
            </Sidebar>
            <div className="w-full min-h-dvh">
                {props.children}
            </div>
        </SidebarProvider>
    </IdentityProvider>
}
