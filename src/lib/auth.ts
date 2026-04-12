import * as bcrypt from "bcryptjs";

export async function hashPassword(password: string, workFactor: number = 12): Promise<string> {
    return bcrypt.hash(password, workFactor);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
