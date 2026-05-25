import { index, layout, prefix, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { setCommonHeaders } from "~/headers";
import { Home } from "~/pages/home";
import PublicArticlePage from "~/pages/article";
import { PublicDocument } from "~/public/document";
import PublicMediaObject from "~/routes/media";
import SitemapRoute from "~/routes/sitemap";
import { PlatformDocument } from "~platform/document";
import ProtectedLayout from "./platform/layouts/protected";
import { loadCurrentUser } from "./platform/middleware/auth";
import PlatformLogin from "./platform/routes/auth/login";
import { handleAccessCodeReturn } from "./platform/routes/auth/google";
import PlatformRegister from "./platform/routes/auth/register";
import PlatformArticles from "./platform/routes/articles";
import PlatformContentDetail from "./platform/routes/content/index";
import PlatformMediaUpload from "./platform/routes/content/media/upload";
import PlatformNewArticle from "./platform/routes/content/new";
import PlatformEditArticle from "./platform/routes/content/edit";
import PlatformIndex from "./platform/routes/index";
import PlatformSetup from "./platform/routes/setup";
import PlatformUsers from "./platform/routes/users/index";
import PlatformNewUser from "./platform/routes/users/new";
import PlatformUpdateUser from "./platform/routes/users/update";
import PlatformCollections from "./platform/routes/collections/index";
import PlatformNewCollection from "./platform/routes/collections/new";
import { User } from "./db/schema";

export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

export type AppContext = {
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  (request) => {
    // setup ctx here
    request.ctx.user = null;
  },
  loadCurrentUser,
  render(PublicDocument, [
    route("/", Home),
    route("/sitemap.xml", SitemapRoute),
    route("/media/:key", PublicMediaObject),
    route("/:slug", PublicArticlePage),
  ]),
  render(PlatformDocument, [
    prefix("/platform", [
      route("/setup", PlatformSetup),
      route("/auth/login", PlatformLogin),
      route("/auth/google", handleAccessCodeReturn),
      route("/auth/register", PlatformRegister),
      ...layout(ProtectedLayout, [
        route("/", PlatformIndex),
        route("/articles", PlatformArticles),
        prefix("/content", [
          route("/media/upload", PlatformMediaUpload),
          route("/new", PlatformNewArticle),
          prefix("/:cid", [
            index(PlatformContentDetail),
            route("/edit", PlatformEditArticle),
          ]),
        ]),
        route("/users", PlatformUsers),
        route("/users/new", PlatformNewUser),
        route("/users/:uid/update", PlatformUpdateUser),
        route("/collections", PlatformCollections),
        route("/collections/new", PlatformNewCollection),
      ]),
    ])
  ])
]);
