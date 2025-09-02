import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useErrorLogStore } from '@/store/modules/errorLog';
// import {CURRENCY_LIST, CURRENCY_LIST_ALL, CURRENCYOBJ_KEY} from "@/enums/cacheEnum";
// import {Persistent} from "@/utils/cache/persistent";

interface SiteState {
  collectSites: Array<any>;
}

export const useCollectSites = defineStore({
  id: 'collectSites',
  state: (): SiteState => ({
    collectSites: [],
  }),
  actions: {
    updateCollectSitesList(site) {
      // state.push()
      const hasSiteArray = this.collectSites.filter((c) => site.c === c.c && site.d === c.d);
      const hasSite = hasSiteArray.length > 0;
      if (!hasSite) {
        this.collectSites.push(site);
      }
      if (hasSite) {
        let index = this.collectSites.indexOf(site);
        this.collectSites.splice(index, 1);
      }
    },
  },
  getters: {
    getCollectSites(state) {
      return state?.collectSites;
    },
  },
});

export function useCollectSitesStoreWithOut() {
  return useCollectSites(store);
}
