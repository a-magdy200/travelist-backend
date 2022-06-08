import { Controller, Get, Post ,Body} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from"./dto";

@Controller('auth')
export class AuthController{

    constructor(private authService:AuthService) {}

    @Post('login')
    login(@Body() dto:AuthDto )
    {
        return this.authService.login(dto);
    }

}