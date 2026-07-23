import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  //we took the userService
  let service: UserService;

  //mock prisma function create
  const mockService = {
    //its the ethod in the servivce part
    // which is responsible for creating new user
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

  it('it should run and called the body paylaod with parameter', async () => {
    const body = { name: 'suborna', email: 'suborna2025@gmail.com' };
    const mockrespone: User = {
      id: '8210uehfei',
      name: 'suborna',
      email: 'suborna2025@gmail.com',
    };
    //execute the method
    mockService.createuser.mockResolvedValue(mockrespone);
    const result = await controller.createuser(body);
    //expect the calls
    //we expect the create user to called with our input data
    expect(service.createuser).toHaveBeenCalledWith(
      'suborna',
      'suborna2025@gmail.com',
    );
    //expect to have calle dthis exact one
    expect(service.createuser).toHaveBeenCalledTimes(1);
    // expect to get the response equal to mock response
    expect(result).toEqual(mockrespone);
  });
});
