import { Program } from "../../src/entities/Program.entity"
import { Company } from "../../src/entities/Company.entity"
import { Hotel } from "../../src/entities/Hotel.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"
import { In } from "typeorm" 

export const create=async (req: Request, res: Response)=> {
    ///console.log(req)
    console.log(req.body)

   const program = await AppDataSource.manager.create<Program>(Program,
    {
        name:req.body.name,
        description:req.body.description,
        cover_picture:req.body.cover_picture, 
        price:+req.body.price,
        is_Recurring:req.body.is_Recurring,
    }
    );
 //  console.log(req.body.hotels);
  // req.body.hotels=req.body.hotels.map(Number);
   const loadedHotels = await AppDataSource.manager.findBy(Hotel, { id: In(req.body.hotels.map(Number)), }) 
   const company = await AppDataSource.getRepository(Company).findOneBy({ id: +req.body.companyId, }) 
   program.hotels=loadedHotels;
   if(company)
  {
     program.company=company;
  }   

   await AppDataSource.manager.save(program);
   res.json({
      success: true,
      data: program,
    });   
}
