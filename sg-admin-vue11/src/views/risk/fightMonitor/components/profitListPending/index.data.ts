import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useGameSortStore } from '/@/store/modules/gameSort';
import { getFightSite } from '/@/api/risk';
import { isHasAuth } from '/@/utils/authFunction';
import { isControlValueSet } from '/@/utils/domUtils';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

let plateOptions: any = [];
const { t } = useI18n();
//佣金审核汇总查询条件
export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'profitListMonitor',
    colProps: { style: { marginRight: '10px' } },
    ifShow: isControlValueSet() ? false : isHasAuth('60509'),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'site',
    component: 'ApiSelect',
    labelPrefix: t('table.risk.report_fight_website'), //对打站点
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    defaultValue: '',
    componentProps: ({ formActionType, formModel, tableAction }) => {
      return {
        api: async () => {
          try {
            const resultSite = await getFightSite();
            const siteOptions = resultSite.map((site) => ({
              label: site, // 或者任何你想显示的标签
              value: site, // 这里的 value 和 label 相同，取决于你的需求
            }));
            siteOptions.unshift({
              label: t('business.common_all'), //全部
              value: '',
            });
            return siteOptions;
          } catch (error) {
            return [];
          }
        },
        labelField: 'label',
        valueField: 'value',
        allowClear: true,
        placeholder: t('common.chooseText'),
        optionFilterProp: 'label',
        onChange: async (value) => {},
        getPopupContainer: () => document.body,
      };
    },
  },

  {
    field: 'platform_id',
    component: 'ApiSelect',
    labelPrefix: t('table.report.report_platform_name'),
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    defaultValue: '',
    componentProps: ({ formActionType, formModel, tableAction }) => {
      return {
        api: () => {
          const { getPlatformList } = useGameSortStore();
          plateOptions = [];
          getPlatformList.map((item: any) => {
            if (
              item.length &&
              item[0].game_type != 8
            ) {
              plateOptions.push(...item);
            }
          });
          plateOptions = [
            { platform_name: t('business.common_all'), platform_id: '' },
            ...plateOptions,
          ];
          return plateOptions;
        },
        labelField: 'platform_name',
        valueField: 'platform_id',
        allowClear: true,
        placeholder: t('common.chooseText'),
        optionFilterProp: 'label',
        onChange: async (value) => {},
        getPopupContainer: () => document.body,
      };
    },
  },

  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
  {
    field: 'category',
    component: 'InputNumber',
    defaultValue: 1,
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.member.member_member') + ' A', //会员A
    dataIndex: 'address',
    children: [
      {
        title: t('table.risk.report_website'), //所属站点
        dataIndex: 'site_a',
        customRender: ({ record }) => {
          return record.site_a ? record.site_a : '-';
        },
      },
      {
        title: t('business.common_member_account'), //会员账号
        dataIndex: 'username_a',
      },
      {
        title: t('table.report.report_valid_bet_amount'), //有效投注
        dataIndex: 'valid_bet_amount_a',
        customRender: ({ record }) => {
          return record.valid_bet_amount_a ? record.valid_bet_amount_a : '-';
        },
      },
      {
        title: t('table.report.report_net_amount'), //会员输赢
        dataIndex: 'net_amount_a',
        customRender: ({ record }) => {
          return record.net_amount_a ? record.net_amount_a : '-';
        },
      },
    ],
  },

  {
    title: t('table.member.member_member') + ' B', //会员B
    dataIndex: 'address',
    children: [
      {
        title: t('table.risk.report_website'), //所属站点
        dataIndex: 'site_b',
        customRender: ({ record }) => {
          return record.site_b ? record.site_b : '-';
        },
      },
      {
        title: t('business.common_member_account'), //会员账号
        dataIndex: 'username_b',
      },
      {
        title: t('table.report.report_valid_bet_amount'), //有效投注
        dataIndex: 'valid_bet_amount_b',
        customRender: ({ record }) => {
          return record.valid_bet_amount_b ? record.valid_bet_amount_b : '-';
        },
      },
      {
        title: t('table.report.report_net_amount'), //会员输赢
        dataIndex: 'net_amount_b',
        customRender: ({ record }) => {
          return record.net_amount_b ? record.net_amount_b : '-';
        },
      },
    ],
  },
  {
    title: t('table.report.report_platform_name'), //平台游戏
    dataIndex: 'platform_id',
    customRender: ({ record }) => {
      const platform = plateOptions.find((item) => item.platform_id == record.platform_id);
      return platform?.platform_name ?? '-';
    },
  },
  {
    title: t('table.report.report_game_name'), //游戏名称
    dataIndex: 'game_name',
    customRender: ({ record }) => {
      return record.game_name ? record.game_name : '-';
    },
  },
  {
    title: t('table.risk.report_fight_number'), //对打笔数
    dataIndex: 'num',
    slots: { customRender: 'num' },
  },
  {
    title: t('table.risk.report_fight_amount'), //对打金额
    dataIndex: 'bet_amount',
    customRender: ({ record }) => {
      return record.bet_amount ? record.bet_amount : '-';
    },
  },

  {
    title: t('table.risk.report_trigger_time'), //触发时间
    dataIndex: 'created_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];
useAutoTableLabelWidth(columns);
