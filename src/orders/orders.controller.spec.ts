import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { GetOrderResponseDto } from './dto/get-orders.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return orders with no filters', async () => {
    const result: GetOrderResponseDto = { data: [], total: 0 };
    jest.spyOn(service, 'get').mockResolvedValue(result);

    expect(await controller.get()).toBe(result);
  });

  it('should return orders with minWorth filter', async () => {
    const result: GetOrderResponseDto = { data: [], total: 0 };
    jest.spyOn(service, 'get').mockResolvedValue(result);

    expect(await controller.get(100)).toBe(result);
    expect(service.get).toHaveBeenCalledWith(100, undefined);
  });

  it('should return orders with maxWorth filter', async () => {
    const result: GetOrderResponseDto = { data: [], total: 0 };
    jest.spyOn(service, 'get').mockResolvedValue(result);

    expect(await controller.get(undefined, 200)).toBe(result);
    expect(service.get).toHaveBeenCalledWith(undefined, 200);
  });

  it('should return orders with both minWorth and maxWorth filters', async () => {
    const result: GetOrderResponseDto = { data: [], total: 0 };
    jest.spyOn(service, 'get').mockResolvedValue(result);

    expect(await controller.get(100, 200)).toBe(result);
    expect(service.get).toHaveBeenCalledWith(100, 200);
  });
});
