import { FormSchema, BasicColumn } from '/@/components/Table';
import { ref, h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import eventBus from '/@/utils/eventBus';
import { isControlValueSet } from '/@/utils/domUtils';
import { Popover } from 'ant-design-vue';
import dayjs from 'dayjs';
import { currentyOptions } from '/@/views/common/commonSetting';
import cdBlockCurrency from '@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const beforeTimeChange = ref('');
const isOpen = ref(false);

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'choosenMonthWeek',
    ifShow: !isControlValueSet(),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: ({ formActionType }) => {
      return {
        allowClear: false,
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
          if (v?.length) {
            eventBus.emit('hasTime', v);
          }
        },
      };
    },
  },
  {
    field: '',
    component: 'Input',
    labelPrefix: t('common.promoter'),
    slot: 'promotionSlot',
  },
  {
    field: '',
    component: 'Input',
    labelPrefix: t('common.channel'),
    slot: 'channelSlot',
  },
  {
    field: '',
    component: 'Input',
    slot: 'submitSlot',
  },
];

export const promotionChannelSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'back',
  },
  {
    field: '',
    component: 'Input',
    labelPrefix: t('common.promoter'),
    slot: 'promotionSlot',
  },
  {
    field: '',
    component: 'Input',
    labelPrefix: t('common.channel'),
    slot: 'channelSlot',
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
  {
    field: '',
    component: 'Input',
    slot: 'submitSlot',
  },
];

const renderColoredValue = (value: string | number, isPercentage = false): JSX.Element | string => {
  if (value === null || value === undefined || value === '') return '-';

  // 提取数值（兼容千分位和百分号）
  const numericValue = parseFloat(value.toString().replace(/,/g, '').replace('%', ''));

  // 无效值处理
  if (isNaN(numericValue)) return '-';

  // 设置颜色逻辑（显式类型声明）
  const color: string = numericValue > 0 ? '#E91134' : numericValue < 0 ? '#1CD91C' : 'inherit';

  // 保留原始格式（如百分号、千分位）
  const displayText = isPercentage ? `${value.toString().replace('%', '')}%` : value.toString();

  return h('span', { style: { color } }, displayText);
};

const DEVICE_TYPES = {
  WEB: 24,
  H5: 25,
  IOS: 26,
  ANDROID: 27,
};

const createDeviceColumn = (label: string, value: string | number) => {
  return h('span', value ?? '-');
};

const renderPopoverContent = (text: string, device: string) => {
  if (isNaN(Number(text))) {
    return h('span', '-');
  }

  const deviceData = device ? JSON.parse(device) : {};
  const hasWebAccess = Number(deviceData[DEVICE_TYPES.WEB] || 0) > 0;
  const hasH5Access = Number(deviceData[DEVICE_TYPES.H5] || 0) > 0;

  const iosCount = Number(deviceData[DEVICE_TYPES.IOS] || 0);
  const androidCount = Number(deviceData[DEVICE_TYPES.ANDROID] || 0);
  const hasAppAccess = iosCount + androidCount > 0;

  if (!hasWebAccess && !hasH5Access && !hasAppAccess) {
    return h('span', text ?? '-');
  }

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: '4px',
  };

  const popoverContent = h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100px',
        width: '180px',
        color: '#ffffff',
      },
    },
    [
      h('div', { style: columnStyle }, [
        (hasWebAccess || hasH5Access || hasAppAccess) && h('span', t('common.access_port')),
        hasWebAccess && createDeviceColumn('PC', 'PC'),
        hasH5Access && createDeviceColumn('H5', 'H5'),
        hasAppAccess && createDeviceColumn('APP', 'APP'),
      ]),
      h('div', { style: columnStyle }, [
        (hasWebAccess || hasH5Access || hasAppAccess) && h('span', t('common.visitor_count')),
        hasWebAccess && createDeviceColumn('PC', deviceData[DEVICE_TYPES.WEB]),
        hasH5Access && createDeviceColumn('H5', deviceData[DEVICE_TYPES.H5]),
        hasAppAccess && createDeviceColumn('APP', iosCount + androidCount),
      ]),
    ],
  );

  return h(
    Popover,
    {
      placement: 'right',
      trigger: 'hover',
      getPopupContainer: () => document.body,
      overlayClassName: 'custom-popover',
    },
    {
      default: () => h('span', { style: { cursor: 'pointer' } }, text),
      content: () => popoverContent,
    },
  );
};

export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    customRender: ({ text }) => {
      return typeof text === 'string' && !isNaN(text)
        ? h(cdBlockCurrency, { currencyName: currentyOptions[text] })
        : text;
    },
  },
  {
    title: t('table.promotion.promotion_static_date'), //统计日期
    dataIndex: 'time',
    customRender: ({ text }) => (text ? dayjs.unix(text).format('YYYY-MM-DD') : text || '-'),
  },
  {
    title: t('common.promoter'), //推广商
    dataIndex: 'group_name',
    slots: { customRender: 'promotionChannel' },
  },
  {
    title: t('table.race_price.form_channel_name'), //渠道名称
    dataIndex: 'channel_name',
    slots: { customRender: 'promotionChannel' },
  },
  {
    title: t('common.visitor_count'), //访问人数
    dataIndex: 'uv',
    customRender: ({ text, record }) => renderPopoverContent(text, record.uv_device),
  },
  {
    title: t('common.table_register_person'), //注册人数
    dataIndex: 'reg_count',
    customRender: ({ text, record }) => renderPopoverContent(text, record.reg_device),
  },
  {
    title: t('common.registration_rate'), //注册率
    dataIndex: 'reg_rate',
    customRender: ({ text }) => renderColoredValue(text, true),
  },
  {
    title: t('common.login_num'), //登录人数
    dataIndex: 'login_count',
    customRender: ({ text, record }) => renderPopoverContent(text, record.login_device),
  },
  {
    title: t('table.report.report_first_deposit_amount'), //首存金额
    dataIndex: 'first_deposit_amount',
  },
  {
    title: t('v.discount.activity.recharge_amount'), //充值金额
    dataIndex: 'deposit_amount',
  },
  {
    title: t('table.promotion.promotion_take_amount'), //提款金额
    dataIndex: 'withdraw_amount',
  },
  {
    title: t('table.report.report_cash_profit'), //现金利润
    dataIndex: 'cash_profit',
    customRender: ({ text }) => renderColoredValue(text),
  },
  {
    title: t('common.registration_recharge_ratio'), //注册充值比
    dataIndex: 'reg_deposit_rate',
  },
  {
    title: t('common.registration_withdrawal_ratio'), //注册提款比
    dataIndex: 'withdraw_rate',
  },
];
useAutoTableLabelWidth(columns);
export const promotionChannelColumns: BasicColumn[] = [
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    customRender: ({ text }) => {
      return typeof text === 'string' && !isNaN(text)
        ? h(cdBlockCurrency, { currencyName: currentyOptions[text] })
        : text;
    },
  },
  {
    title: t('table.promotion.promotion_static_date'), //统计日期
    dataIndex: 'time',
    customRender: ({ text }) => (text ? dayjs.unix(text).format('YYYY-MM-DD') : text || '-'),
  },
  {
    title: t('common.promoter'), //推广商
    dataIndex: 'group_name',
  },
  {
    title: t('table.race_price.form_channel_name'), //渠道名称
    dataIndex: 'channel_name',
  },
  {
    title: t('table.promotion.promotion_tunnel_ID'), //渠道ID
    dataIndex: 'channel_id',
  },
  {
    title: t('table.promotion.promotion_agency_account'), //代理账号
    dataIndex: 'username',
  },
  {
    title: t('common.visitor_count'), //访问人数
    dataIndex: 'uv',
    customRender: ({ text, record }) => renderPopoverContent(text, record.uv_device),
  },
  {
    title: t('common.table_register_person'), //注册人数
    dataIndex: 'reg_count',
    customRender: ({ text, record }) => renderPopoverContent(text, record.reg_device),
  },
  {
    title: t('common.registration_rate'), //注册率
    dataIndex: 'reg_rate',
    customRender: ({ text }) => renderColoredValue(text, true),
  },
  {
    title: t('common.login_num'), //登录人数
    dataIndex: 'login_count',
    customRender: ({ text, record }) => renderPopoverContent(text, record.login_device),
  },
  {
    title: t('table.race_price.table_first_deposit_count'), //首存金额
    dataIndex: 'first_deposit_amount',
  },
  {
    title: t('v.discount.activity.recharge_amount'), //充值金额
    dataIndex: 'deposit_amount',
  },
  {
    title: t('table.promotion.promotion_take_amount'), //提款金额
    dataIndex: 'withdraw_amount',
  },
  {
    title: t('table.report.report_cash_profit'), //现金利润
    dataIndex: 'cash_profit',
    customRender: ({ text }) => renderColoredValue(text),
  },
  {
    title: t('common.registration_recharge_ratio'), //注册充值比
    dataIndex: 'reg_deposit_rate',
  },
  {
    title: t('common.registration_withdrawal_ratio'), //注册提款比
    dataIndex: 'withdraw_rate',
  },
  {
    title: t('table.promotion.promotion_affect_bet'), //有效投注
    dataIndex: 'valid_bet_amount',
  },
  {
    title: t('common.download_amount'), //下载量
    dataIndex: 'download_count_all',
  },
  {
    title: t('common.startup_amount'), //启动量
    dataIndex: 'start_count',
  },
  {
    title: t('common.download_rate'), //下载率
    dataIndex: 'download_rate',
    customRender: ({ text }) => renderColoredValue(text, true),
  },
];
useAutoTableLabelWidth(promotionChannelColumns);
