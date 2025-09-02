import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
import { Image, Tooltip } from 'ant-design-vue';
import { toTimezone } from '/@/utils/dateUtil';
import { auths, isHasAuth } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const setTooltip = (text, color = '') => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
          class: color,
        },
        text,
      ),
  );
};

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'newAdd',
    colProps: {
      style: { marginRight: '10px' },
    },
    ifShow: isHasAuth('30303'),
  },

  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'modelName',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.google.report_columns_model_name'),
    dataIndex: 'name',
    customRender: ({ record }) => {
      return record.name.length > 9 ? setTooltip(record.name) : record.name;
    },
  },
  {
    title: t('table.google.report_columns_APP_name'),
    width: 120,
    dataIndex: 'app_name',
    customRender: ({ record }) => {
      return record.app_name.length > 9 ? setTooltip(record.app_name) : record.app_name;
    },
  },
  {
    title: t('table.google.report_columns_APP_auth'),
    width: 120,
    dataIndex: 'author',
    customRender: ({ record }) => {
      return record.author.length > 9 ? setTooltip(record.author) : record.author;
    },
  },
  {
    title: t('table.google.report_columns_APP_icon'),
    width: 100,
    dataIndex: 'icon',
    customRender: ({ record }) => {
      return h(Image, {
        style: {
          width: '64px',
        },
        src: getDataTypePreviewUrl(record.icon),
      });
    },
  },
  {
    title: t('table.google.report_columns_APP_notice_img'),
    dataIndex: 'promo_icon',
    width: 120,
    slots: { customRender: 'noticePicture' },
  },
  {
    title: t('table.google.report_columns_APP_introduction'),
    dataIndex: 'present',
    width: 400,
    customRender: ({ record }) => {
      return record.present.length > 28 ? setTooltip(record.present) : record.present;
    },
  },
  {
    title: t('table.google.report_columns_APP_operate'),
    minWidth: 120,
    slots: { customRender: 'action' },
    dataIndex: 'valid_bet_amount',
    ifShow: auths(['30302', '30304']),
  },
  {
    title: t('table.google.report_columns_APP_updated'),
    minWidth: 220,
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      return toTimezone(record?.updated_at);
    },
  },
  {
    title: t('table.google.report_columns_APP_operator'),
    width: 120,
    dataIndex: 'updated_name',
  },
];

useAutoTableLabelWidth(columns);
