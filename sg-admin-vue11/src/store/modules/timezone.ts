import { defineStore } from 'pinia';
import { store } from '/@/store';

import { SITE_ZONE, TIME_ZONE } from '/@/enums/cacheEnum';
import { createLocalStorage } from '/@/utils/cache';
import { TIMEZONE, timezoneList } from '/@/settings/localeSetting';

const ls = createLocalStorage();

const lsTimezone = ls.get(TIME_ZONE) || TIMEZONE.ETC;

interface State {
  timezone: string;
  timezoneList?: Array<any>;
  sizeId: string;
  serverDateStore: string;
}

export const useTimezoneStore = defineStore({
  id: 'app-timezone',
  state: (): State => ({
    serverDateStore: '',
    timezone: lsTimezone,
    timezoneList: timezoneList,
    sizeId: '',
  }),
  getters: {
    getTimezone(state) {
      return state?.timezone;
    },
    getServerDateStore(state) {
      return state?.serverDateStore;
    },
    getTimezoneList(state) {
      return state?.timezoneList;
    },
    getSizeId(state) {
      return state?.sizeId;
    },
  },
  actions: {
    /**
     * 时区
     * @param timezone string
     */
    setTimezone(timezone: string) {
      this.timezone = timezone;
      ls.set(TIME_ZONE, this.timezone);
    },
    setServerDateStore(serverDateStore: string) {
      this.serverDateStore = serverDateStore;
    },
    setSizeId(sizeId: string) {
      this.sizeId = sizeId;
      ls.set(SITE_ZONE, this.sizeId);
    },
  },
});

// Need to be used outside the setup
export function useTimezoneStoreWithOut() {
  return useTimezoneStore(store);
}
