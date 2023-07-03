export class PasswordGenerator {
    generate(password?: string) {
        return password || Math.random().toString(36).slice(-8);
    }
}
