import { defineStore } from 'pinia';
import { getgame_typeList } from '/@/api/report';
import { nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

export const useGameSortStore = defineStore('gameSort', {
  state: () => ({
    gameList: [],
    categoryList: [],
    game_typeList: [], //游戏类型
    platformList: [], //游戏平台
    total: null, //报表管理/投注记录总计
    totalSport: null, //报表管理/体育投注记录总计
  }),
  getters: {
    getGameList(state) {
      return state?.gameList;
    },
    getCategoryList(state) {
      return state?.categoryList;
    },
    getgame_typeList(state) {
      return state?.game_typeList;
    },
    getPlatformList(state) {
      return state?.platformList;
    },
    getTotal(state) {
      return state?.total;
    },
    getTotalSport(state) {
      return state?.totalSport;
    },
  },
  actions: {
    setGategoryList(list) {
      this.categoryList = list;
    },
    setGameList(list) {
      this.gameList = list;
    },
    async setgame_typeList(): Promise<any> {
      try {
        const game_typeList = await getgame_typeList();
        await nextTick();
        const { t } = useI18n();
        this.game_typeList = [{ name: t('business.common_all'), game_type: 'all', seq: 0 }];
        this.game_typeList = this.game_typeList.concat(game_typeList.game_type);
        game_typeList.game_type.map((item) => {
          this.platformList[item.game_type] = [];
          game_typeList.platform.map((platformItem) => {
            if (item.game_type == platformItem.game_type)
              this.platformList[item.game_type].push(platformItem);
          });
        });
      } catch (e) {}
    },
    setTotal(list) {
      this.totalSport = list;
    },
    setTotalSport(list) {
      this.totalSport = list;
    },
  },
});
