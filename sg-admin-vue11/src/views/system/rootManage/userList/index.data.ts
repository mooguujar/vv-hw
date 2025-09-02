import { BasicColumn, FormSchema } from '/@/components/Table';
import { h, ref } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { adminGroupsList } from '/@/api/sys/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { auths } from '/@/utils/authFunction';
import { setClounmsWidth } from '/@/views/common/component';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const userStore = useUserStore();
const siteList = ref([] as any);
siteList.value = userStore.siteList;
const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_root_user'), //登录账号
    dataIndex: 'username',
    minWidth: 150,
    slots: { customRender: 'memberId' },
  },
  {
    title: t('table.system.system_root_nick'), //账号别称
    dataIndex: 'nickname',
    minWidth: 150,
    customRender: ({ record }) => {
      return record.nickname ? record.nickname : '-';
    },
  },
  {
    title: t('table.system.system_root_role'), //账号角色
    dataIndex: 'password',
    minWidth: 150,
  },
  {
    title: t('table.system.system_root_useSite'), //可用站点
    dataIndex: 'site',
    minWidth: 150,
    slots: { customRender: 'settingSite' },
  },
  {
    title: t('table.system.system_root_quota'), //额度配置
    dataIndex: 'addmoney',
    minWidth: 100,
    slots: { customRender: 'addmoney' },
  },
  {
    title: t('table.system.system_root_single'), //单笔限额
    dataIndex: 'singleMoney',
    minWidth: 100,
    slots: { customRender: 'singleMoney' },
  },
  {
    title: t('table.member.member_login_time'), //登录时间
    dataIndex: 'last_login_time',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.last_login_time, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.system.system_update_time'), //更新时间
    dataIndex: 'updated_at',
    minWidth: 165,
    customRender: ({ record }) => {
      return record.zk === '1' ? toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    title: t('table.member.member_oprate_people'), //操作人员
    dataIndex: 'updated_name',
    minWidth: 115,
    customRender: ({ record }) => {
      return record.zk === '1' ? record.updated_name : '-';
    },
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'state',
    minWidth: 85,
    customRender: ({ record }) => {
      const text =
        record.state === 1 ? t('business.common_normal') : t('business.common_deactivate');
      const color = record.state === 1 ? '#1CD91C' : '#E91134';
      return h('div', { style: { color: color } }, text);
    },
  },
  {
    title: t('business.common_operate'), //操作
    slots: { customRender: 'action' },
    width: setClounmsWidth(280, 520),
    ifShow: auths(['70814', '70815', '70816', '70884', '70817', '70869']),
  },
];
useAutoTableLabelWidth(columns);
export const searchFormSchema: FormSchema[] = [
  {
    field: 'account',
    component: 'Input',
    slot: 'insertAccount',
    componentProps: {},
  },
  {
    field: 'name',
    labelPrefix: t('table.system.system_root_user'), //发件人
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: {
      placeholder: t('common.inputText'), //请输入
    },
  },
];
useAutoLabelWidth(searchFormSchema);
export const insertForm: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'username',
    component: 'Input',
    label: t('table.system.system_root_user') + ':', //登录账号
    required: true,
    componentProps: {
      placeholder: t('table.system.system_root_tip1'),
      maxlength: '20',
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) {
            return Promise.reject(t('common.PleaseEnterAccount'));
          }

          const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

          if (reg.test(value)) {
            return Promise.reject(t('common.accountCannotContainChinese'));
          }

          const reg2 = new RegExp('^[a-zA-Z0-9]{6,20}$', 'g');

          if (!reg2.test(value)) {
            return Promise.reject(t('common.only6To20'));
          }

          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'password',
    component: 'Input',
    label: t('table.risk.report_login_password') + ':', //登录密码
    required: true,
    componentProps: {
      placeholder: t('table.system.system_root_tip1'),
      maxlength: '20',
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) {
            return Promise.reject(t('table.system.system_p_enter_login_pas'));
          }

          const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

          if (reg.test(value)) {
            return Promise.reject(t('table.system.system_including_cn'));
          }

          const reg2 = new RegExp('^[a-zA-Z0-9]{6,20}$', 'g');

          if (!reg2.test(value)) {
            return Promise.reject(t('table.system.system_login_tips'));
          }

          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => !values.id,
  },
  {
    field: 'password',
    component: 'Input',
    label: t('table.risk.report_login_password') + ':', //登录密码
    componentProps: {
      placeholder: t('table.system.system_root_tip1'),
    },
    ifShow: ({ values }) => values.id,
  },
  {
    field: 'seamo',
    component: 'Input',
    label: t('business.common_Secret_key') + ':',
    // dynamicDisabled: true,
    show: false,
  },
  {
    field: 'nickname',
    component: 'Input',
    label: t('table.system.system_root_nick') + ':', //账号别称
    componentProps: {
      placeholder: t('table.system.system_toot_nicktip2'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('common.PleaseEnterNickname'));
          } else if (value.length < 2) {
            return Promise.reject(t('common.NicknameMustGt1'));
          } else if (value.length > 30) {
            return Promise.reject(t('common.NicknameMustLt30'));
          } else {
            return Promise.resolve();
          }
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => values.id,
  },
  {
    field: 'nickname',
    component: 'Input',
    required: true,
    label: t('table.system.system_root_nick') + ':', //账号别称
    componentProps: {
      placeholder: t('table.system.system_toot_nicktip2'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('common.PleaseEnterNickname'));
          } else if (value.length < 2) {
            return Promise.reject(t('common.NicknameMustGt1'));
          } else if (value.length > 30) {
            return Promise.reject(t('common.NicknameMustLt30'));
          } else {
            return Promise.resolve();
          }
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => !values.id,
  },
  {
    field: 'group_id',
    component: 'ApiSelect',
    required: true,
    label: t('table.system.system_root_chiooce') + ':', //选择角色
    componentProps: {
      api: async () => {
        const data = await adminGroupsList({ gid: '1', site_id: '1' });
        const dataList = data.map((item) => {
          return { label: item.name, value: item.gid };
        });
        return dataList;
      },
      getPopupContainer: () => document.body,
    },
    // dynamicDisabled: ({ values }) => {
    //   return !!values.id;
    // },
  },
  {
    field: 'siteManage',
    component: 'Input',
    label: t('table.system.system_root_manageSite') + ':', //管理站点
    slot: 'siteManage',
    //required: true,
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'addmoney',
    label: t('table.system.system_root_addMony') + ':', //加款额度
    component: 'Input',
    slot: 'addmoney',
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: t('table.member.member_ramark_massage') + ':', //备注信息
    componentProps: {
      rows: 6,
      //maxLength: '100',
      placeholder: t('table.member.member_stop_remark'),
    },
    rules: [
      {
        validator: (rule, value) => {
          if (value && value.length > 100) {
            return Promise.reject(t('table.member.member_ramark_massage100'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
];
useAutoLabelWidth(insertForm);
