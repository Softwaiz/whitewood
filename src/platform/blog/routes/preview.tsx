import { Render } from "@puckeditor/core";
import { PuckEditorConfig } from "../components/blocks/config";
import { type Post } from "../../../@types";
import { RequestInfo } from "rwsdk/worker";

export async function loader(args: RequestInfo) {
    const db = args.context.get(DbContext);
    const user = args.context.get(AdminContext);
    const draftId = await DraftCookie.parse(args.request.headers.get('cookie')) as string;

    if (draftId) {
        let draft = (await db?.table<Post>("posts").get(draftId).run());
        return {
            draft: draft || undefined
        }
    }
    else {
        let draft = (await db?.table<Post>("posts").filter({ isDraft: true, authorId: user?.id }).orderBy("createdAt").limit(1).run())?.at(0);
        if (draft) {
            return {
                draft: draft
            }
        }
        else {
            return redirect("/platform/blog");
        }
    }
}

export default function PreviewPage(props: RequestInfo) {
    if (!props.loaderData.draft) {
        return <></>
    }

    return <div className="w-full">
        {/*<Header />
        <hr />
        <main className="min-h-dvh container mx-auto mt-4 mb-8">
            <Render
                data={props.loaderData.draft?.article}
                config={PuckEditorConfig} />
        </main>
        <hr />
        <Footer />*/}
    </div>
}