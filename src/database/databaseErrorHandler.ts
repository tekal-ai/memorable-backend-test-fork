import {BaseError} from "../common/errors/BaseError";
import {RepositoryError} from "./databaseException";

export async function handleException<T>(promise: Promise<T>, module: string, method: string): Promise<T> {
    return await promise.catch((error) => {
        if (error instanceof BaseError) throw error;
        else throw new RepositoryError(error as Error, module, method);
    });
}
