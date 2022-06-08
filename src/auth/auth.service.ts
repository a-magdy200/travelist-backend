import { Injectable } from "@nestjs/common";
import { AuthDto } from"./dto";

@Injectable()
export class AuthService {
  constructor(){}

  login(dto:AuthDto){
    if(dto.name==='admin'&& dto.password==="1234")
       return "success";
    else
       return "fail";


  }
}
   