import { Program } from "../../src/entities/Program.entity"
import { Hotel } from "../../src/entities/Hotel.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"

export const create=async (req: Request, res: Response)=> {
    //console.log(req)
    console.log(req.body)

    const program = await AppDataSource.manager.create<Program>(Program,req.body);
   // const hotel = new Hotel()
   // hotel.name = req.body.hotel
   // await AppDataSource.manager.save(hotel)

  //  program.hotels=[req.body.hotel];
    //await program.save();
  //  await AppDataSource.manager.save(program);
  //const programRepository = AppDataSource.getRepository(Program)
  //const program = await programRepository.create(req.body);
  const entity = { ...program, hotels: req.body.hotels } // you have to add the association roles here 

  const save_program = await AppDataSource.manager.save(entity);

    res.json(save_program);
   
}
