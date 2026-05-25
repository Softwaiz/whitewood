import type { RequestInfo } from "rwsdk/worker";
import { PostResolver } from "~platform/@resolvers/post";
import { CollectionResolver } from "~platform/@resolvers/collection";
import PlatformArticlesContent from "./articles.content";

export default async function PlatformArticles(props: RequestInfo) {
    const totalArticles = await PostResolver.instance().countPosts();
    const publishedArticles = await PostResolver.instance().countPosts({ published: 1 });
    const articles = await PostResolver.instance().getPosts({
        orderBy: 'updatedAt',
        orderDir: 'desc',
    });

    const postIds = articles.map(a => a.id);
    const collectionsByPost = await CollectionResolver.instance().getCollectionsByPostIds(postIds);

    const draftArticles = Math.max(totalArticles - publishedArticles, 0);
    const publicationRate = totalArticles > 0
        ? Math.round((publishedArticles / totalArticles) * 100)
        : 0;

    return (
        <PlatformArticlesContent
            totalArticles={totalArticles}
            publishedArticles={publishedArticles}
            draftArticles={draftArticles}
            publicationRate={publicationRate}
            articles={articles}
            collectionsByPost={collectionsByPost}
        />
    );
}
