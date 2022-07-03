
const verifyCode = async (
    req: {body: {name:string; password:string;};},
    res: {sendStatus: (arg0:number) => void;},
    next: any) => {

        console.log("verify code function");

}

export {
    verifyCode,
}