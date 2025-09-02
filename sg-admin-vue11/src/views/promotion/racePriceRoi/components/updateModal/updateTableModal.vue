<template>
  <div class="mb-5">
    <BasicTable @register="registerSumTable" class="!p-0 with-more-input" />
  </div>
  <BasicTable
    @register="registerDetailTable"
    :scroll="{ x: 0, y: 300 }"
    class="!p-0 with-more-input"
  />
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { dataColumns, sumColumns } from './data';
  import { computed, ref } from 'vue';
  import { getAdBidsDetail } from '/@/api/promotion';
  import { cloneDeep } from 'lodash-es';

  interface Props {
    recordList: any[];
  }
  const props = defineProps<Props>();
  const { t } = useI18n();
  const sumData = ref([]);
  const record = computed<any>(() => props.recordList);
  const [registerDetailTable, { reload }] = useTable({
    api: async (param) => {
      param.username = record.value.username;
      const { data } = await getAdBidsDetail(param);
      const _data = cloneDeep(data);
      sumData.value = data.c;
      sumReload();
      delete _data.c;
      return _data;
    },
    columns: dataColumns,
    bordered: true,
    useSearchForm: false,
    showIndexColumn: false,
    formConfig: {
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showActionButtonGroup: false,
    },
    beforeFetch: (params) => {
      setDateParmaTime(params);
      setDateParmas(params);
      return params;
    },
  });
  const [registerSumTable, { reload: sumReload }] = useTable({
    api: async () => {
      return sumData.value;
    },
    columns: sumColumns,
    bordered: true,
    useSearchForm: false,
    showIndexColumn: false,
    pagination: false,
    immediate: false,
    formConfig: {
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showActionButtonGroup: false,
    },
  });
</script>
<style scoped lang="less"></style>
