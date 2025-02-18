import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  get(
    @Query('minWorth') minWorth: number,
    @Query('maxWorth') maxWorth: number,
  ) {
    return this.ordersService.get(minWorth, maxWorth);
  }
}
