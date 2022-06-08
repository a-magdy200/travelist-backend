import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {

  data:{name:string, password:string} = {name:'admin',password: '123456'}

}
