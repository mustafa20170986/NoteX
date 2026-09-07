import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotFoundException } from '@nestjs/common';
import { title } from 'process';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  const mockNoteservice = {
    createnote: jest.fn(),
    findnotes: jest.fn(),
    getnoteid: jest.fn(),
    editenote: jest.fn(),
    deletenote: jest.fn(),
  };
  //mock auth guards
  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNoteservice,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  //test create note
  describe('note create', () => {
    it('should return cretae notew done ', async () => {
      const data = { title: 'suborna', content: 'subornas note' };
      const auth = { userId: '242075038' };
      const expctResult = {
        id: 1,
        ...data,
        authId: auth.userId,
      };
      mockNoteservice.createnote.mockResolvedValue(expctResult);
      const result = await controller.createnote(data, auth);
      expect(service.createnote).toHaveBeenCalledWith(
        data.title,
        data.content,
        auth.userId,
      );
      expect(result).toEqual(expctResult);
    });
  });
  //get note
  describe('get note', () => {
    it('should get the note', async () => {
      const authorId = '242075038';
      const expectnote = [
        {
          id: '1',
          title: 'suborna',
          content: 'she is damn cute .....',
        },
      ];
      mockNoteservice.findnotes.mockResolvedValue(expectnote);
      const result = await controller.findnote(authorId);
      expect(service.findnotes).toHaveBeenCalledWith(authorId);
      expect(result).toEqual(expectnote);
    });
  });
  //getting single note
  describe('getting single note', () => {
    it('should return note found', async () => {
      const noteId = 'suborna75';
      const expectNote = { title: 'sbrn', content: 'she is damn cute god' };
      mockNoteservice.getnoteid.mockResolvedValue(expectNote);
      const result = await controller.getNote(noteId);
      expect(service.getnoteid).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(expectNote);
    });
    it('should return note not found', async () => {
      const noteId = 'she is femininst';
      mockNoteservice.getnoteid.mockResolvedValue(null);
      await expect(controller.getNote(noteId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getnoteid).toHaveBeenCalledWith(noteId);
    });
  });
  //tetsing  the edit note feature
  describe('edit note', () => {
    it('this should edit the note', async () => {
      const noteId = 'sbrn-75';
      const editnote = {
        title: 'suborna',
        content: ' i dont even know why im writiing this :)',
      };
      const expectresult = { id: noteId, ...editnote };
      mockNoteservice.editenote.mockResolvedValue(expectresult);
      const result = await controller.editnote(noteId, editnote);
      expect(service.editenote).toHaveBeenCalledWith(
        noteId,
        editnote.title,
        editnote.content,
      );
      expect(result).toEqual(expectresult);
    });
  });
  //testing delete note
  describe('deleete note', () => {
    it('should delete the note', async () => {
      const noteId = 'sbrn-75';
      const notedata = {
        id: noteId,
        title: 'sbrn',
        content: ' now im deleteing her hehe',
      };
      mockNoteservice.deletenote.mockResolvedValue(notedata);
      const result = await controller.deletenote(noteId);

      expect(service.deletenote).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(notedata);
    });
  });
});
