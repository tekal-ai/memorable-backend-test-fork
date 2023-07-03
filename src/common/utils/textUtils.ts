import {BadRequestError} from "../errors/BadRequestError";
import {ErrorMsg} from "../errors/ErrorCode";

export function capitalize(text: string): string {
    if (!text || !text.length) return text;

    const lowercased = text.toLocaleLowerCase();

    return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

export function sanitazeString(text: string): string {
    const regex = /^[A-Za-z0-9_+-]*$/;
    if (!regex.test(text)) {
        throw new BadRequestError(ErrorMsg.FIELD_STRING_INVALID);
    }
    return text;
}
