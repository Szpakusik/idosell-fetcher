import { IdosellOrder } from '../entities/order.entity';

export interface UpdateOrderResponseDto {
  resultsNumberAll: number;
  resultsNumberPage: number;
  resultsLimit: number;
  resultsPage: number;
}

export interface IdoSellResponseDto {
  Results: IdosellOrder[];
  resultsNumberAll: number;
  resultsNumberPage: number;
  resultsLimit: number;
  resultsPage: number;
}