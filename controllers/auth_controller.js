const req = require('express/lib/request');
const { sendStatus } = require('express/lib/response');
var jwt = require('jsonwebtoken');
// const User = require('../models/User');

module.exports= {

    login(req, res){
    // should be from db
        const user = { username: 'hadeer', password: '123456'};

        jwt.sign({user},'secretkey',(err,token)=>{
            res.json({
                token
            });
        });
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
