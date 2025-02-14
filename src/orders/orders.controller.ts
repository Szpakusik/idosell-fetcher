import { Controller, Get, Param, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.ordersService.get(+id);
  }

  @Put()
  update() {
    return this.ordersService.update();
  }
}
