import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserController } from './user.controller';

describe('UserService', () => {
  let userController: UserController;
  let mockUserRepo;
  const createdDate = new Date();
  const updatedDate = new Date();
  const mockUsersDb: User[] = [
    {
      id: 1,
      username: 'test',
      password: 'test',
      createdAt: createdDate,
      updatedAt: updatedDate,
    },
  ];

  beforeEach(async () => {
    mockUserRepo = {
      find: jest.fn().mockReturnValue(mockUsersDb),
      save: jest.fn().mockImplementation((user: CreateUserDto) => {
        return {
          id: 1,
          username: user.username,
          password: user.password,
          createdAt: createdDate,
          updatedAt: updatedDate,
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        UserController,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
      };

      const expected: User = {
        id: 1,
        username: 'test',
        password: 'test',
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      const result: User = await userController.create(createUserDto);
      expect(result).toEqual(expected);
      expect(mockUserRepo.save).toHaveBeenCalledWith(createUserDto);
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userController.findAll();
      expect(result).toEqual(mockUsersDb);
      expect(mockUserRepo.find).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
