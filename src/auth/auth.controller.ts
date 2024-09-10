import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto';
import { RefreshhDto } from './dto/refreshToke.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService){}

	@HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Post('register')
	async register(@Body() dto: AuthDto) {
        return this.AuthService.register(dto)
    }

    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Post('login')
	async login(@Body() data: AuthDto) {
        return this.AuthService.login(data)
    }

    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Post('login/access-token')
	async getNewTokens(@Body() data: RefreshhDto) {
        return this.AuthService.getNewTokens(data)
    }
}
