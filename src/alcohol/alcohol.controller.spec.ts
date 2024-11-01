import { Test, TestingModule } from '@nestjs/testing';
import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';

describe('AlcoholController', () => {
  let controller: AlcoholController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlcoholController],
      providers: [AlcoholService],
    }).compile();

    controller = module.get<AlcoholController>(AlcoholController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
