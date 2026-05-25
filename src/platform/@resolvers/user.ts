import { db } from "~db/db";
import { User, users } from "~db/schema";
import { and, count, eq } from "drizzle-orm";

export class UserResolver {

    static instance() {
        if (!globalThis.userResolver) {
            globalThis.userResolver = new UserResolver();
        }
        return globalThis.userResolver;
    }

    async getUser(userId: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)
            .execute();

        return user;
    }

    async getUserByEmail(email: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        return user;
    }

    async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
        const date = new Date().toISOString();
        const [user] = await db
            .insert(users)
            .values({
                ...data,
                createdAt: date,
                updatedAt: date,
            })
            .returning()
            .execute();

        return user;
    }

    async countUsers() {
        const [result] = await db
            .select({ value: count() })
            .from(users)
            .execute();

        return result?.value ?? 0;
    }

    async getUsers() {
        const usersList = await db
            .select()
            .from(users)
            .execute();

        return usersList;
    }

    async updateUser(userId: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
        const [user] = await db
            .update(users)
            .set({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(users.id, userId))
            .returning()
            .execute();

        return user;
    }
}
