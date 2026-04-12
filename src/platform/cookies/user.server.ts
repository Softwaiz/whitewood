import { createCookie } from "./create";

export const UserCookie = createCookie("sysusr", {
    serializeOptions: {
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
    }
});