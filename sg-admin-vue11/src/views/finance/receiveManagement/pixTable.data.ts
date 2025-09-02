import { BasicColumn } from '/@/components/Table';
import { message } from 'ant-design-vue';
import { h } from 'vue';
import { getLevelValues } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { COLORS } from '/@/views/common/const';
import Icon from '/@/components/Icon';
import svgComponent from './component/svgComponent.vue';
import { withdraw_merchant_balance } from '/@/api/finance';
import { SetTooltip } from '/@/views/common/component';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import eventBus from '/@/utils/eventBus';
const { t } = useI18n();
// 表格内容
export const pixColumns: BasicColumn[] = [
  {
    title: t('business.common_sort'),
    dataIndex: 'id',
    width: 80,
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
  },
  {
    title: t('table.finance.finance_Payment_platform'),
    dataIndex: 'company_name',
    customRender: ({ record }) => {
      return record.company_name ? record.company_name : '-';
    },
  },
  {
    title: t('table.finance.finance_Merchant_number'),
    dataIndex: 'account',
  },
  {
    title: t('table.finance.finance_Payment_method1'),
    dataIndex: 'method_name',
  },
  {
    title: t('table.finance.finance_Merchant_balance'),
    dataIndex: 'balance',
    // slots: { filterIcon: 'balance' },
    customRender: ({ record }) => {
      return h('div', { class: 'icon-with-text' }, [
        h('span', { class: 'text mr-5px' }, record.balance),
        [
          record.query_balance
            ? h(svgComponent, {
                class: 'table_svg ',
                onClick: () => {
                  withdraw_merchant_balance({
                    id: record.company_id, //代付平台id
                    method_id: record.method_id, //代付方式id
                    api_file_name: record.api_file_name || '-', //api_file_name
                  }).then((data) => {
                    if (data.balance) message.success(data.message);
                    eventBus.emit('freshBalance');
                  });
                },
              })
            : '',
        ],
      ]);
    },
  },
  {
    title: t('table.finance.finance_Authorization_amount'),
    dataIndex: 'credit_amount',
  },
  {
    title: t('table.finance.finance_down_limit'),
    dataIndex: 'min_amount',
  },
  {
    title: t('table.finance.finance_up_limit'),
    dataIndex: 'max_amount',
  },
  {
    title: t('table.finance.finance_opening_level'),
    dataIndex: 'level_ids',
    width: 280,
    customRender: ({ record }) => {
      if (record.level_ids && record.level_ids.length > 0) {
        const ids = JSON.parse(JSON.stringify(record.level_ids)).map(parseFloat);
        const levelValue = getLevelValues(ids, 'type');
        return SetTooltip(levelValue, 20);
      } else {
        return '-'; // 或者根据需要返回适当的值
      }
    },
  },
  {
    title: t('business.common_update_time'),
    minWidth: 160,
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const status = record.state;
      const color = status == 1 ? COLORS.SUCCESS : COLORS.ERROR;
      const text = status == 1 ? t('business.common_normal') : t('business.common_deactivate'); //启用，停用
      return h('div', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(pixColumns);
