import z from "zod/v4";

export const SetupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
    organizationLabel: z.string().min(1, "Organization label is required"),
    organizationDescription: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
    organizationImage: z.string().url("Image must be a valid URL").optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type SetupInput = z.infer<typeof SetupSchema>;
