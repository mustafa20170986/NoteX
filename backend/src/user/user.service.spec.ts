import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('User Module', () => {
  // ==========================================================
  // SECTION 1: UNIT TESTS (Fast, uses Mocks)
  // ==========================================================
  describe('UserService (Unit Tests)', () => {
    let service: UserService;
    let prisma: PrismaService;

    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
        ],
      }).compile();

      service = module.get<UserService>(UserService);
      prisma = module.get<PrismaService>(PrismaService);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return undefined if the user already exists', async () => {
      const existingUser = {
        id: 'aauduw',
        name: 'jcaod',
        email: 'uefhoqjd@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      const result = await service.createuser(
        'aauduw',
        'jcaod',
        'uefhoqjd@example.com',
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'uefhoqjd@example.com' },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should create a new user if email does not exist', async () => {
      const newUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(newUser);

      const result = await service.createuser(
        'user-123',
        'John Doe',
        'john@example.com',
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      });
      expect(result).toEqual(newUser);
    });

    it('should throw BadRequestException if email is missing', async () => {
      await expect(
        service.createuser('user-123', 'John Doe', ''),
      ).rejects.toThrow('email is msising');
    });
  });

  // ==========================================================
  // SECTION 2: INTEGRATION TESTS
  // Skipped in unit CI runs (Neon / real DB)
  // ==========================================================
  describe.skip('UserController (Integration with Neon DB)', () => {
    // Keep your integration code here if you want,
    // but it will be skipped during normal unit test runs.
  });
});
