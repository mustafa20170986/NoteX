import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { BadRequestException } from '@nestjs/common';
import { NotesService } from './notes.service';

describe('note service intigration test', () => {
  let module: TestingModule;
  let prismaService: PrismaService;
  let noteService: NotesService;
  let container: StartedPostgreSqlContainer;

  //configure the starter db in docker
  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('tets-db')
      .withUsername('test-user')
      .withPassword('test-pass')
      .start();
    // get the url
    const dburl = container.getConnectionUri();
    process.env.DATABASE_URL = dburl;

    //run migration
    execSync('npx prisma db push', {
      env: { ...process.env, DATABASE_URL: dburl },
      stdio: 'inherit',
    });
    //creating the snadbox
    module = await Test.createTestingModule({
      providers: [NotesService, PrismaService],
    }).compile();
    noteService = module.get<NotesService>(NotesService);
    prismaService = module.get<PrismaService>(PrismaService);
    //explicit connet with prisma
    await prismaService.$connect();
  }, 60000);
  beforeEach(async () => {
    await prismaService.note.deleteMany();
    await prismaService.user.deleteMany();
  });
  //gracefully connetion and container shutdown
  afterAll(async () => {
    if (module) {
      await module.close().catch(() => {});
    }
    if (prismaService) {
      await prismaService.$disconnect().catch(() => {});
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (container) {
      await container.stop().catch(() => {});
    }
  }, 30000);
  const createuser = async (name = 'test user', email = 'test@example.com') => {
    return prismaService.user.create({
      data: { name, email },
    });
  };
  describe('create note', () => {
    it('should create note with userid', async () => {
      const user = await createuser();
      const note = await noteService.createnote(
        'test note',
        'test content',
        user.id,
      );
      expect(note).toHaveProperty('id');
      expect(note).toMatchObject({
        title: 'test note',
        content: 'test content',
        authorId: user.id,
      });
      expect((note as any).link).toBeDefined();
    });
    it('should return user not found', async () => {
      const result = await noteService.createnote(
        'test note',
        'test content',
        'non exist user',
      );
      expect(result).toEqual({ message: 'suer not found' });
    });
  });
  describe('find notes', () => {
    it('should throw BadRequestException if user not found', async () => {
      await expect(noteService.findnotes('user-not-exist')).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should find the notes', async () => {
      const user = await createuser();
      const note = await prismaService.note.createMany({
        data: [
          {
            title: 'Note 1',
            content: 'Content 1',
            authorId: user.id,
            link: 'NoteX_1',
          },
          {
            title: 'Note 2',
            content: 'Content 2',
            authorId: user.id,
            link: 'NoteX_2',
          },
        ],
      });
      const notes = await noteService.findnotes(user.id);
      expect(notes).toHaveLength(2);
      expect(notes[0]).toHaveProperty('id');
      expect(notes[0]).toHaveProperty('title');
      expect(notes[0]).not.toHaveProperty('content');
    });
  });
  describe('getnoteid', () => {
    it('should get the note', async () => {
      const user = await createuser();
      const note = await prismaService.note.create({
        data: {
          title: 'Specific Note',
          content: 'Detailed Content',
          authorId: user.id,
          link: 'NoteX_spec',
        },
      });
      const findnoteid = await noteService.getnoteid(note.id);
      expect(findnoteid).toEqual({
        title: 'Specific Note',
        content: 'Detailed Content',
      });
    });
    it('should return bad request if user not there', async () => {
      // Pass the pending promise without 'await' to .rejects
      await expect(noteService.findnotes('user not exist')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('edit note', () => {
    it('should retrun the note', async () => {
      const user = await createuser();
      const note = await prismaService.note.create({
        data: {
          title: 'Old Title',
          content: 'Old Content',
          authorId: user.id,
          link: 'NoteX_edit',
        },
      });
      const updtnote = await noteService.editenote(
        note.id,
        'new title',
        'new cont',
      );
      expect(updtnote).toMatchObject({
        id: note.id,
        title: 'new title',
        content: 'new cont',
      });
    });
  });
  describe('delete note', () => {
    it('should delete the note', async () => {
      const user = await createuser();
      const note = await prismaService.note.create({
        data: {
          title: 'Old Title',
          content: 'Old Content',
          authorId: user.id,
          link: 'NoteX_edit',
        },
      });
      const delnote = await noteService.deletenote(note.id);
      const findnote = await prismaService.note.findFirst({
        where: { id: note.id },
      });
      expect(findnote).toBeNull();
    });
  });
});
