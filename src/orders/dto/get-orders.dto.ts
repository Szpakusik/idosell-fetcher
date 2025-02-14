export type GetOrderResponse = Order[];

export type Order = {
  orderID: string;
  products: ResponseProductDto[];
  orderWorth: number;
}

export interface ResponseProductDto {
  productID: number;
  quantity: number;
}
