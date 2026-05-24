import { db } from "~db/db";
import { Organization, organizations } from "~db/schema";
import { eq } from "drizzle-orm";

export class OrganizationResolver {

    static instance() {
        if (!globalThis.organizationResolver) {
            globalThis.organizationResolver = new OrganizationResolver();
        }
        return globalThis.organizationResolver;
    }

    async getOrganization(orgId: string) {
        const [org] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, orgId))
            .limit(1)
            .execute();

        return org;
    }

    async createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) {
        const date = new Date().toISOString();
        const [org] = await db
            .insert(organizations)
            .values({
                ...data,
                createdAt: date,
                updatedAt: date,
            })
            .returning()
            .execute();

        return org;
    }
}
