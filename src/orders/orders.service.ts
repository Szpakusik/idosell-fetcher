import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateOrderDto } from './dto/create-order.dto';
import { IdoSellResponseDto } from './dto/update-orders.dto';
import { IdosellOrder } from './entities/order.entity';
import {
  GetOrderResponse,
  Order,
  ResponseProductDto,
} from './dto/get-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  apiUrl = this.configService.get<string>('apiUrl');
  apiKey = this.configService.get<string>('apiKey');

  get(createOrderDto: CreateOrderDto) {
    return 'This action gets orders';
  }

  async update(): Promise<GetOrderResponse | Error> {
    if (!this.apiUrl) {
      throw new Error('API URL is not defined in the configuration');
    }

    const url = this.apiUrl + '/api/admin/v4/orders/orders/get';
    const data = { params: { shippmentStatus: 'all' } };
    const config = { headers: { 'X-API-KEY': this.apiKey } };

    let allOrders: IdosellOrder[] = [];
    let currentPage = 0;
    let totalPages = 1;

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

      allOrders = allOrders.concat(result.Results);
      totalPages = result.resultsNumberPage;
      currentPage++;
      console.log(result.resultsNumberAll);
    }

    // Save to cache
    const allOrdersMapped: Order[] = allOrders.map((order) => {
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

    return allOrdersMapped;
  }

  @Cron('0 13 * * *')
  async handleCron() {
    this.update();
  }
}
