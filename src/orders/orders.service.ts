import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  IdoSellResponseDto,
  UpdateOrderResponseDto,
} from './dto/update-orders.dto';
import { IdosellOrder } from './entities/order.entity';
import {
  GetOrderResponse,
  Order,
  ResponseProductDto,
} from './dto/get-orders.dto';
import { ORDERS_CACHE_KEY } from 'src/consts/cache';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  idosellApiUrl = this.configService.get<string>('idosellApiUrl');
  idosellApiKey = this.configService.get<string>('idosellApiKey');

  @Cron('0 13 * * *')
  async handleCron() {
    this.updateMappedOrdersCache();
  }

  async get(
    minWorth?: number,
    maxWorth?: number,
  ): Promise<GetOrderResponse | null> {
    let result: Order[] = [];

    const cachedOrders = await this.cacheManager.get<Order[]>(ORDERS_CACHE_KEY);

    if (cachedOrders) {
      result = cachedOrders;
    } else {
      result = await this.updateMappedOrdersCache();
    }

    if (minWorth || maxWorth) {
      result = result.filter((order) => {
        if (minWorth && maxWorth) {
          return order.orderWorth >= minWorth && order.orderWorth <= maxWorth;
        }
        if (minWorth) {
          return order.orderWorth >= minWorth;
        }
        if (maxWorth) {
          return order.orderWorth <= maxWorth;
        }
        return true;
      });
    }

    return {
      data: result,
      total: result.length,
    };
  }

  async updateMappedOrdersCache(): Promise<Order[]> {
    const idosellOrders = await this.getIdosellOrders();

    const allOrdersMapped: Order[] = mapOrders(idosellOrders.Results);
    this.cacheManager.set(ORDERS_CACHE_KEY, allOrdersMapped);

    return allOrdersMapped;
  }

  async getIdosellOrders(): Promise<IdoSellResponseDto> {
    if (!this.idosellApiUrl) {
      throw new Error('API URL is not defined in the configuration');
    }

    const url = this.idosellApiUrl + '/api/admin/v4/orders/orders/get';
    const data = { params: { shippmentStatus: 'all' } };
    const config = { headers: { 'X-API-KEY': this.idosellApiKey } };

    let allOrders: IdosellOrder[] = [];
    let currentPage = 0;
    let totalPages = 1;
    let firstResponse: UpdateOrderResponseDto = {};

    while (currentPage < totalPages) {
      const result = await lastValueFrom(
        this.httpService.post<IdoSellResponseDto>(url, data, config).pipe(
          map((response) => response.data),
          catchError((error) => {
            console.error('Error fetching orders from IdoSell API:', error);
            throw new Error('Error fetching orders from IdoSell API');
          }),
        ),
      );

      firstResponse = result;
      allOrders = allOrders.concat(result.Results);
      totalPages = result.resultsNumberPage;
      currentPage++;
    }

    return {
      resultsNumberAll: firstResponse.resultsNumberAll ?? 0,
      resultsNumberPage: firstResponse.resultsNumberPage ?? 0,
      resultsLimit: firstResponse.resultsLimit ?? 0,
      resultsPage: firstResponse.resultsPage ?? 0,
      Results: allOrders ?? [],
    };
  }
}

const mapOrders = (allOrders: IdosellOrder[]): Order[] =>
  allOrders.map((order) => {
    const orderWorthCosts = order.orderDetails.payments.orderBaseCurrency;
    const {
      orderProductsCost,
      orderDeliveryCost,
      orderPayformCost,
      orderInsuranceCost,
    } = orderWorthCosts;

    const orderWorth =
      orderProductsCost +
      orderDeliveryCost +
      orderPayformCost +
      orderInsuranceCost;

    return {
      orderID: order.orderId,
      orderWorth: orderWorth,
      products: order.orderDetails.productsResults.map(
        (product): ResponseProductDto => {
          return {
            productID: product.productId,
            quantity: product.productQuantity,
          };
        },
      ),
    };
  });
