import { h } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { langArr } from '../../common/setting';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { useActiveMainOptions, useActiveOptions } from '/@/views/common/commonSetting';
import {
  useActiveMainOptions,
  useActiveOptions,
  useActiveOptionsTy,
  useClientType,
} from '/@/views/common/commonSetting';

const { t } = useI18n();
const { activeOptions } = useActiveOptions();
const { activeOptionsTy } = useActiveOptionsTy();
const { activityMainMap } = useActiveMainOptions();
const { clientType } = useClientType();

export const schemas: FormSchema[] = [
  {
    field: 'terminal',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('table.finance.finance_terminal'), //终端
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
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

export const columns: BasicColumn[] = [
  {
    title: t('common.common_ac1'), //设备号
    dataIndex: 'id',
  },
  {
    title: t('common.site_name'), //限制类型
    dataIndex: 'zh_name',
    minWidth: 120,
  },
  {
    title: t('common.lang'), //操作
    dataIndex: 'lang',
    minWidth: 180,
    customRender: ({ record }) => {
      const filteredLabels = langArr
        .filter((lang) => JSON.parse(record.lang).includes(lang.value))
        .map((lang) => lang.label)
        .join('/');
      return JSON.parse(record.lang).length === 6 ? t('common.all_lang') : filteredLabels;
    },
  },
  {
    title: t('business.common_type'), //操作人员
    minWidth: 160,
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
    minWidth: 160,
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
    minWidth: 120,
    customRender: ({ record }) => {
      if (JSON.parse(record.client_type).length === 1) {
        return 'WEB';
      } else if (JSON.parse(record.client_type).length === 4) {
        return 'WEB/APP';
      } else {
        return 'APP';
      }
      return;
    },
  },
  {
    title: `${t('business.common_period_start')}\n${t('business.common_period_end')}`,
    dataIndex: '',
    minWidth: 160,
    slots: { customRender: 'dataTimeSlot' },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'close_type',
    minWidth: 160,
    customRender: ({ record }) => {
      const text =
        record.close_type === 1 ? t('business.common_status_1') : t('business.common_status_2');
      return h('span', { style: { color: '#f7b468' } }, text);
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'data',
    minWidth: 200,
    slots: { customRender: 'action' },
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'updated_name',
    minWidth: 100,
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
