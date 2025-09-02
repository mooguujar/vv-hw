import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const stateRenderColor = {
  1: 'green',
  2: 'red',
  3: 'blue',
};

// todo 未使用
export const stateChannelData = {
  1: '成功', //成功
  2: '更新中', //失败
  3: '停用', //交易中
};

export const navLocation = [
  { label: t('table.promotion.promotion_home'), value: 1 }, //首页
  // { label: '娱乐城', value: 2 },
  { label: t('table.promotion.promotion_regis'), value: 2 }, //'注册'
  { label: t('table.promotion.promotion_login'), value: 3 }, //'登录'
  // { label: t('table.promotion.promotion_tiyu'), value: 4 }, //体育
  { label: t('table.promotion.goole_shop'), value: 5 }, //联盟中心
];

export const deviceLocation = [
  { label: 'Android', value: 1 },
  { label: 'IOS', value: 2 },
  { label: 'Google Play', value: 3 },
];

export const deviceLocationMap = {
  1: 'Android',
  2: 'IOS',
  3: 'Google Play',
};
