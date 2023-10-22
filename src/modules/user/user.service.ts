import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(createUserDto.password, salt);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username: username } });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async saveRefreshToken(user: User, token: string): Promise<void> {
    let refreshToken = await this.findRefreshToken(user);
    if (refreshToken) {
      refreshToken.token = token;
    } else {
      refreshToken = this.refreshTokenRepository.create({
        user,
        token,
      });
    }
    await this.refreshTokenRepository.save(refreshToken);
  }

  async findRefreshToken(user: User): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async findAllRefreshTokens(): Promise<RefreshToken[]> {
    return this.refreshTokenRepository.find({ relations: ['user'] });
  }
}
