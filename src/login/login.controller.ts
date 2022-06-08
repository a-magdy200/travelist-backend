import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {

  constructor(private readonly LoginService: LoginService) {}

  @Post()
  getLoginMsg(@Body('name') name:string,@Body('password') password:string):string {

    const uname:string= this.LoginService.data.name
    const upass:string= this.LoginService.data.password

    if (name==uname&&password==upass){
        return "Successful Login"
    }
    else{
      return "Your Login has been failed"
    }

  }
}
