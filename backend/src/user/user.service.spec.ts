import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { clerkMiddleware } from '@clerk/express'; // Ensure this matches your package
import { AppModule } from '../app.module'; // Or your target module

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

    it('should return undefined if the user already exists', async () => {
      const existuser = { id: 'aauduw', name: 'jcaod', email: 'uefhoqjd' };
      mockPrismaService.user.findUnique.mockResolvedValue(existuser);

      const result = await service.createuser('jcaod', 'uefhoqjd');

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  // ==========================================================
  // SECTION 2: INTEGRATION TESTS (Hits your real Neon Test DB!)
  // ==========================================================
  describe('UserController (Integration with Neon DB)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [UserModule, PrismaModule], // Real UserModule containing your real controllers, services, and real PrismaService
      })
        .overrideGuard(AuthGuard)
        .useValue({
          canActivate: (context: ExecutionContext) => {
            const req = context.switchToHttp().getRequest();
            // Mock a basic clerk user on the request object so the controller has access to it if needed
            req.auth = { userId: 'mock-clerk-user-id' };
            return true;
          },
        })
        .compile();

      app = moduleFixture.createNestApplication();
      await app.init(); // Starts the HTTP environment

      const expressApp = app.getHttpAdapter().getInstance();
      expressApp.use(clerkMiddleware());

      prisma = moduleFixture.get<PrismaService>(PrismaService);

      // 🧹 CRITICAL: Clear out the users table in your Neon Test DB before each test
      // This guarantees your tests always start with a clean slate
      await prisma.user.deleteMany({});
    });

    afterEach(async () => {
      await app.close(); // Tear down the test application server
    });

    it('POST /user/createuser -> should successfully write a new user directly to Neon DB', async () => {
      const payload = { name: 'despacito', email: 'susuki2025@gmail.com' };

      // Act: Perform a real HTTP POST request
      const response = await supertest(app.getHttpServer())
        .post('/user/createuser')
        .send(payload);

      // Assert: Verify the HTTP response layer
      expect(response.status).toBe(201);
      expect(response.body.email).toBe('hirohito2025@gmail.com');
      expect(response.body.id).toBeDefined();

      // Verification: Directly query your real Neon DB to verify the record was saved!
      const savedUserInNeon = await prisma.user.findUnique({
        where: { email: 'herohito2025@gmail.com' },
      });

      expect(savedUserInNeon).toBeDefined();
      expect(savedUserInNeon.name).toBe('herohito');
    });
  });
});
