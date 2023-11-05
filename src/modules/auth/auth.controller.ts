import { Controller, Post, UseGuards, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res): Promise<void> {
    try {
      const token = await this.authService.login(loginDto);
      res.cookie('access_token', token.access_token, { httpOnly: true });
      res.cookie('refresh_token', token.refresh_token, { httpOnly: true });
      return res.send(200);
    } catch (error) {
      return res.send(401).send(error.message);
    }
  }

  @Post('refresh')
  async refresh(@Req() request, @Res() res) {
    const refreshToken: string = request.cookies['refresh_token'];
    const accessToken = await this.authService.getNewAccessToken(refreshToken);
    res.cookie('access_token', accessToken, { httpOnly: true });
    return res.send();
  }
}
