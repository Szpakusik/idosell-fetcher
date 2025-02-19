import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Order } from './entities/order.entity';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';

describe('OrdersService', () => {
  let service: OrdersService;
  let cacheManager: Cache;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnValue(of({ data: [] })),
            post: jest.fn().mockReturnValue(of({ data: 'mocked response' })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'idosellApiUrl') return 'http://api.url';
              if (key === 'idosellApiKey') return 'api-key';
              return null;
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('get Method', () => {
    it('should return cached orders if available', async () => {
      const cachedOrders: Order[] = [
        { orderWorth: 100, orderID: '1', products: [] },
      ];
      const cacheGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(cachedOrders);

      const result = await service.get();

      expect(cacheGetSpy).toHaveBeenCalledTimes(1);

      expect(result).toEqual(cachedOrders);
    });

    it('should filter orders by minWorth', async () => {
      const orders: Order[] = [
        { orderWorth: 50, orderID: '1', products: [] },
        { orderWorth: 150, orderID: '2', products: [] },
      ];
      const cacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(orders);
      const httpSpy = jest.spyOn(httpService, 'post');

      const result = await service.get(100);

      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(httpSpy).toHaveBeenCalledTimes(0);
      expect(result).toEqual([{ orderWorth: 150, orderID: '2', products: [] }]);
    });

    it('should filter orders by maxWorth', async () => {
      const orders: Order[] = [
        { orderWorth: 50, orderID: '1', products: [] },
        { orderWorth: 150, orderID: '2', products: [] },
      ];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(orders);

      const result = await service.get(undefined, 100);
      expect(result).toEqual([{ orderWorth: 50, orderID: '1', products: [] }]);
    });

    it('should filter orders by minWorth and maxWorth', async () => {
      const orders: Order[] = [
        { orderWorth: 50, orderID: '1', products: [] },
        { orderWorth: 150, orderID: '2', products: [] },
        { orderWorth: 250, orderID: '3', products: [] },
      ];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(orders);

      const result = await service.get(100, 200);
      expect(result).toEqual([{ orderWorth: 150, orderID: '2', products: [] }]);
    });

    it('should call getIdosellOrders when cache is empty', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      const idosellSpy = jest
        .spyOn(service, 'getIdosellOrders')
        .mockResolvedValue({
          Results: [],
          resultsNumberAll: 0,
          resultsNumberPage: 0,
          resultsLimit: 0,
          resultsPage: 0,
        });

      await service.get();

      expect(idosellSpy).toHaveBeenCalledTimes(1);
    });

    it('should update cache when cache is empty', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(service, 'getIdosellOrders').mockResolvedValue({
        Results: [],
        resultsNumberAll: 0,
        resultsNumberPage: 0,
        resultsLimit: 0,
        resultsPage: 0,
      });
      const cacheSpy = jest.spyOn(cacheManager, 'set');

      await service.get();

      expect(cacheSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSingle Method', () => {
    it('should return a single order by ID', async () => {
      const orders: Order[] = [
        { orderWorth: 50, orderID: '1', products: [] },
        { orderWorth: 150, orderID: '2', products: [] },
      ];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(orders);

      const result = await service.getSingle('1');
      expect(result).toEqual({ orderWorth: 50, orderID: '1', products: [] });
    });

    it('should return null if order ID is not found', async () => {
      const orders: Order[] = [
        { orderWorth: 50, orderID: '1', products: [] },
        { orderWorth: 150, orderID: '2', products: [] },
      ];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(orders);

      const result = await service.getSingle('3');
      expect(result).toBeNull();
    });

    it('should call updateMappedOrdersCache if cache is empty for getSingle', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      const updateCacheSpy = jest
        .spyOn(service, 'updateMappedOrdersCache')
        .mockResolvedValue([
          { orderWorth: 50, orderID: '1', products: [] },
          { orderWorth: 150, orderID: '2', products: [] },
        ]);

      const result = await service.getSingle('1');
      expect(updateCacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ orderWorth: 50, orderID: '1', products: [] });
    });
  });

  // Test getIdosellOrders
});
