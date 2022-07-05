import { Program } from "../../src/entities/Program.entity"
import { Company } from "../../src/entities/Company.entity"
import { Hotel } from "../../src/entities/Hotel.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"
import { In } from "typeorm" 
import { Transportation } from "../../src/entities/Transportation.entity"

export const create=async (req: Request, res: Response)=> {
    ///console.log(req)
   // const formData=req.body;
    console.log(req.body)

   const program = await AppDataSource.manager.create<Program>(Program,
    {
        name:req.body.name,
        description:req.body.description,
        cover_picture:req.body.cover_picture, 
        price:parseInt(req.body.price),
        is_Recurring:req.body.is_Recurring,
    }
    );
   console.log(req.body.name);
   console.log(req.body.hotels);
   req.body.hotels+=req.body.hotels?.map(parseInt);
  // req.body.hotels = req.body.hotels.map(str:string => {
   // return +str;
  //});
   console.log(req.body.hotels)
   const loadedHotels = await AppDataSource.manager.findBy(Hotel, { id: In(req.body.hotels), }) 
   const company = await AppDataSource.getRepository(Company).findOneBy({ id: parseInt(req.body.companyId), }) 
   const transportation = await AppDataSource.getRepository(Transportation).findOneBy({ id: 1, }) 

   program.hotels=loadedHotels;
   if(company && transportation)
  {
     program.company=company;
     program.transportation=transportation;

  }   

   await AppDataSource.manager.save(program);
   res.json({
      success: true,
      data: program,
    });   
}
