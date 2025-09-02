<template>
  <span>
    <Icon v-if="getIcon" :icon="getIcon" :size="18" :class="`${prefixCls}-wrapper__icon mr-1`" />
    <span class="content-text !m-0">{{ getI18nName }}</span>
    <a-button class="notice" type="primary" danger v-if="noticeTotal && tagName == 'total'">{{
      noticeTotal
    }}</a-button>
    <a-button
      class="notice"
      type="primary"
      danger
      v-if="financeNoticeTotal && tagName === 'total'"
      >{{ financeNoticeTotal }}</a-button
    >
    <a-button class="notice" type="primary" danger v-if="systemNoticeTotal && tagName === 'total'">{{
      systemNoticeTotal
    }}</a-button>
    <a-button class="notice" type="primary" danger v-if="notice && tagName != 'total'">{{
      notice
    }}</a-button>
  </span>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { contentProps } from '../props';
  import { storeToRefs } from 'pinia';
  import { useNoticeStore } from '/@/store/modules/notice';

  const { t } = useI18n();

  export default defineComponent({
    name: 'MenuItemContent',
    components: {
      Icon,
    },
    props: contentProps,
    setup(props) {
      let noticeTotal: any = null;
      let financeNoticeTotal: any = null;
      let noticeJson: any = null;
      let systemNoticeTotal: any = null;
      try {
        if (props.item.meta?.tagName) {
          const noticeStore = useNoticeStore();
          if (props.item.path.indexOf('risk') >= 0) {
            let { getRiskTotal, getRiskNotice } = storeToRefs(noticeStore);
            noticeJson = getRiskNotice;
            noticeTotal = getRiskTotal;
          } else if (props.item.path.indexOf('finance') >= 0) {
            let { getFinanceTotal, getFinanceNotice } = storeToRefs(noticeStore);
            noticeJson = getFinanceNotice;
            financeNoticeTotal = getFinanceTotal;
          } else if (props.item.path.indexOf('system') >= 0) {
            let { getSystemNotice, getSystemTotal } = storeToRefs(noticeStore);
            noticeJson = getSystemNotice;
            systemNoticeTotal = getSystemTotal;
          }
        }
      } catch (error) {
        console.error(error);
      }

      const { prefixCls } = useDesign('basic-menu-item-content');
      const getI18nName = computed(() => t(props.item?.name));
      const getIcon = computed(() => props.item?.icon);
      const tagName = computed(() => props.item?.meta?.tagName);
      const notice = computed(() => (noticeJson ? noticeJson.value[props.item?.tagName] : ''));
      return {
        prefixCls,
        getI18nName,
        getIcon,
        noticeTotal,
        notice,
        tagName,
        financeNoticeTotal,
        systemNoticeTotal,
      };
    },
  });
</script>
<style lang="less" scoped>
  .content-text {
    font-size: 18px;
    //font-weight: 600;
    font-weight: 500;
  }

  svg {
    margin-bottom: 5px;
  }

  .notice {
    top: -3px;
    height: 13px;
    margin-left: 4px;
    padding: 0 3px;
    border-color: e91134;
    background-color: #e91134;
    font-size: 13px;
    line-height: 7px;
  }
</style>
