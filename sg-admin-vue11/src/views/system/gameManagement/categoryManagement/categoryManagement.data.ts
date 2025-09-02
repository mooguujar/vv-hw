import { h } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { Switch, Image } from 'ant-design-vue';
import { updateGameCategoryState } from '/@/api/sys/index';
import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('common.CategoryName'),
    dataIndex: 'zh_name',
  },
  {
    title: t('common.categoryIcon'),
    dataIndex: 'icon',
    customRender: ({ record }) => {
      return h(Image, { src: getDataTypePreviewUrl(record.icon), style: { width: '50px' } });
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.state === 1,
        checkedChildren: t('table.common.activate'),
        unCheckedChildren: t('table.common.deactivate'),
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          updateGameCategoryState({ id: record.id, state: record.state === 1 ? 2 : 1 })
            .then(() => {
              record.state = checked ? 1 : 2;
            })
            .catch(() => {})
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
];

export const searchFormSchema: FormSchema[] = [];

export const categoryFormSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'zh_name',
    label: t('common.CategoryName'),
    component: 'Input',
    componentProps: {
      autocomplete: 'off',
    },
    required: true,
  },
  {
    field: 'state',
    component: 'RadioGroup',
    label: t('modalForm.finance.finance_now_status'),
    defaultValue: 1,
    colProps: { span: 20 },
    componentProps: {
      options: [
        { label: t('table.common.normal'), value: 1 },
        { label: t('table.system.deactivate'), value: 2 },
      ],
    },
  },
];

export const langFormSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'zh_name',
    label: t('common.common_zh_CN'),
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'en_name',
    label: t('common.langEn'),
    component: 'Input',
  },
  {
    field: 'vh_name',
    label: t('common.LangVet'),
    component: 'Input',
  },
  {
    field: 'th_name',
    label: t('common.LangThai'),
    component: 'Input',
  },
  {
    field: 'pt_name',
    label: t('common.LangPt'),
    component: 'Input',
  },
];
