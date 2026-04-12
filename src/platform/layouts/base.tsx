import { UserCookie } from "../cookies/user.server";
import type { OrgMember } from "../../@types";
import { LayoutProps, RequestInfo } from "rwsdk/worker";

const identifyUser = async (args: RequestInfo) => {
    const adminUserId = await UserCookie.parseRequest(args.request);
    return
}

export default function BasePlatformLayout(props: LayoutProps<RequestInfo>) {
    return <>
        {props.children}
    </>
}