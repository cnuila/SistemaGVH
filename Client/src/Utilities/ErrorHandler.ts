import { FirebaseError } from "firebase/app"

type ErrorType = {
    code: string,
    message: string
}

export function getError(error: unknown): ErrorType {
    if (error instanceof FirebaseError) return { code: error.code, message: error.message }
    if (error instanceof Error) return { code: "", message: error.message }
    return { code: "", message: "Error Desconocido"}
}