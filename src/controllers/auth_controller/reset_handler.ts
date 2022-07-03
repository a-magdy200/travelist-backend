
const resetPassword = async (
    req: {body: {name:string; password:string;};},
    res: {sendStatus: (arg0:number) => void;},
    next: any) => {

        console.log("reset password function");
}

export {
    resetPassword,
}