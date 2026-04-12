const dir = `platform`;

/*export default prefix("/platform", [
    layout(
        `${dir}/layouts/base.tsx`,
        [
            layout(
                `${dir}/layouts/protected.tsx`, [
                layout(
                    `${dir}/layouts/default.tsx`,
                    [
                        index(`${dir}/routes/index.tsx`),
                        route("content/:cid", `${dir}/routes/content/index.tsx`),
                        route("users", `${dir}/routes/users/index.tsx`),
                        route("users/new", `${dir}/routes/users/new.tsx`),
                        route("users/:id", `${dir}/routes/users/update.tsx`),
                    ],
                ),

                ...prefix("/content", [
                    route("new", `${dir}/blog/routes/index.tsx`),
                    route("/preview", `${dir}/blog/routes/preview.tsx`),
                    route("/media/upload", `${dir}/blog/routes/cms/media/upload.ts`),
                ]),

                route("content/:cid/edit", `${dir}/routes/content/edit.tsx`)
            ]),
            route("/auth/login", `${dir}/routes/auth/login.tsx`),
            route("/auth/google", `${dir}/routes/auth/google.tsx`),
        ]
    ),
    route("$", `${dir}/routes/not-found.tsx`)
])*/