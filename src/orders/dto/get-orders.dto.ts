import { Order } from "../entities/order.entity";

export type GetOrderResponseDto = {
  data: Order[];
  total: number;
};


