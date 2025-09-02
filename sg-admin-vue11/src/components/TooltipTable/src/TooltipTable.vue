<template>
  <span class="mr-[6px]">{{ record.date }}</span>
  <Tooltip placement="topRight" :overlayStyle="_getOverlayStyle" :mouseEnterDelay="0.05">
    <template #title>
      <BasicTable @register="registerTable" />
    </template>
    <eye-filled />
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, CSSProperties, computed } from 'vue';
  import { toTimezone } from '/@/utils/dateUtil';
  import { Tooltip } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getAdMonthlyDetail } from '/@/api/promotion';
  import { EyeFilled } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const props = {
    record: {
      type: Object,
      default: () => ({}),
    },
  };
  /** 列数 */
  const localColumns: BasicColumn[] = [
    {
      title: t('table.risk.report_phase'),
      width: 80,
      dataIndex: 'period',
    },
    {
      title: t('business.common_count_date'),
      width: 120,
      dataIndex: 'date',
    },
    {
      title: t('table.report.report_amount'),
      width: 80,
      dataIndex: 'price',
    },
    {
      title: t('business.common_remark'), //代理帐号
      width: 150,
      dataIndex: 'remark',
      ellipsis: false,
    },
  ];

  const _getOverlayStyle = computed<CSSProperties>(() => {
    return {
      minWidth: '480px',
    };
  });

  export default defineComponent({
    name: 'TooltipTable',
    components: { Tooltip, BasicTable, EyeFilled },
    props,
    setup(props) {
      const [registerTable, { reload, getForm }] = useTable({
        columns: localColumns,
        api: async (params) => {
          params['channel_id'] = props.record?.channel_id;
          const { data } = await getAdMonthlyDetail(params);
          return data;
        },
        immediate: true,
        showIndexColumn: false,
        pagination: false,
      });
      return {
        registerTable,
        reload,
        getForm,
        _getOverlayStyle,
        useTable,
        toTimezone,
      };
    },
  });
</script>
