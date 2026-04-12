import type { Data } from "@puckeditor/core";
import type { EditorComponents } from "../platform/blog/components/blocks/config";
import type { RootComponentProps } from "~platform/blog/components/blocks/root";

export interface OrgMember {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    role: string;
    telegramAccountId?: number;
    createdAt: string;
    pictureUrl?: string;
    googleAuthEmail?: string;
    bio?: string;
    genesis?: boolean;
}

export interface Post {
    id: string;
    slug: string;
    article: Data<EditorComponents, Omit<RootComponentProps, 'children'>>;
    authorId: string;
    publisherId: string;
    isDraft: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt?: string;
    publishedAt?: string;
    unpublishedAt?: string;
}