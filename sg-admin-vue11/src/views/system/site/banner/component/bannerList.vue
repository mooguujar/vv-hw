<template>
  <div v-for="item in tabItems" :key="item.key">
    <div class="mb-5 text-base font-semibold leading-normal text-left font-pingfang">
      <LaptopOutlined
        v-if="Number(item.key) == 1"
        :style="{
          fontSize: '12px',
          width: '22px',
          height: '22px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '22px',
          paddingTop: '2px',
          backgroundColor: '#6CDE07',
        }"
      />
      <Html5Outlined
        v-else
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: '#6CDE07',
        }"
      />
      {{ item.tab }}
    </div>
    <div class="drag-box">
      <Draggable
        v-model="tags"
        :list="item.list"
        :animation="100"
        item-key="id"
        class="list-group"
        :forceFallback="true"
        ghost-class="ghost"
        @end="onMoveCallback"
        :disabled="!disabled && !isHasAuth('708127')"
        :move="(e) => getdata(e, item.key)"
      >
        <template #item="{ element }">
          <div>
            <SetBannerLanguageCard
              :key="element.id"
              :bannerData="element"
              :bannerList="item.list"
              :bannerType="bannerType"
              :bannerClient="Number(item.key)"
              @click:success="refresh"
            />
          </div>
        </template>
        <template #footer>
          <AddBannerCard :bannerType="bannerType" v-if="isHasAuth('708122')" />
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script lang="ts">
  import { onMounted, ref } from 'vue';
  import Draggable from 'vuedraggable';
  import { getBannerV2List, sortBannerV2List } from '/@/api/sys/banner';
  import SetBannerLanguageCard from './setBannerLanguageCard.vue';
  import AddBannerCard from './addBannerCard.vue';
  import eventBus from '/@/utils/eventBus';
  import { LaptopOutlined, Html5Outlined } from '@ant-design/icons-vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default {
    components: {
      Draggable,
      SetBannerLanguageCard,
      AddBannerCard,
      LaptopOutlined,
      Html5Outlined,
    },
    props: {
      bannerType: { type: Number, default: () => 1 },
    },
    setup(props) {
      const { t } = useI18n();
      const tags = ref();
      const params = ref<any>({});
      const disabled = ref(false);
      const tabItems = ref([
        {
          key: '1',
          tab: t('table.system.system_pc_site'), //PC端
          list: [],
        },
        {
          key: '2',
          tab: t('table.system.system_mb_site'), //MB端
          list: [],
        },
      ]);

      const onMoveCallback = async (e) => {
        if (checkParams()) {
          const res = await sortBannerV2List(params.value);
          params.value = {};
          refresh();
        }
      };
      const checkParams = () => {
        // 在这里检查params参数是否完整
        if (
          params.value.banner_type &&
          params.value.client_type &&
          params.value.id &&
          params.value.index_id &&
          params.value.sort_after &&
          params.value.sort_before
        ) {
          return true;
        }

        return false;
      };
      const getdata = async (val, key) => {
        params.value = {
          banner_type: Number(props.bannerType),
          client_type: Number(key), //1:pc 2:mobile
          id: val.draggedContext.element.id, //id
          index_id: val.relatedContext.element.id,
          sort_after: val.draggedContext.futureIndex + 1,
          sort_before: val.draggedContext.index + 1,
        };
      };
      const refresh = () => {
        getBannerListData();
      };

      async function getBannerListData() {
        const res = await getBannerV2List({ banner_type: Number(props.bannerType) });
        tabItems.value[0].list = res.pc;
        tabItems.value[1].list = res.mobile;
      }

      onMounted(() => {
        eventBus.on('RefreshDraggable', (data: any) => {
          disabled.value = data;
        });
      });

      refresh();
      return {
        onMoveCallback,
        getdata,
        tags,
        tabItems,
        refresh,
        isHasAuth,
        disabled,
      };
    },
  };
</script>

<style scoped>
  .drag-box {
    display: flex;
    flex-wrap: wrap;
  }

  .list-group {
    display: flex;
    flex-wrap: wrap;
  }
</style>
