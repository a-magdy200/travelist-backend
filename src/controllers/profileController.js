//const Joi=require('joi');
const express=require('express');



 displayProfile(req,res,next){
    const companies=[
        {id:1,name:'company1',email:'comapny1@gmail.com',password:'12345',rate:3.5},
        {id:2,name:'company2',email:'company2@gmail.com',password:'12345',rate:4.8},
        {id:3,name:'company3',email:'company3@gmail.com',password:'12345',rate:5}
    ];
  const company= companies.find(c=>c.id==parseInt(req.params.id));
  if(!company) res.status(404).send('The profile with the given id was not found');
  res.send(company);
}
module.exports=displayProfile;