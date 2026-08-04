import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

const mockmsg = jest.fn();
const mockchat = jest.fn().mockReturnValue({
  sendMessage: mockmsg,
});

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        chats: {
          create: mockchat,
        },
      };
    }),
  };
});

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return error initial content  msising', async () => {
    const result = await service.getresponse('sesison-242', 'prompt-is none');
    expect(result).toEqual({ message: 'inital body is required' });
    expect(mockchat).not.toHaveBeenCalled();
  });
  it('should create chat and return response', async () => {
    const sessionId = '242';
    const propmpt = 'hellow';
    const content = 'a black fat monster';
    const aiResponse = ' here is the summary';
    mockmsg.mockResolvedValue({ text: aiResponse });
    const result = await service.getresponse(sessionId, propmpt, content);
    expect(mockchat).toHaveBeenCalledWith({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: expect.stringContaining(content),
      },
    });
    expect(mockmsg).toHaveBeenCalledWith({ message: propmpt });
    expect(result).toEqual({ text: aiResponse });
  });
});
