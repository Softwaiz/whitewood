import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from 'drizzle-orm';

let counter = 0;
function createId(): string {
    const timestamp = Date.now().toString(36);
    counter = (counter + 1) % 1296;
    const count = counter.toString(36).padStart(2, '0');

    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    const random = Array.from(array).map(b => b.toString(36)).join('').slice(0, 14);

    return `c${timestamp}${count}${random}`.slice(0, 25);
}

export const organizations = sqliteTable('organizations', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    label: text('label').notNull(),
    description: text('description'),
    image: text('image'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now', 'localtime'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now', 'localtime'))`),
});

export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull().unique(),
    password: text("password").notNull(),
    googleAuthEmail: text("google_auth_email").unique(),
    googleAuthId: text("google_auth_id").unique(),
    role: text('role').notNull().default('member'),
    organizationId: text('organization_id').references(() => organizations.id),
    slug: text('slug').notNull().unique(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now', 'localtime'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now', 'localtime'))`),
});

export const collections = sqliteTable('collections', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    label: text('label').notNull(),
    description: text('description'),
    slug: text('slug').notNull().unique(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    createdAt: text('created_at').notNull().default(sql`(datetime('now', 'localtime'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now', 'localtime'))`),
});

export const postCollections = sqliteTable('post_collections', {
    postId: text('post_id').notNull().references(() => posts.id),
    collectionId: text('collection_id').notNull().references(() => collections.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.postId, table.collectionId] }),
}));

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text("description").notNull(),
    language: text("language").default('fr-FR'),
    keywords: text("keywords").default("[]"),
    content: text('content').notNull(),
    slug: text('slug').notNull().unique(),
    published: integer("is_published").notNull().default(0),
    authorId: text('author_id').notNull().references(() => users.id),
    createdAt: text('created_at').notNull().default(sql`(datetime('now', 'localtime'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now', 'localtime'))`),
});

export type Organization = typeof organizations.$inferSelect;
export type OrganizationInsert = typeof organizations.$inferInsert;

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type Collection = typeof collections.$inferSelect;
export type CollectionInsert = typeof collections.$inferInsert;

export type PostCollection = typeof postCollections.$inferSelect;
export type PostCollectionInsert = typeof postCollections.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;
