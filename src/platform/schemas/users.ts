import z from "zod/v4";

export const CreateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["member", "editor"]),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
