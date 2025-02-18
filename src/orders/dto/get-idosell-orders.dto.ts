import { IdosellOrder } from '../entities/idosellOrder.entity';

export interface IdoSellResponseDto {
  Results: IdosellOrder[];
  resultsNumberAll: number;
  resultsNumberPage: number;
  resultsLimit: number;
  resultsPage: number;
}