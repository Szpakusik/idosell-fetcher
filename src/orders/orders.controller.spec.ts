import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { GetOrderResponseDto } from './dto/get-orders.dto';
import { Response } from 'express';
import { json2csv } from 'json-2-csv';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  let res: Response;
  let mockedValue: GetOrderResponseDto;
  let resultCSV: string;

  beforeEach(async () => {
    mockedValue = [
      {
        orderID: 'someId',
        orderWorth: 100,
        products: [
          { productID: 999, quantity: 2 },
          { productID: 999, quantity: 2 },
        ],
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            get: jest.fn().mockResolvedValue(mockedValue),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    res = {
      header: jest.fn(),
      attachment: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    resultCSV = json2csv(mockedValue, {
      expandArrayObjects: true,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return orders with no filters', async () => {
    await controller.get(res)

    expect(service.get).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should return orders with minWorth filter', async () => {
    await controller.get(res, 100)

    expect(service.get).toHaveBeenCalledWith(100, undefined);
  });

  it('should return orders with maxWorth filter', async () => {
    await controller.get(res, undefined, 200)

    expect(service.get).toHaveBeenCalledWith(undefined, 200);
  });

  it('should return orders with both minWorth and maxWorth filters', async () => {
    await controller.get(res, 50, 200)

    expect(service.get).toHaveBeenCalledWith(50, 200);
  });

  it('should return orders as CSV', async () => {
    await controller.get(res, 50, 200);

    expect(res.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.attachment).toHaveBeenCalledWith('orders.csv');
    expect(res.send).toHaveBeenCalledWith(resultCSV);
  });
});
