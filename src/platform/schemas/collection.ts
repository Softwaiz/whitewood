import z from "zod/v4";

export const CreateCollectionSchema = z.object({
    label: z.string().min(1, "Label is required").max(100, "Label must be 100 characters or less"),
    description: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
    slug: z.string().min(1, "Slug is required").max(100, "Slug must be 100 characters or less")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

export const UpdateCollectionSchema = z.object({
    label: z.string().min(1, "Label is required").max(100, "Label must be 100 characters or less").optional(),
    description: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
    slug: z.string().min(1, "Slug is required").max(100, "Slug must be 100 characters or less")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
});

export type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;
