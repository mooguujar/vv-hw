<template>
  <div class="main relative" ref="main" :class="{ customize: popType == 2 }">
    <BasicModal
      v-bind="$attrs"
      :centered="true"
      :useWrapper="true"
      :wrapperFooterOffset="-99"
      width="580px"
      @register="registerModal"
      :getContainer="() => $refs.main"
      :showCancelBtn="false"
      :showOkBtn="false"
      :footer="null"
    >
      <div class="w-full absolute -top-68.5">
        <p
          class="absolute z-100 text-[18px] leading-normal font-semibold text-[#FFFFFF] top-17 left-3"
        >
          <span class="relative top-[4px] left-3 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M11.3333 14.6667V12.9367C12.7133 12.557 13.7333 11.2489 13.7333 9.66667C13.7333 8.08439 12.7133 6.77637 11.3333 6.39662V4.66667C13.5933 5.06751 15.3333 7.15612 15.3333 9.66667C15.3333 12.1772 13.5933 14.2658 11.3333 14.6667ZM11.3333 0V1.71247C15.2767 2.49471 18.2667 5.91966 18.2667 10C18.2667 14.0803 15.2767 17.5053 11.3333 18.2875V20C16.2517 19.1966 20 15.0317 20 10C20 4.96829 16.2517 0.803383 11.3333 0ZM3.33333 6.66667H0V13.3333H3.33333L10 20V0L3.33333 6.66667Z"
                fill="#EEF1F7"
              />
            </svg>
          </span>

          {{ titlelText }}</p
        >
      </div>

      <div
        class="w-145 min-h-70 p-5 pt-4 rounded-t-none bg-[#EAEEF5] rounded absolute -top-[166px] z-[4] leading-4 whitespace-pre-wrap break-all text-xs"
      >
        <div v-if="actionNum.length > 1" class="w-[540px] bg-[#0F212E] rounded-full mb-4 h-[46px]">
          <!-- 活动选项背景 -->
          <Tabs
            class="capsule_tap"
            tab-position="top"
            size="small"
            v-model:activeKey="defaultActiveKey"
            @change="goToNextPop(announcementId)"
          >
            <!-- <template v-for="i in 4" :key="i">
              <TabPane :tab="`活动${i}`" />
            </template> -->
            <template v-for="(_, index) of actionNum" :key="index">
              <TabPane :tab="`${t('layout.notify. announcement')}${index + 1}`" />
            </template>
          </Tabs>
          <div class="absolute top-15.5 w-[540px] h-4 bg-[#EAEEF5]"></div>
        </div>
        <div
          class="w-135 h-86 bg-[#FFF] rounded pl-3 overflow-y-auto font-medium leading-normal pr-4 py-4 text-[16px] text-[#444]"
          v-html="htmlText"
        >
        </div>
      </div>

      <!-- <div class="w-full p-2" v-if="popType == 2">
        <Image :src="getDataTypePreviewUrl(srcImg)" :preview="false" />
      </div> -->

      <div class="flex justify-between" :class="poBottom">
        <!-- <div
          ><Checkbox style="color: white" v-model:checked="checked" @change="setNoticeToday"
            >今日不再提示</Checkbox
          ></div
        > -->
        <!-- <a-button type="primary" @click="goToNextPop" v-if="popList.length > 1">下一条</a-button> -->
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue';
  import { useLocale } from '/@/locales/useLocale';
  import { Checkbox, Image, message, Tabs } from 'ant-design-vue';
  import { TabPane } from 'ant-design-vue/lib/tabs';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { setNoticeTodayLimit, limit_count } from '/@/api/sys';
  import { useUserStore } from '/@/store/modules/user';
  import { chineseNumbersArray } from '/@/settings/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: {
      BasicModal,
      Tabs,
      TabPane,
    },
    setup() {
      const htmlText = ref('');
      const titlelText = ref('');
      const popType = ref(1);
      const checked = ref(false);
      const userStore = useUserStore();
      const info = userStore.getUserInfo;
      const selectedKeys = ref<string[]>([]);
      const srcImg = ref('');
      const popList = ref([]);
      const defaultActiveKey = ref(0);
      const actionNum = ref<string[]>([]);
      const { getLocale } = useLocale();
      const { t } = useI18n();

      watchEffect(() => {
        selectedKeys.value = [unref(getLocale)];
      });

      watch(
        () => defaultActiveKey.value,
        () => {
          updatePop();
          // redoModalHeight();
        },
      );
      const poBottom = computed(() => {
        return actionNum.value.length > 1 ? 'bottomSec' : 'bottomOne';
      });
      const announcementId = computed(() => {
        return popList.value[defaultActiveKey.value].id;
      });

      // pop_up_type 1 文字 pop_up_type 2 图片

      const [registerModal, { setModalProps, redoModalHeight }] = useModalInner(async (data) => {
        popList.value = data;
        actionNum.value = chineseNumbersArray.slice(0, popList.value.length);

        await updatePop();
        goToNextPop(data[0].id);

        setModalProps({ confirmLoading: false });
      });

      function goToNextPop(id) {
        let currenObj: any = popList.value.find((o) => o.id == id);
        if (currenObj.bounce_location == 1) {
          limit_count({ types: 2, is_check: 1, ids: [id] });
        }
      }

      async function setNoticeToday() {
        try {
          const { data, status } = await setNoticeTodayLimit({ code: info['prefix'] });
          if (status) {
            message.success(data);
          }
        } catch (error) {
          console.error('Failed to fetch notice list:', error);
          // 处理错误或通知用户
        }
      }

      function updatePop() {
        const { title, content } = popList.value[defaultActiveKey.value];

        // popType.value = pop_up_type;
        const key = selectedKeys.value[0];

        let titleRes: any = title;
        let contentRes: any = content;
        try {
          titleRes = JSON.parse(title);
          contentRes = JSON.parse(content);
        } catch (e) {
          console.error(e);
        }
        // if (title) {
        titlelText.value = titleRes[key] ?? titleRes;
        htmlText.value = contentRes[key] ?? contentRes;
        // }

        setTimeout(() => {
          redoModalHeight();
        }, 100);
      }
      return {
        registerModal,
        htmlText,
        titlelText,
        checked,
        getDataTypePreviewUrl,
        srcImg,
        popType,
        goToNextPop,
        setNoticeToday,
        popList,
        defaultActiveKey,
        actionNum,
        poBottom,
        announcementId,
        t,
      };
    },
  });
</script>
<style lang="less" scoped>
  .main {
    ::v-deep(.ant-modal-header) {
      width: 580px;
      height: 220px;
      padding: 18px 12px;
      border-bottom: none;
      background-color: #1b2c37 !important;

      .vben-basic-title {
        color: white;
        font-size: 28px;
      }
    }

    ::v-deep(.ant-modal-body) {
      .scrollbar__wrap {
        border: 0;
      }

      .scrollbar {
        padding: 0;
      }
    }

    ::v-deep(.ant-tabs-tab-active > .ant-tabs-tab-btn) {
      height: 40px;
      font-size: 14px;
    }

    ::v-deep(.ant-tabs-tab-active > .ant-tabs-tab-btn:hover) {
      color: white;
      font-size: 14px;
    }

    ::v-deep(.ant-tabs-tab-btn) {
      width: 125px;
      height: 40px;
      color: white;
      font-size: 14px;
      text-align: center;
    }

    ::v-deep(.ant-modal-body) {
      height: 185px;
      border-radius: 4px;
      background-color: #1b2c37;
    }

    ::v-deep(.ant-checkbox-inner) {
      border: 2px solid #2f4553;
      background-color: #1a2c38;
    }

    ::v-deep(.ant-tabs-nav-list) {
      height: 46px;
      border: #0f212e;
      background-color: #0f212e;
      // width: 320px;
      // overflow-x: scroll;
    }

    ::v-deep(.ant-tabs-tab-active > .ant-tabs-tab-btn) {
      background-color: #2f4553;
    }

    ::v-deep(.ant-modal-footer) {
      border: 0;
      background-color: #1b2c37;
    }

    ::v-deep(.ant-modal-content) {
    }

    ::v-deep(.ant-modal-close-x) {
      height: 57px;
    }

    ::v-deep(.scrollbar) {
      overflow: visible;
    }

    ::v-deep(.anticon svg) {
      width: 16px;
      color: #eef1f7;
    }

    .info-body {
      border-top: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
      color: #666;

      & > div {
        width: 25%;

        & > div:nth-of-type(1) {
          background-color: #f2f2f2;
          font-size: 16px;
        }

        div {
          height: 50px;
          padding-left: 15px;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          line-height: 50px;

          input {
            line-height: 25px;
          }
        }
      }
    }

    ::v-deep(.ant-modal-wrap) {
      overflow: visible;
    }

    ::v-deep(.ant-table-content) {
      table {
        font-size: 12px;
      }
    }

    ::v-deep(.vben-basic-table) {
      padding: 0 13px;

      .ant-table-title {
        padding: 13px 13px 0;
        background-color: #f9f9f9;

        h2 {
          font-size: 17px;
        }
      }
    }

    .bg {
      background-image: url('../../assets/images/u360.webp');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 600px 197px;
    }
  }

  .customize {
    ::v-deep(.ant-modal-header) {
      display: none;
    }
  }

  .bottomOne {
    position: absolute;
    bottom: -64px;
    left: 220px;
  }

  .bottomSec {
    position: absolute;
    bottom: -130px;
    left: 220px;
  }

  .bottomSec_en {
    left: 170px;
  }
</style>
