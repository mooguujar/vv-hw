<template>
  <div>
    <BasicModal
      okText=""
      cancelText=""
      :minHeight="200"
      :title="$t('table.report.report_retain_data')"
      @register="registerHistoryModal"
      :width="1200"
      :destroyOnClose="true"
      :titleIcon="props.titleicon"
      :woModalBtnGroups="true"
    >
      <BasicTable @register="registerTable" />
    </BasicModal>
  </div>
</template>
<script lang="ts" setup name="RetainModal">
  import { ref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { toTimezone } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getChannelReportRetain } from '/@/api/promotion';
  import dayjs from 'dayjs';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

  const { t } = useI18n();
  const props = defineProps<{
    titleicon: string;
  }>();
  const recevidata: any = ref({});

  const columns: BasicColumn[] = [
    {
      title: t('business.common_currency'),
      dataIndex: 'currency_name',
      minWidth: 100,
      customRender: ({ record }) => {
        return record.currency_name
          ? h(cdBlockCurrency, { currencyName: record.currency_name })
          : '-';
      },
    },
    {
      title: t('table.promotion.promotion_static_date'),
      dataIndex: 'time',
      minWidth: 120,
      customRender: ({ record }) => {
        return record.time ? toTimezone(record.time, 'YYYY-MM-DD') : '-';
      },
    },
    {
      title: t('table.report.report_day2_retain_t'),
      minWidth: 100,
      dataIndex: 'th2_deposit_amount',
      customRender: ({ record }) => {
        // 定义要展示的字段及其标签
        const fields = [
          {
            label: t('table.finance.finance_Deposit_amount'),
            value: record.th2_deposit_amount || 0,
          },
          { label: t('table.report.report_retain_num_total'), value: record.th2_deposit_num || 0 },
          {
            label: t('table.report.report_retain_percent'),
            value: record.th2_deposit_rate
              ? `${(parseFloat(record.th2_deposit_rate) * 100).toFixed(2)}%`
              : 0,
          },
        ];

        return h(
          'div',
          {
            style: { 'white-space': 'pre-line', overflow: 'hidden' },
          },
          fields.map((field) =>
            h('div', {}, [
              // 显示 label (不变)
              `${field.label}: `,
              // 显示 value，留存率的值带红色
              h(
                'span',
                {
                  style:
                    field.label === t('table.report.report_retain_percent')
                      ? { color: '#E91134' }
                      : {}, // 仅对留存率的值添加红色样式
                },
                field.value,
              ),
            ]),
          ),
        );
      },
    },
    {
      title: t('table.report.report_day3_retain'),
      minWidth: 100,
      dataIndex: 'th3_deposit_amount',
      customRender: ({ record }) => {
        // 定义要展示的字段及其标签
        const fields = [
          {
            label: t('table.finance.finance_Deposit_amount'),
            value: record.th3_deposit_amount || 0,
          },
          { label: t('table.report.report_retain_num_total'), value: record.th3_deposit_num || 0 },
          {
            label: t('table.report.report_retain_percent'),
            value: record.th3_deposit_rate
              ? `${(parseFloat(record.th3_deposit_rate) * 100).toFixed(2)}%`
              : 0,
          },
        ];

        // 通过循环拼接展示数据
        return h(
          'div',
          {
            style: { 'white-space': 'pre-line', overflow: 'hidden' },
          },
          fields.map((field) =>
            h('div', {}, [
              // 显示 label (不变)
              `${field.label}: `,
              // 显示 value，留存率的值带红色
              h(
                'span',
                {
                  style:
                    field.label === t('table.report.report_retain_percent')
                      ? { color: '#E91134' }
                      : {}, // 仅对留存率的值添加红色样式
                },
                field.value,
              ),
            ]),
          ),
        );
      },
    },
    {
      title: t('table.report.report_day5_retain'),
      minWidth: 100,
      dataIndex: 'th5_deposit_amount',
      customRender: ({ record }) => {
        // 定义要展示的字段及其标签
        const fields = [
          {
            label: t('table.finance.finance_Deposit_amount'),
            value: record.th5_deposit_amount || 0,
          },
          { label: t('table.report.report_retain_num_total'), value: record.th5_deposit_num || 0 },
          {
            label: t('table.report.report_retain_percent'),
            value: record.th5_deposit_rate
              ? `${(parseFloat(record.th5_deposit_rate) * 100).toFixed(2)}%`
              : 0,
          },
        ];
        return h(
          'div',
          {
            style: { 'white-space': 'pre-line', overflow: 'hidden' },
          },
          fields.map((field) =>
            h('div', {}, [
              // 显示 label (不变)
              `${field.label}: `,
              // 显示 value，留存率的值带红色
              h(
                'span',
                {
                  style:
                    field.label === t('table.report.report_retain_percent')
                      ? { color: '#E91134' }
                      : {}, // 仅对留存率的值添加红色样式
                },
                field.value,
              ),
            ]),
          ),
        );
      },
    },
    {
      title: t('table.report.report_day7_retain'),
      minWidth: 100,
      dataIndex: 'th7_deposit_amount',
      customRender: ({ record }) => {
        // 定义要展示的字段及其标签
        const fields = [
          {
            label: t('table.finance.finance_Deposit_amount'),
            value: record.th7_deposit_amount || 0,
          },
          { label: t('table.report.report_retain_num_total'), value: record.th7_deposit_num || 0 },
          {
            label: t('table.report.report_retain_percent'),
            value: record.th7_deposit_rate
              ? `${(parseFloat(record.th7_deposit_rate) * 100).toFixed(2)}%`
              : 0,
          },
        ];

        return h(
          'div',
          {
            style: { 'white-space': 'pre-line', overflow: 'hidden' },
          },
          fields.map((field) =>
            h('div', {}, [
              // 显示 label (不变)
              `${field.label}: `,
              // 显示 value，留存率的值带红色
              h(
                'span',
                {
                  style:
                    field.label === t('table.report.report_retain_percent')
                      ? { color: '#E91134' }
                      : {}, // 仅对留存率的值添加红色样式
                },
                field.value,
              ),
            ]),
          ),
        );
      },
    },
  ];

  const columnsIds: BasicColumn[] = [
    {
      title: t('table.promotion.promotion_tunnel_ID'),
      dataIndex: 'currency_name',
      minWidth: 100,
      customRender: ({ record }) => {
        return record.channel_id ? record.channel_id : '-';
      },
    },
    {
      title: t('table.promotion.promotion_tunnel_name'),
      dataIndex: 'channel_name',
      minWidth: 120,
      customRender: ({ record }) => {
        return record.channel_name ? record.channel_name : '-';
      },
    },
    {
      title: t('table.promotion.promotion_agency_account'),
      dataIndex: 'username',
      minWidth: 120,
      customRender: ({ record }) => {
        return record.username ? record.username : '-';
      },
    },
  ];

  const [registerHistoryModal] = useModalInner((data) => {
    recevidata.value = data;
    recevidata.value.channel_id
      ? setColumns([...columns.slice(0, 2), ...columnsIds, ...columns.slice(2)])
      : setColumns(columns);
  });

  const [registerTable, { setColumns }] = useTable({
    api: getReportRetain,
    columns,
    bordered: true,
    maxHeight: 450,
    showIndexColumn: false,
    pagination: false,
    beforeFetch: (param) => {
      param['channel_id'] = recevidata.value.channel_id;
      param['start_time'] = dayjs(recevidata.value.time)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      param['end_time'] = dayjs(recevidata.value.time).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    },
  });

  async function getReportRetain(params) {
    // 获取渠道统计
    const response = await getChannelReportRetain(params);
    return [response];
  }
</script>
