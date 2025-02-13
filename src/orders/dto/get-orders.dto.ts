import { Order } from "../entities/order.entity";

export interface FindAllResponse {
    Results: Order[];
    resultsNumberAll: number;
    resultsNumberPage: number;
    resultsLimit: number;
    resultsPage: number;
  }