export interface feedbackSearch {
  page: string;
  rows: number;
  type: string;
  content: number;
  searchBy: string;
  searchVal: string;
}

/**
 * @description: Get menu return value
 */
export type feedbackSearchModel = feedbackSearch;

export interface feedbackRecords {
  auditBy?: number;
  content?: string;
  createTime?: string; // You can use a specific date format if needed, like 'YYYY-MM-DD HH?:mm?:ss'
  film?: string;
  id: number;
  image?: string;
  remark?: string;
  state: string;
  status: number;
  type: number;
  updateTime?: string; // You can use a specific date format if needed, like 'YYYY-MM-DD HH?:mm?:ss'
  userId: number;
  memberId?: number;
  username?: string;
  auditTime?: string;
  auditUsername?: string;
  created_at?: number;
}

export type feedbackUpdateParams = {
  auditBy?: number;
  content?: string;
  createTime?: string;
  film?: string;
  id?: number;
  image?: string;
  remark?: string;
  state?: string;
  status?: number;
  type?: number;
  updateTime?: string;
  userId?: number;
};
