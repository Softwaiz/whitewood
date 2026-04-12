import * as cookie from "cookie";

interface CreateCookieOptions {
    parseOptions?: cookie.ParseOptions;
    serializeOptions?: cookie.SerializeOptions;
}

export function createCookie(name: string, options?: CreateCookieOptions) {
    const cookieOptions = options || {};
    return {
        parseHeaders: (headers: Headers) => {
            const cookieHeader = headers.get("Cookie");
            if (!cookieHeader) return null;
            const cookies = cookie.parse(cookieHeader, cookieOptions.parseOptions);
            return cookies[name];
        },
        parseRequest: (request: Request) => {
            const cookieHeader = request.headers.get("Cookie");
            if (!cookieHeader) return null;
            const cookies = cookie.parse(cookieHeader, cookieOptions.parseOptions);
            return cookies[name];
        },
        serialize: (value: string, options?: cookie.SerializeOptions) => {
            let extendedOptions = {
                ...cookieOptions.serializeOptions,
                ...options,
            }
            return cookie.serialize(name, value, extendedOptions);
        }
    }
}