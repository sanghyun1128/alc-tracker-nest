import { Test, TestingModule } from '@nestjs/testing';
import { SpiritsController } from './spirits.controller';
import { SpiritsService } from './spirits.service';

describe('SpiritsController', () => {
  let controller: SpiritsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpiritsController],
      providers: [SpiritsService],
    }).compile();

    controller = module.get<SpiritsController>(SpiritsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
