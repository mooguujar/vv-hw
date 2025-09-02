import type { Result } from '/#/axios';

export interface BasicPageParams {
  page?: number;
  page_size?: number;
}

export interface BasicFetchResult<T> {
  d: T[];
  s: number;
  t: number; // 总条数（只有page = 1才会有值）
}

export type BasicTableFetchResult<T> = Result<BasicFetchResult<T>>;
