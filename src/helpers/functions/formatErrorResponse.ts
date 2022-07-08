

export const formatErrorResponse = (errors:string[]) => {
    return {
        success: false,
        errors
    } 
}