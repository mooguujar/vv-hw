import { h } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { toTimezone } from '/@/utils/dateUtil';
import { updateUserInfo } from '/@/api/sys/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_username'), //用户名
    dataIndex: 'username',
  },
  {
    title: t('table.system.system_nickname'), //用户名
    dataIndex: 'nickname',
  },
  {
    title: t('table.system.system_last_login_ip'), //最后登入IP
    dataIndex: 'last_login_ip',
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'state',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.state === 1,
        checkedChildren: t('business.common_on_activate'), //启用
        unCheckedChildren: t('business.common_deactivate'), //停用
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const { createMessage } = useMessage();
          updateUserInfo({ id: record.id, state: 1 })
            .then(() => {
              record.state = checked ? 1 : 0;
              createMessage.success(t('common.modifiedRoleSuccessfully'));
            })
            .catch(() => {
              createMessage.error(t('common.modifiedRoleFail'));
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: t('table.member.member_creat_time'), //创建时间
    dataIndex: 'created_at',
    width: 180,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    labelPrefix: t('table.system.system_username'), //用户名
    labelPrefixWidth: 60,
    component: 'Input',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'), //状态
    labelPrefixWidth: 45,
    component: 'Select',
    componentProps: {
      options: [
        { label: t('business.common_on_activate'), value: 1 }, //启用
        { label: t('common.disable'), value: 2 }, //禁用
        { label: t('common.delText'), value: 3 }, //删除
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 3, xl: 3, lg: 3, md: 3, sm: 7 },
  },
];
useAutoLabelWidth(searchFormSchema);
export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: t('table.system.system_userid'),
    component: 'Input',
    show: false,
  },
  {
    field: 'username',
    label: t('table.system.system_username'), //用户名
    component: 'Input',
    componentProps: {
      autocomplete: 'off',
    },
    dynamicDisabled: ({ values }) => !!values.id,
  },
  {
    field: 'nickname',
    label: t('table.system.system_nickname'), //用户名
    component: 'Input',
    componentProps: {
      autocomplete: 'off',
    },
  },
  {
    field: 'group_id',
    label: t('table.system.system_user_group'), //用户组
    component: 'Select',
    required: true,
    componentProps: {
      placeholder: t('table.system.system_user_group_tip'), //请选择用户组
      options: [
        { label: 'migo123', value: '123' },
        { label: 'migo223', value: '234' },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'seamo',
    label: t('modalForm.system.system_dynamic_password'), //动态密码
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: t('modalForm.system.system_dynamic_password'), //动态密码
    },
  },
  {
    field: 'state',
    label: t('business.common_status'), //状态
    component: 'Select',
    required: true,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('business.common_on_activate'), value: 1 }, //启用
        { label: t('business.common_deactivate'), value: 0 }, //停用
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'password',
    label: t('common.password'),
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'off',
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    ifShow: ({ values }) => !values.id,
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) {
            return Promise.reject(t('common.password_placeholder'));
          }
          const reg = /^[a-zA-Z0-9]\w{5,19}$/;

          if (!reg.test(value)) {
            return Promise.reject(t('common.valid6to20')); //由6-20位数字、英文或者下划线组成
          }
          return Promise.resolve();
        },
      },
    ],
  },
];

useAutoLabelWidth(accountFormSchema);
