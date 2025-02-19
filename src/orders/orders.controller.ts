import { Controller, Get, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { json2csv } from 'json-2-csv';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async get(
    @Res() res: Response,
    @Query('minWorth') minWorth?: number,
    @Query('maxWorth') maxWorth?: number,
  ) {
    const orders = await this.ordersService.get(minWorth, maxWorth);
    const csv = json2csv(orders || [], {
      expandArrayObjects: true,
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');

    return res.send(csv);
  }
}
