import { FormSchema } from '/@/components/Form';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const baseSchema: FormSchema[] = [
  {
    field: 'build_mode',
    component: 'Select',
    label: t('table.system.system_build_environment'), //构建环境
    labelWidth: 120,
    colProps: { span: 24 },
    defaultValue: 'dev',
    componentProps: {
      placeholder: t('common.chooseText'), //请选择
      options: [
        { label: 'dev', value: 'dev' },
        { label: 'test', value: 'test' },
        { label: 'release', value: 'release' },
      ],
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'channel_build',
    component: 'Select',
    label: t('modalForm.system.system_channel_build'), //是否多渠道打包
    defaultValue: 0,
    labelWidth: 120,
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('common.chooseText'), //请选择
      options: [
        { label: t('modalForm.system.system_channel_build_no'), value: 0 },
        { label: t('modalForm.system.system_channel_build_yes'), value: 1 },
      ],
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'git_branch',
    component: 'Select',
    label: 'git ' + t('table.system.system_branch'), //git仓库分支
    labelWidth: 120,
    defaultValue: 'dev',
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('common.chooseText'), //请选择
      options: [
        { label: 'dev', value: 'dev' },
        { label: 'master', value: 'master' },
      ],
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'token',
    component: 'Input',
    label: 'Token',
    labelWidth: 120,
    defaultValue: '30805197685956987',
    colProps: { span: 24 },
    componentProps: {},
    required: true,
  },
  {
    field: 'channel_code',
    component: 'Input',
    label: t('modalForm.system.system_channel_code'), //渠道码
    defaultValue: 'addadsdf',
    labelWidth: 120,
    colProps: { span: 24 },
    componentProps: {},
    required: true,
  },
];
export const schema: FormSchema[] = [
  {
    field: 'title',
    label: '',
    component: 'Input',
    slot: 'site-form',
    colProps: {
      span: 24,
    },
  },
];

export const faceBookSchema = [...baseSchema];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_build_environment'), //构建环境
    dataIndex: 'build_mode',
    width: 120,
  },
  {
    title: 'git ' + t('table.system.system_branch'), //git仓库分支
    dataIndex: 'git_branch',
    width: 120,
  },
  {
    title: 'token',
    dataIndex: 'token',
    width: 120,
  },
  {
    title: t('table.system.system_download_link'), //下载链接
    dataIndex: 'pkg_url',
    width: 240,
  },
  {
    title: t('table.system.system_git_build_time'), //打包时间
    dataIndex: 'build_time',
    width: 120,
    customRender: ({ record }) => {
      return toTimezone(record.build_time);
    },
  },
  {
    title: t('table.system.system_git_build_success_time'), //打包成功时间
    dataIndex: 'build_success_time',
    width: 120,
    customRender: ({ record }) => {
      return toTimezone(record.build_success_time);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'build_mode',
    labelPrefix: t('table.system.system_build_environment'), //构建环境
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 7 },
  },
];
