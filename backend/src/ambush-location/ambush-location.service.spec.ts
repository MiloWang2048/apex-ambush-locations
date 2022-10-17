import { Test, TestingModule } from '@nestjs/testing';
import { AmbushLocationService } from './ambush-location.service';

describe('AmbushLocationService', () => {
  let service: AmbushLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmbushLocationService],
    }).compile();

    service = module.get<AmbushLocationService>(AmbushLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
