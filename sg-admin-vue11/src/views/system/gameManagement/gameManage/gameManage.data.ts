import { h } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { Tag, Tooltip, Image } from 'ant-design-vue';
import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
import { currencyList } from '/@/settings/currencySetting';
import { useLocalList } from '/@/settings/localeSetting';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import tableTooTip from '@/assets/images/tableImg/tableTooTip.png';
import Tip from '@/assets/svg/tip.svg';
import { useLocaleStoreWithOut } from '@/store/modules/locale';

type CheckedType = boolean | string | number;

const localeList = useLocalList();
const { t } = useI18n();
const currentLanguage = useLocaleStoreWithOut();
const locale = currentLanguage.getLocale;
export const labelWidth = (() => {
  switch (locale) {
    case 'zh_CN':
      return 75;
    case 'en_US':
      return 100;
    case 'vi_VN':
      return 100;
    case 'pt_BR':
      return 100;
    default:
      return 85;
  }
})();
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_game_name'),
    dataIndex: 'name',
    minWidth: 180,
  },
  {
    title: t('table.system.system_game_icon'),
    dataIndex: 'img',
    width: 80,
    customRender: ({ record }) => {
      return h(Image, { src: getDataTypePreviewUrl(record.img) });
    },
  },
  {
    title: t('table.system.system_game_show'),
    dataIndex: 'online',
    minWidth: 120,
    customRender: ({ record }) => {
      const online = record.online;
      const color = online == 2 ? '#E91134' : '#1CD91C';
      const text = online == 2 ? t('business.common_deactivate') : t('business.common_on_activate');
      if (online == 2) {
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
                    record?.remark ? record.remark : t('table.member.no_reason'),
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
    title: t('table.system.system_rabate_walter'),
    minWidth: 200,
    dataIndex: 'percent',
    helpMessage: `<div style="padding:12px 10px"><div style="font-size:12px"><span style="color: #facd91">${t(
      'table.system.system_rabate_walter',
    )}: </span>${t('common.anotherCalculation')}</div>
    <p style="font-size:12px">${t(
      'common.Example',
    )}</p><div style="margin-top:4px;border-radius:4px; overflow:hidden"><img style="width:509px" src="${tableTooTip}"/></div></div>`,
    titleHelpPlacement: 'right',
    customRender: ({ record }) => {
      const percent = record.percent ? `${Number(record.percent)}%` : '-';
      return h(
        'span',
        {
          style: { color: Number(record.percent) < 100 ? '#E91134' : '' },
        },
        percent,
      );
    },
  },
  {
    title: t('table.system.system_update_time'),
    dataIndex: 'updated_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.member.member_oprate_people'),
    minWidth: 200,
    dataIndex: 'updated_name',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'online',
    labelPrefix: t('table.system.systemGameShow'),
    labelPrefixWidth: labelWidth,
    component: 'Select',
    defaultValue: 0,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_normal'), value: 1 },
        { label: t('business.common_deactivate'), value: 2 },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { style: { width: 'auto' } },
  },
  {
    field: 'word',
    labelPrefix: t('table.report.report_game_name'),
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },
];

export const gameFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('table.report.report_game_name'),
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'lang',
    label: t('table.system.system_supported_languages'),
    component: 'Select',
    componentProps: () => {
      const option = localeList.map((item) => {
        return { label: item.text, value: item.event };
      });
      return {
        mode: 'multiple',
        options: option,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'currency',
    label: t('table.system.system_supported_currencies'),
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      options: currencyList,
      getPopupContainer: () => document.body,
    },
  },
];
