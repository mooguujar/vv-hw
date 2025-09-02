<template>
  <BasicModal
    @register="redEnvelopeModal"
    :title="`${t('modalForm.discountActivity.redRecord')} (${getName})`"
    :showCancelBtn="false"
    :showOkBtn="false"
    :width="1200"
  >
    <BasicTable @register="trdEnvelopeTable">
      <template #customTableHeader v-if="currentList.length > 0">
        <cdButtonCurrency
          :btn-list="currentList"
          @change-button-currency="changeClick"
          v-model="activeKey"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getPromoDetail, getPromoRedenvelope } from '/@/api/activity';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { columns, schemas, useLocalList } from './index.data';
  import { useMemberStore } from '/@/store/modules/member';
  import { setStartformatDate, setEndformatDate } from '/@/utils/dateUtil';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';

  const FORM_SIZE = useFormSetting().getFormSize;
  const memberStore = useMemberStore();
  const { currencyTreeList } = useTreeListStore();
  const currentList = ref([] as any);
  // 获取层级下拉
  memberStore.getLevelList();
  const langBtn = ref('zh_CN' as string);
  const localeList = useLocalList();
  const { t } = useI18n();
  const activeKey = ref('');
  const langList = localeList.map((item) => {
    return {
      label: item.country,
      value: item.event,
    };
  });
  const currencyListTranslate = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
  };
  const getPid = ref(null as any);
  const getName = ref('' as any);
  let timeTags = [];
  const result = ref(null as any);

  const [redEnvelopeModal] = useModalInner(async ({ data }) => {
    getPid.value = data.id;
    getName.value = data.zh_name;
    result.value = await getPromoDetail({ pid: data.id });
  });

  function updatedTimeTags() {
    if (activeKey.value == '') return;
    timeTags = JSON.parse(result.value.config)
      [activeKey.value].period.filter((item) => item[0] !== '8888999') // 过滤掉 item[0] 等于 '888999' 的情况
      .map((item) => {
        return {
          label: item[0],
          value: String(parseInt(item[0].replace(':', ''), 10)),
        };
      });
    getForm().updateSchema({
      field: 'period',
      labelPrefix: t('modalForm.discountActivity.times_period'), //时间段
      labelPrefixWidth: 60,
      component: 'Select',
      colProps: { span: 4 },
      componentProps: {
        options: timeTags,
        placeholder: t('business.common_all'),
        getPopupContainer: () => document.body,
      },
    });
  }

  const [trdEnvelopeTable, { reload, getForm, getRawDataSource }] = useTable({
    api: getPromoRedenvelope,
    columns: columns,
    showIndexColumn: false,
    bordered: true,
    useSearchForm: true,
    maxHeight: 450,
    formConfig: {
      schemas: schemas(),
      showAdvancedButton: false,
      size: FORM_SIZE,
      actionColOptions: {
        class: 't-form-label-com',
        span: 2,
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      params['pid'] = getPid.value;
      params['tongue'] = activeKey.value;
      if (params?.time?.length > 0) {
        params['st'] = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params['et'] = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      if (params.searchValue) {
        params[params.searchSelect] = params.searchValue;
      }
      delete params['searchValue'];
      delete params['searchSelect'];
      // params['st'] = '2024-02-13 00:00:00';
      // params['et'] = '2024-05-13 23:59:59';
    },
    afterFetch: (res) => {
      const data = getRawDataSource();
      if (data?.n?.length > 0) {
        if (!activeKey.value) {
          // activeKey.value = data.n[0];
          setTimeout(() => {
            updatedTimeTags();
            // reload();
          }, 0);
        }
        currentList.value = currencyTreeList.filter((item) => data.n.includes(item.id));
      } else {
        activeKey.value = '';
        currentList.value = [];
      }
    },
  });
  function handleModalSuccess(v) {
    //langBtn.value = v;
    reload();
  }
  function changeClick(v: any) {
    activeKey.value = v;
    updatedTimeTags();
    reload();
  }
</script>
<style lang="scss" scoped>
  ::v-deep(.ant-input-affix-wrapper-lg) {
    padding: 6.5px 6px;
  }
</style>
