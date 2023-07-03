import {validate} from "class-validator";

export class ValidationError extends Error {}

export async function validateInstance<T extends object>(instance: T) {
    const errors = await validate(instance, {stopAtFirstError: true, skipMissingProperties: true});
    if (errors.length > 0) {
        throw new ValidationError(errors[0].constraints ? JSON.stringify(errors[0].constraints) : "Validation error");
    }
}
