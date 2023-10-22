import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findOneByUsername(loginDto.username);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.saveRefreshToken(user, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  generateAccessToken(user: User): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(user: User): string {
    const payload = { sub: user.id, isRefreshToken: true };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async saveRefreshToken(user: User, token: string) {
    return await this.userService.saveRefreshToken(user, token);
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    const payload = this.jwtService.verify(refreshToken);
    if (!payload.isRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user: User = await this.userService.findOneById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const storedRefreshToken = await this.userService.findRefreshToken(user);

    if (storedRefreshToken.token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.generateAccessToken(user);
    return accessToken;
  }
}
