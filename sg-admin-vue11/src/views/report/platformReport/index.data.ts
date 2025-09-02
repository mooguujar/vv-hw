import { BasicColumn } from '/@/components/Table';
import dayjs from 'dayjs';
import { h } from 'vue';
import { mul } from '/@/utils/number';
import { useGameTabList } from '/@/views/common/commonSetting';
import { useGameSortStore } from '/@/store/modules/gameSort';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { gameTabList } = useGameTabList();
const { t } = useI18n();
const selectGameTabList: any = [];
gameTabList.forEach((item) => {
  selectGameTabList.push({
    value: item.key,
    label: item.value,
  });
});

const gameSortStore = useGameSortStore();
await gameSortStore.setgame_typeList(); //调用游戏类型接口
const { getgame_typeList } = useGameSortStore();
if (getgame_typeList && getgame_typeList[0]) {
  getgame_typeList[0].name = t('business.common_all');
}

const { getPlatformList } = useGameSortStore();
let plateOptions: any = [];
for (const key in getPlatformList) {
  plateOptions.push(...getPlatformList[key]);
}
plateOptions =
  plateOptions &&
  plateOptions.map((item) => {
    return {
      ...item,
      label: item.platform_name,
      value: item.platform_id,
    };
  });
plateOptions = [...[{ label: t('business.common_all'), value: '' }], ...plateOptions]; //全部

export const searchSchema: any = () => {
  return [
    {
      field: '',
      component: 'Input',
      label: '',
      slot: 'grupList',
      colProps: { style: { marginRight: '10px' } },
    },
    {
      field: 'time',
      labelPrefix: t('business.time_limite'),
      labelPrefixWidth: 75,
      component: 'RangePicker',
      defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'game_class',
      component: 'ApiSelect',
      labelPrefix: t('business.common_game_type'),
      defaultValue: 'all',
      colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
      componentProps: ({ formActionType, formModel, tableAction }) => {
        return {
          allowClear: true,
          placeholder: t('common.chooseText'),
          api: () => {
            return getgame_typeList;
          },
          labelField: 'name',
          valueField: 'game_type',
          getPopupContainer: () => document.body,
          onChange: async (value) => {
            const { getPlatformList } = useGameSortStore();
            if (!value) return;
            let plateOptions = [];
            if (value == 'all') {
              for (const key in getPlatformList) {
                plateOptions.push(...getPlatformList[key]);
              }
            } else {
              plateOptions = getPlatformList[value];
            }
            plateOptions =
              plateOptions &&
              plateOptions.map((item) => {
                return {
                  ...item,
                  label: item.platform_name,
                  value: item.platform_id,
                };
              });
            plateOptions = [...[{ label: t('business.common_all'), value: '' }], ...plateOptions];
            const { updateSchema, setFieldsValue } = formActionType;
            await setFieldsValue({ platform_id: null });
            updateSchema(
              {
                field: 'platform_id',
                componentProps: {
                  optionFilterProp: 'label',
                  placeholder: t('common.chooseText'), //请选择
                  api: () => {
                    return plateOptions;
                  },
                  getPopupContainer: () => document.body,
                  onChange: async (value, platform) => {
                    if (!value) return;
                    await setFieldsValue({ game_class: platform?.game_type });
                  },
                },
              },
              false,
            );
          },
        };
      },
    },
    {
      field: 'platform_id',
      component: 'ApiSelect',
      labelPrefix: t('business.common_game_type'),
      colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
      defaultValue: '',
      componentProps: ({ formActionType, formModel, tableAction }) => {
        return {
          api: () => {
            return plateOptions;
          },
          allowClear: true,
          placeholder: t('common.chooseText'), //请选择
          optionFilterProp: 'label',
          onChange: async (value) => {},
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: '',
      labelPrefix: '',
      //labelPrefixWidth: 35,
      labelBorder: false,
      component: 'InputGroup',
      slot: 'custom',
    },
  ];
};
/** 平台报表列表 */
export const columns: BasicColumn[] = [
  {
    title: t('table.report.report_bet_content'),
    dataIndex: 'platform_name',
    slots: { customRender: 'action', style: { textAlign: 'center' } },
  },
  {
    title: t('table.report.report_member_count'),
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'member_count',
  },
  {
    title: t('table.report.report_bet_count'),
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'bet_count',
  },
  {
    title: t('table.report.report_bet_count_proportion'),
    dataIndex: 'bet_count_proportion',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const bet_count_proportion = record.bet_count_proportion
        ? `${mul(Number(record.bet_count_proportion), 100)}%`
        : '-';
      return bet_count_proportion;
    },
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const net_amount = record.net_amount;
      const color = Number(net_amount) > 0 ? '#E91134' : '#1CD91C';
      return h('span', { style: { color } }, record.net_amount);
    },
  },
  {
    title: t('table.report.report_profit_rate'),
    dataIndex: 'profit_rate',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
      return h(
        'span',
        {
          style: { color: Number(record.profit_rate) > 0 ? '#E91134' : '#1CD91C' },
        },
        profit_rate,
      );
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
