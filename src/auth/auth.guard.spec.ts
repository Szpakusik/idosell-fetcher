import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'authLogin') return 'testUser';
              if (key === 'authPassword') return 'testPass';
            }),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if no authorization header', () => {
    const context = createMockExecutionContext({});
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false if authorization type is not Basic', () => {
    const context = createMockExecutionContext({ authorization: 'Bearer token' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false if credentials are invalid', () => {
    const context = createMockExecutionContext({ authorization: 'Basic invalid' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return true if credentials are valid', () => {
    const validCredentials = Buffer.from('testUser:testPass').toString('base64');
    const context = createMockExecutionContext({ authorization: `Basic ${validCredentials}` });
    expect(guard.canActivate(context)).toBe(true);
  });

  function createMockExecutionContext(headers: Record<string, string>): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as unknown as ExecutionContext;
  }
});