import { Test, TestingModule } from '@nestjs/testing';
import { SpiritsService } from './spirits.service';

describe('SpiritsService', () => {
  let service: SpiritsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpiritsService],
    }).compile();

    service = module.get<SpiritsService>(SpiritsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
