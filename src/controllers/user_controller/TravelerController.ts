import { RequestHandler } from "express";
import { Traveler } from "../../entities/Traveler.entity";
import {Request, Response} from 'express';
import {AppDataSource} from "../../config/database/data-source";
import {NotFoundResponse} from "../../helpers/responses/404.response";
//import {userValidation} from "../../helpers/validations/user.validation";
import {formatValidationErrors} from "../../helpers/functions/formatValidationErrors";
import {UPLOAD_DIRECTORY} from "../../helpers/constants/directories";
import {unlinkSync} from "fs";

const viewUserProfile: RequestHandler = async (req:Request, res:Response) => {
  const traveler = await AppDataSource.getRepository(Traveler).findOne({
    where: {
      id: parseInt(req.params.id)
    },
    relations: {
      user: true,

    },
  });

  const userFromToken = {
    id: 1,
  };
  let returnvalue;
  if (traveler?.id == userFromToken.id) {
    // view my profile as user
    returnvalue = {    
      name:"",
      email:"",
      address:"",
      profile_picture:"",
      
    };
  }
  // view other friend profile
  else if (traveler?.user.id == userFromToken.id){
    returnvalue = {
      name:"",
      email:"",
      address:"",
    };
  }
  else {
    returnvalue = {
      name:"",
      profile_picture:"",
    };
  }
  res.send(returnvalue);
};
 const editUserProfile: RequestHandler = async (req, res) => {
  const user = await AppDataSource.getRepository(Traveler).findOneBy({
    id: parseInt(req.params.id),
  });
  if (user?.id) {
    Traveler.merge(user, req.body);
    const results = await AppDataSource.getRepository(Traveler).update(
      user.id,
      user
    );
    res.send("Company updated successfully");
  } else {
    console.log("no user found");
  }
};
  // const uploadProfilePicture = async (req: Request, res: Response) => {
  //   const id: number | undefined = +req.params.id;
  //   const user: User | null = await AppDataSource.manager.findOneBy<User>(User, {
  //     id
  //   });
  //   if (user && req.file?.filename) {
  //     // Remove `uploads/` from path string
  //     const oldCoverPicture = user.profile_picture;
  //     if (oldCoverPicture && oldCoverPicture !== '') {
  //       await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`);
  //     }
  //     const path = `${req.file.destination}${req.file.filename}`.replace(UPLOAD_DIRECTORY, '');
  //     user.profile_picture = path;
  //     await user.save();
  //     res.json({
  //       success: true,
  //       path
  //     });
  //   } else {
  //     res.json(NotFoundResponse);
  //   }
  // }
   export {viewUserProfile,editUserProfile}