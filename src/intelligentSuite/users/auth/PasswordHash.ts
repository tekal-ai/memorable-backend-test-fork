import bcrypt from "bcryptjs";

export type HashedPassword = string;

export class PasswordHash {
    hash(password: string): HashedPassword {
        return bcrypt.hashSync(password, 10);
    }

    verify(plain: string, hashed: HashedPassword): boolean {
        return bcrypt.compareSync(plain, hashed);
    }
}
