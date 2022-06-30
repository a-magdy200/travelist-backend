const req = require('express/lib/request');
const { sendStatus } = require('express/lib/response');
var jwt = require('jsonwebtoken');

// import {AppDataSource} from "../src/config/database/data-source";
// import {User} from "../src/entities/User.entity";

module.exports= {

    login(req, res, next){

        // from database but not working
        // const user = await AppDataSource.manager.find(User, {
        //     id: 1,
        // })
        // if (req.body.name == user.name && req.body.password == user.password)

        const user = { name: 'hadeer', password: '123456'};
        
        if (req.body.name == user['name'] && req.body.password == user['password']){
            console.log(user.name);
            jwt.sign({user},'secretkey',(err,token)=>{
                res.json({
                    token
                });
            });
        }
        else{
          res.send( "Your Login has been failed");
        }
    },
     
    post(req, res, next){
    
        jwt.verify(req.token, 'secretkey', (err,authData)=>{
            if(err){
                res.sendStatus(403);
            }else{
                res.json({
                    message:"post create",
                    authData
                });
            }
        });
    },
     
    verifyToken(req, res, next){
        const bearerHeader =  req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }else{
            res.sendStatus(403);
        }
    }
}
