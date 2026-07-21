import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockService = {
    createuser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createuser with id, name and email', async () => {
    const body = {
      id: '8210uehfei',
      name: 'suborna',
      email: 'suborna2025@gmail.com',
    };

    const mockResponse = {
      id: '8210uehfei',
      name: 'suborna',
      email: 'suborna2025@gmail.com',
    };

    mockService.createuser.mockResolvedValue(mockResponse);

    const result = await controller.createuser(body);

    expect(service.createuser).toHaveBeenCalledWith(
      '8210uehfei',
      'suborna',
      'suborna2025@gmail.com',
    );
    expect(service.createuser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });
});
