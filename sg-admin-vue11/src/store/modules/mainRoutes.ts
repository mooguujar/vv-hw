import { defineStore } from 'pinia';
import { store } from '/@/store';

export const useMainRoutesStore = defineStore('mainRoutes', {
  state: () => ({
    HorizontalRoutes: null,
  }),
  getters: {
    getHorizontalRoutes(state) {
      return state?.HorizontalRoutes;
    },
  },
  actions: {
    setHorizontalRoutes(list) {
      this.HorizontalRoutes = list;
    },
  },
});

export function useMainRoutesStoreWithOut() {
  return useMainRoutesStore(store);
}
