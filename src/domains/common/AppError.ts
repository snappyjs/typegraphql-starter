import { ErrorCode } from "./ErrorCodes";


export class AppError extends Error {
    public readonly code : ErrorCode;

    constructor(code: ErrorCode, message?: string) {
        super(message);
        this.code = code;
    }
}