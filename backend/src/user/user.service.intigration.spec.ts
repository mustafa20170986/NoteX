import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { BadRequestException } from '@nestjs/common';

describe(' user service intigration test', () => {
  let module: TestingModule;
  let container: StartedPostgreSqlContainer;
  let prismaService: PrismaService;
  let userService: UserService;

  //spin up postgres conatienr inside docker
  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('test-db')
      .withUsername('test-username')
      .withPassword('test-pass')
      .start();
    //get the connection url
    const dburl = container.getConnectionUri();
    process.env.DATABASE_URL = dburl;
    //prisma migrate
    execSync('npx prisma db push', {
      env: { ...process.env, DATABASE_URL: dburl },
      stdio: 'inherit',
    });
    //preparing the snad box
    module = await Test.createTestingModule({
      providers: [PrismaService, UserService],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    await prismaService.$connect();
  }, 60000);
  beforeEach(async () => {
    await prismaService.note.deleteMany().catch(() => {});
    await prismaService.user.deleteMany().catch(() => {});
  });
  afterAll(async () => {
    if (module) {
      await module.close().catch(() => {});
    }
    if (prismaService) {
      await prismaService.$disconnect().catch(() => {});
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (container) {
      await container.stop({ timeout: 5000 }).catch(() => {});
    }
  }, 30000);
  describe('create user', () => {
    it('this should create new user', async () => {
      const user = await userService.createuser(
        'jhon doe-123',
        'jhon-doe',
        'jhon@69.com',
      );
      expect(user).toMatchObject({
        id: 'jhon doe-123',
        name: 'jhon-doe',
        email: 'jhon@69.com',
      });
    });
    it('should throw bad request', async () => {
      await expect(
        userService.createuser('user-123', 'jhon doew', ''),
      ).rejects.toThrow(BadRequestException);
    });
    it('should prevent user with dupli email', async () => {
      await userService.createuser('emu-2017', 'emu', 'emu2017@gmail.com');
      const trydupes = await userService.createuser(
        'sbrn-2025',
        'sbrn',
        'emu2017@gmail.com',
      );
      expect(trydupes).toBeUndefined();
    });
    it('should allow user with diferent emails', async () => {
      const firstuser = await userService.createuser(
        'emu-2017',
        'emu',
        'emu2017@gmail.com',
      );
      const seconduser = await userService.createuser(
        'sbrn-2025',
        'sbrn',
        'sbrn2025@gmail.com',
      );
      expect(seconduser).toBeDefined();
      expect(firstuser).toBeDefined();
    });
  });
});
