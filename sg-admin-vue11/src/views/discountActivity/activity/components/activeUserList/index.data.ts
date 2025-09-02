import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { langArr } from '../../common/setting';
import Icon from '/@/components/Icon';
import { isHasAuth } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import {
  useActiveMainOptions,
  useActiveOptions,
  useActiveOptionsTy,
  useClientType,
} from '/@/views/common/commonSetting';
import { isControlValueSet } from '/@/utils/domUtils';
import { setClounmsWidth } from '/@/views/common/component';

const { activeOptionsTy } = useActiveOptionsTy();

const { t } = useI18n();

const { activeOptions } = useActiveOptions();

const { activityMainMap } = useActiveMainOptions();
const { clientType } = useClientType();

export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
    ifShow: !isControlValueSet(),
  },
  {
    field: 'terminal',
    component: 'Select',
    labelPrefix: t('table.finance.finance_terminal'), //终端
    defaultValue: 0,
    componentProps: () => {
      return {
        dropdownMatchSelectWidth: false,
        allowClear: false,
        options: [{ label: t('business.common_all'), value: 0 }, ...clientType],
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'types',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('business.common_type'), //类型
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    defaultValue: 0,
    componentProps: () => {
      return {
        dropdownMatchSelectWidth: false,
        allowClear: false,
        options: [{ label: t('business.common_all'), value: 0 }, ...activeOptionsTy],
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];

/** 活动管理列表 */
export const columns: BasicColumn[] = [
  {
    title: t('business.common_sort'), //排序
    dataIndex: 'id',
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
    lockWidth: true,
    ifShow: isHasAuth('40206'),
  },
  {
    title: t('common.common_ac1'), //ID
    dataIndex: 'id',
  },
  {
    title: t('common.site_name'), //名称
    dataIndex: 'zh_name',
  },
  {
    title: t('common.lang'), //操作
    dataIndex: 'lang',
    customRender: ({ record }) => {
      const filteredLabels = langArr
        .filter((lang) => JSON.parse(record.lang).includes(lang.value))
        .map((lang) => lang.label)
        .join('/');
      return JSON.parse(record.lang).length === 6 ? t('common.all_lang') : filteredLabels;
    },
  },
  {
    title: t('business.common_type'),
    dataIndex: 'types',
    customRender: ({ record }) => {
      return activeOptionsTy.map((item) => {
        if (item.value === record.types) {
          return item.label;
        }
      });
    },
  },
  {
    title: t('business.common_ac2'),
    dataIndex: 'category',
    customRender: ({ record }) => {
      function getKeyByValue(value: string | number): number | undefined {
        const strValue = value; // 转为字符串
        for (const key in activityMainMap) {
          if (activityMainMap[key].some((item: any) => item.value == strValue)) {
            return Number(key); // 转为数字类型返回
          }
        }
        return 1; // 没有匹配时返回 1
      }

      const value = record.ty == 8 ? 2 : getKeyByValue(record.ty);
      const findLabel = (labelToFind) => {
        const option = activeOptions.find((option) => option.value === labelToFind);
        return option ? option.label : null; // 返回找到的 label 或 null
      };

      const labelValue = findLabel(value);

      return labelValue;
    },
  },
  {
    title: t('table.finance.finance_terminal'),
    dataIndex: 'client_type',
    customRender: ({ record }) => {
      const client = JSON.parse(record.client_type);

      if (client.includes(24)) {
        return client.length === 2 ? 'WEB' : 'WEB/APP';
      }

      return client.length === 4 ? 'WEB/APP' : 'APP';
    },
  },
  {
    title: `${t('business.common_period_start')}\n${t('business.common_period_end')}`,
    dataIndex: '',
    slots: { customRender: 'dataTimeSlot' },
  },
  {
    title: t('business.common_status'),
    dataIndex: '',
    slots: { customRender: 'activeState' },
  },
  {
    title: t('table.discountActivity.discount_recommended'),
    dataIndex: 'recommend',
    customRender: ({ record }) => {
      const text = record.recommend === 1 ? t('business.common_yes') : t('business.common_no');
      const styleColor = record.recommend === 1 ? '#e91134' : '#444444';
      return h('div', { style: { color: styleColor } }, text);
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    slots: { customRender: 'action' },
    width: setClounmsWidth(180, 280),
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'updated_name',
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);

export function getActiviTy(type: number): string {
  const valuesToRemove = [10001, 10002, 10003];

  // 获取活动选项并处理 type === 2 的情况
  const options: Array<{ label: string; value: number }> =
    type === 2
      ? [
          { label: t('v.discount.activity.type_charge'), value: 8 },
          ...activityMainMap[type].filter((option) => !valuesToRemove.includes(option.value)),
        ]
      : activityMainMap[type];

  // 提取 value 并转换为逗号分隔的字符串
  return options.map(({ value }) => value).join(',');
}
