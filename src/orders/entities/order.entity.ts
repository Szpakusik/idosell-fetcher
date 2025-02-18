export type Order = {
  orderID: string;
  products: Product[];
  orderWorth: number;
};

export interface Product {
  productID: number;
  quantity: number;
}
