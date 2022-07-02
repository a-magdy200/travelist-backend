import jwt from 'jsonwebtoken';

const isAuthenticated = async ( 
    req: {headers: {[x:string]:any;}; token?:any }, 
    res: {sendStatus: (arg0:number) => void;}, 
    next: () => void ) => {

        jwt.verify(req.token, 'secretkey', (err:any, authData:any)=>{
            if(err){
                
                // console.log('isAuthenticated: no');
                res.sendStatus(403);
            }else{

                // console.log('isAuthenticated: yes');
                next();
            }
        });
}

export {
    isAuthenticated,
}


