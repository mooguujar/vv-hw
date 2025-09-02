import { defineStore } from 'pinia';
import { getSiteBrandDetail, getLotteryTy } from '/@/api/sys';

export const useSystemStore = defineStore('system', {
  state: () => ({
    langList: ['zh_CN', 'en_US', 'pt_BR', 'th_TH', 'vi_VN', 'hi_IN', 'tl_PH', 'ko_KR'],
    //彩票种类
    LotteryTyList: {
      data: [],
      hasLoaded: false,
    },
  }),
  actions: {
    async getValidLangList(type?): Promise<any> {
      try {
        const res = await getSiteBrandDetail({ tag: 'base' });
        // 优先返回 default 字段（新增）
        if (type === 'default' && res.default) {
          return {
            ...res, // 保留原有返回结构
            default: res.default, // 确保包含 default 字段
            // 其他原有逻辑返回的字段也会保留
          };
        }
        if (!res.lang) return;
        if (res.lang.f == 2) {
          return this.langList;
        }
        if (res.lang.f == 1) {
          return res.lang.d;
        }
        return;
      } catch (e) {
        console.error(e);
      }
    },
    async getLotteryTyList(): Promise<any> {
      if (this.LotteryTyList.hasLoaded) {
        return this.LotteryTyList.data;
      } else {
        try {
          const response: any = await getLotteryTy();
          this.LotteryTyList.data = response || [];
        } catch (e) {
          console.error(e);
        } finally {
          this.LotteryTyList.hasLoaded = true;
        }
        return this.LotteryTyList.data;
      }
    },
  },
});
