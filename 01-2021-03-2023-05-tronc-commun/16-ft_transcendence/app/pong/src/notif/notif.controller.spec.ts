import { Test, TestingModule } from '@nestjs/testing';
import { NotifController } from './notif.controller';

describe('NotifController', () => {
  let controller: NotifController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifController],
    }).compile();

    controller = module.get<NotifController>(NotifController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
