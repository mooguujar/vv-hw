<template>
  <div class="venues">
    <BasicModal
      :showCancelBtn="false"
      :title="$t('business.Venue_balance')"
      :showOkBtn="false"
      okText="$t('business.Venue_recy')"
      @register="registerVenues"
      :width="800"
    >
      <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }">
        <template #action>
          <span class="primary-color cursor-pointer" @click="okRecycle">{{
            $t('business.Venue_recy_1')
          }}</span>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
  import { getBalanceVenues, setBalanceRecycle } from '/@/api/member/index';
  import { currentyOptions } from '/@/settings/commonSetting';
  import { Button, message } from 'ant-design-vue';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { currencyTreeList } = useTreeListStore();

  const getData = ref({} as any);
  const showOklBtn = ref(false as any);
  const FORM_SIZE = useFormSetting().getFormSize;
  const { t } = useI18n();
  const columns: BasicColumn[] = [
    {
      title: t('business.common_currency'),
      dataIndex: 'currency_id',
      customRender: ({ record }) =>
        h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
    },
    {
      title: t('table.system.system_game_sort'),
      dataIndex: 'pname',
    },
    {
      title: t('common.balance'),
      dataIndex: 'balance',
    },
    {
      title: t('component.upload.operating'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  ];

  const schemas: FormSchema[] = [
    {
      field: 'platform_id',
      labelPrefix: t('business.changguan'),
      // labelPrefixWidth: 50,
      component: 'Select',
      colProps: { span: 7 },
      defaultValue: '',
      componentProps: ({ formActionType }) => {
        return {
          options: [
            { label: t('business.common_all'), value: '' },
            { label: 'AG', value: '208' },
            { label: 'BBIN', value: '107' },
            { label: 'MT', value: '204' },
            { label: t('common.leyou'), value: '209' },
            { label: t('common.tianyou'), value: '210' },
            { label: 'TP', value: '110' },
            // { label: 'TPFish', value: '214' },
            // { label: 'TPSlot', value: '323' },
          ],
          getPopupContainer: () => document.body,
          onChange: (val) => {
            if (val) {
              formActionType.setFieldsValue({ wcur: '701', gcur: '701' });
            }
          },
        };
      },
    },
    {
      field: 'wcur',
      labelPrefix: t('business.qb_bz'),
      labelPrefixWidth: 80,
      colProps: { span: 8 },
      component: 'IconSelect',
      defaultValue: '',
      componentProps: () => {
        const arr = [{ label: t('business.common_all'), value: '' }];
        return {
          options: [...arr, ...currencyTreeList],
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'gcur',
      labelPrefix: t('business.game_bz'),
      component: 'IconSelect',
      labelPrefixWidth: 80,
      colProps: { span: 7 },
      defaultValue: '',
      componentProps: () => {
        return {
          options: [
            { label: t('business.common_all'), value: '' },
            { label: 'CNY', value: '701' },
            { label: 'USDT', value: '706' },
          ],
        };
      },
    },
  ];
  const [registerTable, { getForm, reload, getDataSource }] = useTable({
    api: getBalanceVenues,
    columns,
    bordered: true,
    immediate: false,
    showIndexColumn: false,
    pagination: false,
    useSearchForm: true,
    formConfig: {
      size: FORM_SIZE,
      schemas,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-label-com ',
        // class: 't-form-label-com !w-130px !max-w-150px',
        span: 1,
      },
    },
    beforeFetch: (params) => {
      params['uid'] = getData.value.uid;
      delete params['page'];
      delete params['page_size'];
    },
    afterFetch: (res) => {
      if (res) {
        showOklBtn.value = true;
      } else {
        showOklBtn.value = false;
      }
      //showOklBtn.value  = res || res?.length ? true:  false
    },
  });
  const [registerVenues, { closeModal }] = useModalInner(async (data) => {
    getData.value = data.data;
    reload();
  });
  async function okRecycle() {
    const getForm1 = await getForm();
    const values = await getForm1.validate();
    const { status, data } = await setBalanceRecycle({ uid: getData.value.uid, ...values });
    if (status) {
      message.success(data);
      reload();
      closeModal();
    }
  }
</script>
