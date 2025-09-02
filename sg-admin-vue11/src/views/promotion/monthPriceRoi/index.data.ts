import { FormSchema, BasicColumn } from '/@/components/Table';
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { useMonthRoiOptions } from '../../common/commonSetting';
import { getAdGroupSelect } from '/@/api/promotion';
import eventBus from '/@/utils/eventBus';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { monthRoiOptions } = useMonthRoiOptions();

const { t } = useI18n();
const beforeTimeChange = ref('');
const isOpen = ref(false);

export const searchSchema: FormSchema[] = [
  {
    field: 'new',
    component: 'Input',
    label: '',
    slot: 'newAdd',
    colProps: {
      style: { marginRight: '10px' },
    },
  },
  {
    field: 'isShow',
    component: '',
    defaultValue: 0,
    show: false,
  },
  {
    field: 'status',
    labelPrefix: t('business.common_status'),
    defaultValue: 2,
    component: 'Select',
    componentProps: {
      options: monthRoiOptions,
      getPopupContainer: () => document.body,
      allowClear: false,
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    ifShow: ({ values }) => values.isShow == 0,
  },
  {
    field: 'gid',
    labelPrefix: t('routes.promotion.ad_grouping'),
    labelPrefixWidth: 80,
    component: 'ApiSelect',
    defaultValue: '',
    componentProps: () => {
      return {
        api: async () => {
          const { data: adGroupList }: any = await getAdGroupSelect();
          const filteredList =
            adGroupList
              ?.filter((el) => el.id != 0)
              .map((item) => ({
                label: item.name,
                value: item.id,
              })) || [];

          return [{ label: t('business.common_all'), value: '' }, ...filteredList];
        },
        allowClear: false,
        getPopupContainer: () => document.body,
      };
    },
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: ({ formActionType }) => {
      return {
        format: 'YYYY-MM-DD',
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        getPopupContainer: () => document.body,
        onFocus: () => {
          if (!isOpen.value) {
            const currentTime = formActionType.getFieldsValue().time || [];
            beforeTimeChange.value = JSON.stringify(currentTime);
            isOpen.value = true;
          }
        },
        onOpenChange: (state) => {
          if (!state) {
            const afterTimeChange = formActionType.getFieldsValue().time || [];
            const isChange =
              beforeTimeChange.value == JSON.stringify(afterTimeChange) ? false : true;
            isOpen.value = false;
            eventBus.emit('onTimeChange', isChange);
          }
        },
        onChange: (v) => {
          if (!v) {
            eventBus.emit('onTimeChange', true);
          }
        },
      };
    },
  },
  {
    field: 'modelName',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
  {
    field: 'sub',
    component: 'Input',
    slot: 'submitSlot',
  },
  {
    field: 'status',
    component: 'Input',
    slot: 'typeColSlot',
    colProps: { span: 24, style: { marginBottom: '14px' } },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.race_price.form_ad_time_'),
    dataIndex: 'date',
    key: 'date',
    width: 160,
    slots: { customRender: 'status' },
    fixed: true,
  },
  {
    title: t('table.race_price.form_ad_name'),
    dataIndex: 'name',
    minWidth: 120,
    // fixed: true,
    slots: { customRender: 'advNameSlot' },
  },
  {
    title: t('table.member.member_agent_account'),
    dataIndex: 'username',
    minWidth: 130,
    // fixed: true,
  },
  {
    title: t('table.race_price.form_ad_price'),
    dataIndex: 'price',
    minWidth: 100,
    // fixed: true,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.promotion.promotion_consumption_days'),
    dataIndex: 'consume_day',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.promotion.promotion_amount_consumed'),
    dataIndex: 'consume_amt',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.promotion.promotion_advertising_balance'),
    dataIndex: 'balance',
    width: 120,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.race_price.table_register_person'),
    width: 220,
    dataIndex: 'reg_cnt',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.promotion.promotion_number_of_people_recharging'),
    dataIndex: 'deposit_cnt',
    width: 240,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_change_percent'),
    dataIndex: 'deposit_rate',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return `${record.deposit_rate}%`;
    },
  },
  {
    title: t('table.promotion.promotion_ROI'),
    dataIndex: 'deposit_roi_rate',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return `${record.deposit_roi_rate}%`;
    },
  },
  {
    title: t('table.report.report_deposit_amount'),
    width: 140,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'deposit_amt',
  },
  {
    title: t('table.report.report_withdraw_amount'),
    width: 160,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'withdraw_amt',
  },
  {
    title: t('table.race_price.table_cash_profit'),
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'cash_amt',
  },
  {
    title: t('table.promotion.promotion_recover_ROI'),
    dataIndex: 'rec_rate',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return `${record.rec_rate}%`;
    },
  },
  {
    title: t('table.race_price.table_register_cost'),
    width: 140,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'reg_cost',
  },
  {
    title: t('table.race_price.table_recharge_cost'),
    width: 140,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'deposit_cost',
  },
  {
    title: t('table.race_price.table_per_capita_deposit'),
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'deposit_amt_agv',
  },
  {
    title: t('ARPPU'),
    width: 140,
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'arppu',
  },
  {
    title: t('table.system.operater'),
    width: 90,
    dataIndex: 'created_by',
  },
  {
    title: t('business.common_update_time'),
    minWidth: 200,
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.google.report_columns_APP_operate'),
    minWidth: 160,
    slots: { customRender: 'action' },
    dataIndex: 'valid_bet_amount',
    ifShow: auths(['30431', '30432', '30433']),
  },
];
useAutoTableLabelWidth(columns);
