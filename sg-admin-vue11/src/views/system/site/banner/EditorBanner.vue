<template>
  <div>
    <AddBannerFrom :isEdit="true" :editBulletinData="editBulletinData" />
    <Loading :loading="loading" :absolute="false" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import AddBannerFrom from './component/addBanner.vue';
  import { getBannerV2Detail } from '/@/api/sys/banner';
  import { Loading } from '/@/components/Loading';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'EditorCarouseForm',
    components: {
      PageWrapper,
      AddBannerFrom,
      Loading,
    },
    setup() {
      const route = useRoute();
      const loading = ref<boolean>(false);
      const editBulletinData = ref<any>();
      async function getEditBulletinData(): Promise<void> {
        try {
          const response = await getBannerV2Detail({
            id: route.query.id,
          });
          editBulletinData.value = response;
        } catch (e) {
          console.error(e);
        } finally {
          loading.value = false;
        }
      }
      getEditBulletinData();
      return {
        loading,
        editBulletinData,
      };
    },
  });
</script>
