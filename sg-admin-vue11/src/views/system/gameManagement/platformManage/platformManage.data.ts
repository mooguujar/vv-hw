import { BasicColumn, FormSchema } from '/@/components/Table';
import { Tag, Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { useLocale } from '@/locales/useLocale';
import { useLocalLangurage } from '@/settings/localeSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import Tip from '@/assets/svg/tip.svg';

const { t } = useI18n();
const { getLanguageField } = useLocale();
const localeListLangurage = useLocalLangurage();

// 表格内容
export const baseColumns: BasicColumn[] = [
  {
    title: t('table.system.system_game_platform'),
    dataIndex: 'name',
    minWidth: 170,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: t('table.system.system_game_number'),
    minWidth: 170,
    dataIndex: 'game_num',
  },
  {
    title: t('table.system.system_supported_currencies'),
    dataIndex: 'currency',
    minWidth: 200,
    slots: { customRender: 'currency' },
  },
  {
    title: t('table.system.system_supported_languages'),
    dataIndex: 'lang',
    minWidth: 220,
    customRender: ({ record }) => {
      const lang = record.lang ? JSON.parse(record.lang) : [];
      const listArr = [];
      lang.forEach((item) => {
        listArr.push(localeListLangurage[item] as never);
      });
      return listArr.join(',');
    },
  },
  {
    title: t('table.system.system_game_show'),
    dataIndex: 'state',
    minWidth: 140,
    customRender: ({ record }) => {
      const state = record.state == 1;
      const color = state ? '#1CD91C' : '#E91134';
      const text = state ? t('business.common_normal') : t('business.common_deactivate');
      if (!state) {
        return h('div', { class: 'flex justify-center' }, [
          h(Tag, { color: color }, () => text),
          h(
            Tooltip,
            { placement: 'right', overlayStyle: { maxWidth: '500px' } },
            {
              default: () => h('img', { src: Tip, class: 'w-20px h-20px ml-1' }),
              title: () =>
                h('div', { class: 'flex' }, [
                  h(
                    'div',
                    { style: { color: '#ff9800', whiteSpace: 'nowrap' } },
                    t('common.deactivationReason'),
                  ),
                  h(
                    'div',
                    { style: { 'word-break': 'break-all' } },
                    record?.remark ? record.remark : t('common.no_reason_provided'),
                  ),
                ]),
            },
          ),
        ]);
      }
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: t('table.race_price.table_update_time'),
    dataIndex: 'updated_at',
    minWidth: 260,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.member.member_oprate_people'),
    minWidth: 220,
    dataIndex: 'updated_name',
  },
];

export const platformFormSchema: FormSchema[] = [
  {
    field: getLanguageField('name'),
    label: t('table.system.system_game_sort'),
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'seq',
    label: t('table.system.system_game_sort0'),
    component: 'InputNumber',
    required: true,
  },
];
