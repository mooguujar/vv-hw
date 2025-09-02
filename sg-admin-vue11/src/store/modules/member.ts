import { defineStore } from 'pinia';
import { getMemberVIPList, getLevelSelect } from '/@/api/member';
// import { PaymentMethodItem, UserVipItem } from '/@/api/model/financeModel';

export const useMemberStore = defineStore('member', {
  state: () => ({
    vipLevelSelect: {}, // vip等级下拉
    levelSelect: {}, // 会员层级下拉
  }),
  getters: {
    getLevelSelect(state): any {
      return state?.levelSelect ?? {};
    },
    getVipLevelSelect(state): any {
      return state?.levelSelect ?? {};
    },
  },
  actions: {
    async getVipLevelList(): Promise<any> {
      try {
        this.vipLevelSelect = await getMemberVIPList();
      } catch (e) {
        console.error(e);
      }
    },
    async getLevelList(): Promise<any> {
      try {
        this.levelSelect = await getLevelSelect();
      } catch (e) {
        console.error(e);
      }
    },
  },
});
