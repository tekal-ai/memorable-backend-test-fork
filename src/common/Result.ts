import {Logger} from "../logging/Logger";

export class Result<T> {
    public static Success<T>(data: T): Result<T> {
        return new Result<T>(data);
    }

    public static Error<T>(error: string): Result<T> {
        return new Result<T>(undefined, error);
    }

    public static Exception<T>(error: Error): Result<T> {
        return new Result<T>(undefined, error.message);
    }

    private readonly data?: T;
    private readonly error?: string;
    private readonly exception?: Error;
    private logger: Logger;

    private constructor(data?: T, error?: string, exception?: Error) {
        this.data = data;
        this.error = error;
        this.exception = exception;
        this.logger = new Logger();
    }

    public isSuccessful(): boolean {
        return this.data != undefined;
    }

    public getData(): T {
        return this.data as T;
    }

    public getException(): Error | undefined {
        return this.exception;
    }

    public getError(): string {
        return this.error as string;
    }

    public throwIfError(): void {
        if (!this.isSuccessful()) {
            this.logger.error("throwIfError", `error: ${this.getError()}`, this.getException() as Error);
            throw new Error(this.getError());
        }
    }
}
