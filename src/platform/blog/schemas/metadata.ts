import { z } from "zod";

export enum Language {
    fr = "fr",
    en = "en",
}

export enum OgType {
    article = "article",
    website = "website",
    profile = "profile",
    book = "book"
}

export enum TwitterCardType {
    summary = "summary",
    summary_large_image = "summary_large_image",
    app = "app",
    player = "player"
}

export const MetadataSchema = z.object({

    title: z
        .string()
        .min(5, { message: "Title must be at least 5 characters" })
        .max(70, { message: "Title should be less than 70 characters for optimal SEO" }),
    description: z
        .string()
        .min(50, { message: "Description must be at least 50 characters" })
        .max(160, { message: "Description should be less than 160 characters for optimal SEO" }),
    language: z.enum([Language.en, Language.fr]).optional().default(Language.fr),
    keywords: z.string().optional(),
    thumbnailUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),

    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    ogType: z.enum([OgType.article, OgType.website, OgType.profile, OgType.book]).default(OgType.article),

    publishDate: z.date().optional(),
    author: z.string().optional(),
    readingTime: z.string().optional(),
    category: z.string().optional(),
    canonicalUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),

    twitterCard: z.enum([TwitterCardType.summary, TwitterCardType.summary_large_image, TwitterCardType.app, TwitterCardType.player]).default(TwitterCardType.summary_large_image),
    twitterSite: z.string().optional(),

    noIndex: z.boolean().default(false),
    structuredData: z.boolean().default(false),
});

export type ArticleMetadataValues = z.infer<typeof MetadataSchema>