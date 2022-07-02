const Joi=require('joi');
const express=require('express');

const companies=[
  {id:1,name:'company1',email:'comapny1@gmail.com',password:'12345',rate:3.5},
  {id:2,name:'company2',email:'company2@gmail.com',password:'12345',rate:4.8},
  {id:3,name:'company3',email:'company3@gmail.com',password:'12345',rate:5}
];

 const displayProfile = (req,res,next) => {
    
  const company= companies.find(c=>c.id==parseInt(req.params.id));
  if(!company) res.status(404).send('The profile with the given id was not found');
  res.send(company);
}

function validateCompany(company){
  const schema=Joi.object({
      name:Joi.string().min(3).required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

  });
  return schema.validate(company);
}


const editProfileData=(req,res,next)=> {
      const company= companies.find(c=>c.id==parseInt(req.params.id));
      if(!company) return res.status(404).send('The profile with the given id was not found');
  
      const {error}=validateCompany(req.body); //result.error
      if(error){
          //400 bad request
          res.status(400).send(error.details[0].message);
          return;
      }
  company.name=req.body.name;
  company.email=req.body.email;
  res.send(company);
}

module.exports= {displayProfile,editProfileData};

