import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  let aiService: AiService;
  const mockService = {
    getresponse: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    aiService = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('summary', () => {
    it('should return the ai response', async () => {
      const body = {
        sessionId: '242',
        prompt: 'hehe',
        content: 'niloy',
      };
      const expt = { text: 'here is the contetn' };
      mockService.getresponse.mockResolvedValue(expt);
      const result = await controller.summary(body);

      expect(aiService.getresponse).toHaveBeenCalledWith(
        body.sessionId,
        body.prompt,
        body.content,
      );
      expect(result).toEqual(expt);
    });
    it('should handle the missing option content filed', async () => {
      const body = {
        sessionId: '343',
        prompt: 'dfhefouq',
      };
      const expectres = { message: 'initial body is missing' };
      mockService.getresponse.mockResolvedValue(expectres);
      const result = await controller.summary(body);
      expect(aiService.getresponse).toHaveBeenCalledWith(
        body.sessionId,
        body.prompt,
        undefined,
      );
      expect(result).toEqual(expectres);
    });
  });
});
