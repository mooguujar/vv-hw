<template>
  <AnnouncementModal @register="registerAnnounModal" />
</template>
<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
  import AnnouncementModal from '/@/components/AnnouncementModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { GetZkNoticeList, setNoticeTodayTimes } from '/@/api/sys';
  import { useUserStore } from '/@/store/modules/user';
  import eventBus from '/@/utils/eventBus';

  export default defineComponent({
    name: 'BusinessContent',
    components: { AnnouncementModal },
    setup() {
      const [registerAnnounModal, { openModal: openAnnounModal }] = useModal();
      const userStore = useUserStore();
      const info = userStore.getUserInfo;
      const bounceFrequency = ref([]);

      // async function getNoticeExists() {
      //   const { status, data } = await getNoticeList();
      //   if (status && !data) {
      //     getNoticeList();
      //   }
      // }
      // getNoticeExists();

      // 先注释
      getNoticeList();

      async function getNoticeList(): Promise<any> {
        try {
          const { d: res } = await GetZkNoticeList({ is_pop_up: 1 });
          // 清空bounceFrequency数组或根据实际情况初始化
          bounceFrequency.value = [];
          if (res === null) {
            return;
          }
          // 当有数据时打开模态框
          if (res.length > 0) {
            // 使用for...of循环更清晰地表达意图
            // for (const el of res) {
            //   if (el['bounce_frequency'] == 2) {
            //     bounceFrequency.value.push(el.id);
            //   }
            // }
            // if (bounceFrequency.value.length > 0) setNoticeTimes();

            openAnnounModal(true, res);
          }
        } catch (error) {
          console.error('Failed to fetch notice list:', error);
          // 处理错误或通知用户
        }
      }

      onMounted(() => {
        eventBus.on('openNoticeModal', (data: any) => {
          openAnnounModal(true, [data]);
        });
      });

      onBeforeMount(() => {
        eventBus.off('openNoticeModal');
      });

      async function setNoticeTimes() {
        //已读次数 废弃
        try {
          const res = await setNoticeTodayTimes({
            code: info['prefix'],
            ids: bounceFrequency.value,
          });
        } catch (error) {
          console.error('Failed to fetch notice list:', error);
          // 处理错误或通知用户
        }
      }

      return {
        registerAnnounModal,
      };
    },
  });
</script>
<style lang="less"></style>
