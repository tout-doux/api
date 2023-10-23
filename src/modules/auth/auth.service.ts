import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument> {
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

  generateAccessToken(user: UserDocument): string {
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(user: UserDocument): string {
    const payload = { sub: user._id, isRefreshToken: true };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    const payload = this.jwtService.verify(refreshToken);
    if (!payload.isRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user: UserDocument = await this.userService.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const storedRefreshToken = await this.findRefreshToken(user);

    if (storedRefreshToken.token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.generateAccessToken(user);
    return accessToken;
  }

  async findRefreshToken(user: UserDocument): Promise<RefreshTokenDocument> {
    return this.refreshTokenModel.findOne({
      user: user._id,
    });
  }

  async saveRefreshToken(user: UserDocument, token: string): Promise<void> {
    let refreshToken = await this.findRefreshToken(user);
    if (refreshToken) {
      refreshToken.token = token;
    } else {
      refreshToken = new this.refreshTokenModel({
        user: user._id,
        token: token,
      });
    }
    await refreshToken.save();
  }
}
