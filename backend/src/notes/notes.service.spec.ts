import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('NotesService', () => {
  let service: NotesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
    },
    note: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should finduser success', async () => {
    const existuser = {
      id: '242075038',
      name: 'suborna',
      email: 'suborna2025@gmail.com',
    };

    const createNote = {
      title: 'subornas_note',
      content: 'hey this is suborna . and this is my first note',
      authorId: '242075038',
      link: '932-hfue82',
    };

    mockPrismaService.user.findFirst.mockResolvedValue(existuser);

    mockPrismaService.note.create.mockResolvedValue(createNote);
    const result = await service.createnote(
      'subornas_note',
      'hey this is suborna . and this is my first note',
      '242075038',
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: '242075038' },
    });

    expect(prisma.note.create).toHaveBeenCalledWith({
      data: {
        title: 'subornas_note',
        content: 'hey this is suborna . and this is my first note',
        authorId: '242075038',
        link: expect.any(String),
      },
    });
    expect(result).toEqual(createNote);
  });

  //get note
  it('should return note found', async () => {
    const noteId = '7u3ufjm';
    const existnote = {
      id: noteId,
      title: 'suborna',
      content: ' suborna love ',
    };
    mockPrismaService.note.findFirst.mockResolvedValue(existnote);
    const result = await service.getnoteid(noteId);
    expect(prisma.note.findFirst).toHaveBeenCalledWith({
      where: { id: noteId },
      select: {
        title: true,
        content: true,
      },
    });
    expect(result).toEqual(existnote);
  });
  // edit note
  it('should test edit feature', async () => {
    const noteId = 'sbrn75';
    const title = 'suborna';
    const content = 'subornas first note';
    const updt = {
      title: 'suborna-love',
      content: 'suborna is damn cute',
    };
    mockPrismaService.note.update.mockResolvedValue(updt);
    const result = await service.editenote(noteId, title, content);
    expect(prisma.note.update).toHaveBeenCalledWith({
      where: { id: noteId },
      data: {
        title: title,
        content: content,
      },
    });
    expect(result).toEqual(updt);
  });
  //delete note feature
  it('should test the delete feature', async () => {
    const noteId = 'sbrn75';

    const delnote = {
      id: noteId,
      title: 'suborna',
      content: 'sbrnlove',
    };
    mockPrismaService.note.delete.mockResolvedValue(delnote);
    const result = await service.deletenote(noteId);
    expect(prisma.note.delete).toHaveBeenCalledWith({
      where: { id: noteId },
    });
    expect(result).toEqual(delnote);
  });
});
