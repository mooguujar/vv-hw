import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { SetTooltip } from '/@/views/common/component';
import { auths, isHasAuth } from '/@/utils/authFunction';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.system.role_name'),
    dataIndex: 'name',
    minWidth: 100,
  },
  {
    title: t('table.system.extended_role'),
    dataIndex: 'total',
    minWidth: 100,
    slots: { customRender: 'total' },
  },
  {
    title: t('table.system.role_description'),
    dataIndex: 'noted',
    width: 280,
    customRender: ({ record }) => {
      return record?.noted ? SetTooltip(record?.noted, 18) : '-';
    },
  },
  {
    title: t('table.system.system_update_time'),
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
    minWidth: 200,
  },
  {
    title: t('table.system.operater'),
    dataIndex: 'updated_name',
    minWidth: 100,
  },
  {
    title: t('table.system.operate'),
    minWidth: 100,
    dataIndex: 'reMark',
    slots: {
      customRender: 'actions',
    },
    ifShow: auths(['70911', '70910', '70825']),
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: '',
    component: 'Input',
    slot: 'insertAccount',
    ifShow: isHasAuth('70823'),
  },
];
useAutoLabelWidth(searchFormSchema);
export const formSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: t('modalForm.system.role_id'),
    component: 'Input',
    colProps: { span: 8 },
    //是否禁用
    dynamicDisabled: ({ values }) => {
      return !!values.roleId;
    },
    ifShow: ({ values }) => !!values.roleId,
  },
  {
    field: 'roleName',
    label: t('modalForm.system.role_name'),
    component: 'Input',
    //是否禁用
    dynamicDisabled: ({ values }) => {
      return !!values.roleName;
    },
    ifShow: ({ values }) => !!values.roleId,
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'menuId',
        value: 'menuId',
      },
      getPopupContainer: () => document.body,
    },
  },
];
useAutoLabelWidth(formSchema);
export const modalFormSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: t('modalForm.system.role_id') + ':',
    component: 'Input',
    colProps: { span: 8 },
    //是否禁用
    dynamicDisabled: ({ values }) => {
      return !!values.roleId;
    },
    show: false,
  },
  {
    field: 'roleName',
    label: t('modalForm.system.role_name') + ':',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (value.length > 8) {
            return Promise.reject(t('modalForm.system.role_name_too_long'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: t('modalForm.system.enter_role_name'),
    },
  },
  {
    field: 'roleNoted',
    label: t('modalForm.system.role_description') + ':',
    component: 'Input',
    componentProps: {
      placeholder: t('modalForm.system.enter_role_desc_pls'),
    },
    rules: [
      {
        validator: (rule, value) => {
          if (value && value.length > 100) {
            return Promise.reject(t('common.roleDesNot100'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
];
useAutoLabelWidth(modalFormSchema);
export const modalPrivSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: t('modalForm.system.role_id'),
    component: 'CheckboxGroup',
    colProps: { span: 8 },
    //是否禁用
    dynamicDisabled: ({ values }) => {
      return !!values.roleId;
    },
    show: false,
  },
  {
    field: 'roleName',
    label: t('modalForm.system.role_name'),
    component: 'CheckboxGroup',
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

          if (!reg.test(value)) {
            return Promise.reject(t('modalForm.system.role_name_only_chinese'));
          }
          if (value.length > 8) {
            return Promise.reject(t('modalForm.system.role_name_too_long'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: t('modalForm.system.enter_role_name'),
    },
  },
];
useAutoLabelWidth(modalPrivSchema);
export const schemas: FormSchema[] = [
  {
    field: 'pid',
    component: 'Input',
    label: 'PID：',
    show: false, // 设置为 false 或不设置 show 属性以隐藏此字段
  },
  {
    field: 'superiorName',
    component: 'Input',
    label: t('modalForm.system.superior_role') + '：',
    componentProps: {
      disabled: true, // 禁用输入框
    },
  },
  {
    field: 'roleName',
    component: 'Input',
    label: t('modalForm.system.role_name') + '：',
    componentProps: {
      placeholder: t('modalForm.system.enter_role_name'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

          if (!reg.test(value)) {
            return Promise.reject(t('modalForm.system.only_chinese'));
          }
          if (value.length > 8) {
            return Promise.reject(t('modalForm.system.role_name_too_long'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'roleNoted',
    component: 'Input',
    label: t('modalForm.system.role_description') + '：',
    componentProps: {
      placeholder: t('modalForm.system.enter_role_desc_pls'),
    },
    rules: [
      {
        validator: (rule, value) => {
          if (value && value.length > 100) {
            return Promise.reject(t('common.roleDesNot100'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
];
useAutoLabelWidth(schemas);
