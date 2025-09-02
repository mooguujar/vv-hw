import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tooltip, Switch } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { openChannelState } from '/@/api/promotion';
import { useMessage } from '/@/hooks/web/useMessage';
import { auths, isHasAuth } from '/@/utils/authFunction';
import { useTreeListStore } from '/@/store/modules/treeList';
import eventBus from '/@/utils/eventBus';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { isControlValueSet } from '/@/utils/domUtils';
import dayjs from 'dayjs';

const { t } = useI18n();
const cannalNameObj = {
  1: t('table.promotion.link_type_2'),
  2: t('table.promotion.link_type_1'),
};
const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
        },
        text,
      ),
  );
};
export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
    // ifShow: isHasAuth('70837'),
  },
  // {
  //   field: 'start_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_period_start'), //开始时间
  //   labelPrefixWidth: 75,
  //   colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  //   slot: 'startDate',
  //   componentProps: {
  //     getPopupContainer: () => document.body,
  //   },
  // },
  // {
  //   field: 'end_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_period_end'), //结束时间
  //   labelPrefixWidth: 75,
  //   colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  //   slot: 'endDate',
  //   componentProps: {
  //     getPopupContainer: () => document.body,
  //   },
  // },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    // defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
    colProps: { xxl: 7, xl: 7, lg: 7, md: 12, sm: 14 },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      disabledDate: (date) => {
        return date.valueOf() > dayjs().endOf('days').valueOf();
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('common.promoters'), //渠道ID
    dataIndex: 'group_name',
    slots: { customRender: 'groupName' },
    // customCell: () => {
    //   return {
    //     class: 'primary-color',
    //   };
    // },
  },
  {
    title: t('table.promotion.promotion_tunnel_ID'),
    dataIndex: 'id',
  },
  {
    title: t('table.promotion.promotion_tunnel_name'), //渠道名称
    dataIndex: 'channel_name',
    // customRender: ({ record }) => {
    //   return setTooltip(record.channel_name);
    // },
  },
  {
    title: t('table.promotion.promotion_agency_account'), //代理账号
    dataIndex: 'agent_account',
    // slots: { customRender: 'agent', style: { textAlign: 'center' } },
    // customRender: ({ record }) => {
    //   return setTooltip(record.agent_account);
    // },
  },
  {
    title: t('table.google.report_columns_model_name'), // 模板名称
    dataIndex: 'nav_template',
    customRender: ({ record }) => {
      const { getPostChannelTemplateListData } = useTreeListStore();

      const findtemplate = getPostChannelTemplateListData?.find(
        (el) => el.id === record.nav_template,
      );
      return record.nav_location === 5
        ? record.nav_template
          ? findtemplate?.name.length > 7
            ? setTooltip(findtemplate?.name)
            : findtemplate?.name ?? '-'
          : t('common.random')
        : '-';
    },
  },
  {
    title: t('table.promotion.link_type'), // 模板名称
    dataIndex: 'canalName',
    customRender: ({ record }) => {
      return cannalNameObj[record.link_type];
    },
  },
  // {
  //   title: '赠送金额',
  //   dataIndex: 'amount',
  //   minWidth: 100,
  //   customRender: ({ record }) => {
  //     const renderCurrencyDisplay = (record) => {
  //       return h('div', { class: 'currency-display' }, [
  //         h(cdIconCurrency, {
  //           icon: coinType[record.lang],
  //           style: { width: '20px', height: '20px', marginRight: '5px' },
  //         }), // 图标
  //         h('span', { class: 'amount' }, record.amount), // 显示金额
  //       ]);
  //     };

  //     const { nav_location, gift, amount, fix } = record;

  //     if (nav_location == 5) {
  //       return gift == 2
  //         ? amount
  //           ? renderCurrencyDisplay(record)
  //           : '-'
  //         : t('v.discount.activity.payConfig2');
  //     } else {
  //       return fix == 1
  //         ? gift == 2
  //           ? amount
  //             ? renderCurrencyDisplay(record)
  //             : '-'
  //           : t('v.discount.activity.payConfig2')
  //         : '-';
  //     }
  //   },
  // },
  {
    title: t('table.system.system_promotion'), //推广链接/推广码
    dataIndex: 'channel_domain',
    minWidth: 200,
    slots: { customRender: 'chanelLink', style: { textAlign: 'center' } },
    customRender: ({ record }) => {
      return setTooltip(record.channel_domain);
    },
  },
  {
    title: t('common.apkAddress'), // Android地址
    dataIndex: 'apk',
    slots: { customRender: 'chanelapk', style: { textAlign: 'center' } },
    customRender: ({ record }) => {
      return record.apk ? record.apk : '-';
    },
  },
  {
    title: t('common.ipaAddress'), // iOS地址
    dataIndex: 'ios',
    slots: { customRender: 'chanelios', style: { textAlign: 'center' } },
    customRender: ({ record }) => {
      return record.ios ? record.ios : '-';
    },
  },
  {
    title: t('table.promotion.fix_type'),
    dataIndex: 'fix_type',
    customRender: ({ record }) => {
      return record.nav_location == 5
        ? record.fix_type == 1
          ? t('v.discount.activity.fix_type_1_1')
          : t('v.discount.activity.fix_type_3')
        : '-';
    },
  },
  {
    title: t('table.promotion.app_open_d'), //状态
    dataIndex: 'fix',
    ifShow: isHasAuth('70841'),
    customRender: ({ record }) => {
      if (record.fix_type != 3 || record.nav_location != 5) {
        return h(Switch, {
          checked: record.fix === 1,
          disabled: isControlValueSet() ? true : false,
          onChange(checked: boolean) {
            const { createMessage } = useMessage();
            const newState = checked ? 1 : 2;
            openChannelState({ id: record.id, fix: newState })
              .then((res) => {
                if (res.status) {
                  record.fix = newState;
                  createMessage.success(res.data);
                  eventBus.emit('Refreshfix');
                } else {
                  createMessage.error(res.data);
                }
              })
              .catch(() => {
                createMessage.error(t('table.system.state_edit_failed'));
              });
          },
        });
      } else {
        return '-';
      }
    },
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'operate_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.operate_at);
    },
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'operate_name',
    // customRender: ({ record }) => {
    //   return setTooltip(record.operate_name);
    // },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'action',
    width: 120,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
    ifShow: auths(['70838', '70840']),
  },
];

useAutoTableLabelWidth(columns);
