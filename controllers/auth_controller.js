const req = require('express/lib/request');
const { sendStatus } = require('express/lib/response');
var jwt = require('jsonwebtoken');

// import {AppDataSource} from "../src/config/database/data-source";
// import {User} from "../src/entities/User.entity";

module.exports= {

    register(req, res, next){

        // from database but not working

        // const user = await AppDataSource.manager.insert<User>(User, {
        //     username:req.body.name ,
        //     email: req.body.email ,
        //     password: req.body.password
        // });

        // AppDataSource.manager.save(user);

        const name= req.body.name ;
        const mail= req.body.email;
        const pass= req.body.password;

        const user = {
                        username:name,
                        email:  mail,
                        password: pass,
                    };
        res.send({
            user
        });
      
    },

    login(req, res, next){

        // from database but not working
        
        // const user = await AppDataSource.manager.find(User, {
        //     id: 1,
        // });

        const user = { name: 'hadeer', password: '123456'};
       
        if (req.body.name == user['name'] && req.body.password == user['password']){

            console.log(req.body.name);
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
