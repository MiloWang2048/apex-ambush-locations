import { Test, TestingModule } from '@nestjs/testing';
import { AmbushLocationController } from './ambush-location.controller';
import { AmbushLocationService } from './ambush-location.service';

describe('AmbushLocationController', () => {
  let controller: AmbushLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbushLocationController],
      providers: [AmbushLocationService],
    }).compile();

    controller = module.get<AmbushLocationController>(AmbushLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
