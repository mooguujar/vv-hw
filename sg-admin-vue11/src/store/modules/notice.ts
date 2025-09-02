import { defineStore } from 'pinia';
import { add } from '/@/utils/number';
import { getNoticeList, getReviewCount } from '/@/api/member/index';

export const useNoticeStore = defineStore('notice', {
  state: (): any => ({
    notice: {}, // 未完成订单数量
    reviewCounts: {},
  }),
  getters: {
    getFinanceNotice(state): any {
      return state?.notice?.finance ?? {};
    },
    getRiskNotice(state): any {
      return state?.notice?.risk_notice ?? {};
    },
    getSystemNotice(state): any {
      return state?.notice?.agency_notice ?? {};
    },
    getReviewCounts(state): any {
      return state?.reviewCounts ?? {};
    },
    getFinanceTotal(state): any {
      let total = 0;
      if (state.notice.finance) {
        for (const item in state.notice.finance) {
          total = add(Number(total), Number(state.notice.finance[item]));
        }
      }
      return Number(total);
    },
    getRiskTotal(state): any {
      let total = 0;
      if (state.notice.risk_notice) {
        for (const item in state.notice.risk_notice) {
          if (item != 'associate_num')
            total = add(Number(total), Number(state.notice.risk_notice[item]));
        }
      }
      return Number(total);
    },
    getSystemTotal(state): any {
      let total = 0;
      if (state.notice.agency_notice) {
        for (const item in state.notice.agency_notice) {
          total = add(Number(total), Number(state.notice.agency_notice[item]));
        }
      }
      return Number(total);
    },
  },
  actions: {
    async getNotice(): Promise<any> {
      try {
        const res = await getNoticeList();
        if (res['feedback_notice']) {
          res['agency_notice']['feedback_notice'] = res['feedback_notice']['pending_num'];
        }
        delete res['feedback_notice'];
        this.notice = res;
      } catch (e) {
        console.error(e);
      }
    },
    async updateNotice(value): Promise<any> {
      if (Object.keys(value).length) {
        for (const item in value) {
          if (Object.keys(item).length) {
            for (const itemChildren in value[item]) {
              if (this.notice[item]) this.notice[item][itemChildren] = value[item][itemChildren];
            }
          }
        }
      }
    },
    async initReviewCounts(): Promise<any> {
      try {
        const data = await getReviewCount();
        const sum = Object.values(data)
          .map(Number) // Convert each value to a number
          .reduce((acc, val) => acc + val, 0);
        this.reviewCounts = { ...data, total: sum };
      } catch (e) {
        console.error(e);
      }
    },
  },
});
