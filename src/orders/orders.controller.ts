import { Controller, Get, Param, Query, Res } from '@nestjs/common';
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

    if (!orders) {
      return res.status(404).send("Orders not found");
    }

    const csv = json2csv(orders || [], {
      expandArrayObjects: true,
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');

    return res.send(csv);
  }

  @Get(":id")
  async getSingle(@Res() res: Response, @Param("id") id: string) {
    const order = await this.ordersService.getSingle(id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    return res.json(order);
  }
}
