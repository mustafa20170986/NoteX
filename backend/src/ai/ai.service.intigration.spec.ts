import { AiService } from './ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { TestingModule, Test } from '@nestjs/testing';
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    chats: {
      create: jest.fn().mockReturnValue({
        sendMessage: jest
          .fn()

          .mockResolvedValue({ text: 'Mocked AI summary response' }),
      }),
    },
  })),
}));
describe('Ai service intigration test', () => {
  let container: StartedPostgreSqlContainer;
  let aiservice: AiService;
  let module: TestingModule;
  let prismaService: PrismaService;

  //spin up postgres container before running the test suit
  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('test-db')
      .withUsername('test-user')
      .withPassword('test-pass')
      .start();

    //get the urls
    const dburl = container.getConnectionUri();
    process.env.DATABASE_URL = dburl;
    process.env.GEMINI = 'test-key';
    //run prisma migration against the dynamic container
    execSync('npx prisma db push', {
      env: { ...process.env, DATABASE_URL: dburl },
      stdio: 'inherit',
    });
    //preparing isoated snad box for mini nest app
    module = await Test.createTestingModule({
      providers: [AiService, PrismaService],
    }).compile();

    aiservice = module.get<AiService>(AiService);
    prismaService = module.get<PrismaService>(PrismaService);
    await prismaService.$connect();
  }, 60000);
  afterAll(async () => {
    // 1. Explicitly close the NestJS application context to clean up all providers
    if (module) {
      await module.close().catch(() => {});
    }

    // 2. Disconnect Prisma directly to ensure no dangling connections remain
    if (prismaService) {
      await prismaService.$disconnect().catch(() => {});
    }

    // 3. Clear Node's microtask queue to allow outstanding connection closures to flush out
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 4. Finally, safely stop the Docker container
    if (container) {
      await container.stop({ timeout: 5000 }).catch(() => {});
    }
  }, 30000);

  it('fetch note from the db and trigger ai response', async () => {
    const note = await prismaService.note.create({
      data: {
        id: 'db-note-1',
        title: 'test title',
        content: 'test content',
        author: {
          create: {
            email: 'testuser@example.com',
            name: 'Test User',
            // Add any other required user fields here (e.g. clerkId if applicable)
          },
        },
      },
    });
    const response = await aiservice.getresponse(
      note.id,
      'explain the note',
      note.content,
    );
    expect(response).toBeDefined();
    expect(response?.text).toBe('Mocked AI summary response');
  });
});

//why i added inherit
// why added module then remove const from module redeclaration
// why does the error 57p01 occoured
// how does this code solved this
//why this afterall block ? why extra handlation ?
// why using child process
