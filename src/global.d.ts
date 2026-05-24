import { PostResolver } from "~platform/@resolvers/post";
import { OrganizationResolver } from "~platform/@resolvers/organization";
import { UserResolver } from "~platform/@resolvers/user";

declare global {

    var postResolver: PostResolver;
    var organizationResolver: OrganizationResolver;
    var userResolver: UserResolver;

}