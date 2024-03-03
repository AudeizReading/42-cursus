import { Test, TestingModule } from '@nestjs/testing';
import { NotifService } from './notif.service';

describe('NotifService', () => {
  let service: NotifService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifService],
    }).compile();

    service = module.get<NotifService>(NotifService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
