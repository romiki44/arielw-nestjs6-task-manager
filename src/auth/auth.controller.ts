import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentilasDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentilasDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentilasDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.singIn(authCredentilasDto);
  }

  // len priklad
  @Post('/test')
  @UseGuards(AuthGuard())
  // test(@Req() req) {
  //   console.log(req);
  // }
  test(@GetUser() user: User) {
    console.log(user);
  }
}
