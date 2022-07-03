// const Joi=require('joi');
// const express=require('express');
import e, { RequestHandler } from "express";
import { Company } from "../entities/Company.entity";
import { AppDataSource } from "../config/database/data-source";
export const displayAllCompanies: RequestHandler = async (req, res, next) => {
  const companies = await AppDataSource.getRepository(Company).find();
  res.json(companies);
  console.log("get all employees");
};
export const displayByCompany: RequestHandler = async (req, res) => {
  const results = await AppDataSource.getRepository(Company).findOneBy({
    id: parseInt(req.params.id),
  });
  // if(!results) res.status(404).send('The Company with the given id was not found');
  res.send(results);
};
export const editCompanyData: RequestHandler = async (req, res) => {
  const user = await AppDataSource.getRepository(Company).findOneBy({
    id: parseInt(req.params.id),
  });
  if (user?.id) {
    Company.merge(user, req.body);
    const results = await AppDataSource.getRepository(Company).update(user.id,user);
    res.send('Company updated successfully');
  } else {
    console.log("no user found");
  }
};


export const updatePassword: RequestHandler = async (req, res) => {
  const company = await AppDataSource.getRepository(Company).findOneBy({
    id: parseInt(req.params.id),
  });
  if (company?.id) {
    Company.merge(company.password, req.body.password);
    const results = await AppDataSource.getRepository(Company).update(company.id,company);
    res.send('Company updated successfully');
  } else {
    console.log("no user found");
  }
};

