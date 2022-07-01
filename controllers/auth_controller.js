import {AppDataSource} from "../src/config/database/data-source";
import {User} from "../src/entities/User.entity";

const req = require('express/lib/request');
const { sendStatus } = require('express/lib/response');
var jwt = require('jsonwebtoken');

module.exports= {

    async register(req, res, next){

        const user = await AppDataSource.manager.insert<User>(User, {
            id:req.body.id,
            name:req.body.name ,
            email: req.body.email ,
            password: req.body.password
        });

        console.log(user);

        await AppDataSource.manager.save(user)

        // const name= req.body.name ;
        // const mail= req.body.email;
        // const pass= req.body.password;

        // const user = {
        //                 name:name,
        //                 email:  mail,
        //                 password: pass,
        //             };
        res.send({
            user
        });
      
    },

    async login(req, res, next){
        // email
        const requiredName= req.body.name;
        console.log(requiredName);
        let user = await AppDataSource.manager.find(User, {
            name:requiredName,
        });

        console.log(user[0].name);
        console.log('/////////////////////');
        if (req.body.name == user[0].name && req.body.password == user[0].password){

            jwt.sign({user},'secretkey',(err,token)=>{
                res.json({
                    token
                });
            });
        }
        else{
        //   res.send( "Your Login has been failed");
          res.sendStatus(404);
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
