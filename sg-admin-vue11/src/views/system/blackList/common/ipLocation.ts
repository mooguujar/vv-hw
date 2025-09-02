import axios from 'axios';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
const ipLocation = async (value) => {
  if (!value) {
    console.error('value 为空，终止所有请求');
    return;
  }
  try {
    const response = await axios.get(`https://ipapi.co/${value}/json/`);
    return response.data;
  } catch (error) {
    console.error('请求ip归属地失败', error);
    throw error;
  }
};

export default ipLocation;

export const setIpType = (val) => {
  const limitTypeMap: Record<string, string> = {
    '1': t('modalForm.risk.risk_register'), // 注册
    '2': t('modalForm.risk.risk_login'), // 登录
    '3': t('modalForm.risk.risk_web'), // Web
  };

  // const limit_type = record.limit_type.toString();
  const limitTypeArray = JSON.parse(val.limit_type);

  if (limitTypeArray.length === 3) {
    return t('business.common_all'); // 全部
  } else if (limitTypeArray.length > 0) {
    return limitTypeArray.map((element) => limitTypeMap[element] || '-').join(',');
  } else {
    return '-';
  }
};
export const setIpType1 = (val) => {
  const limitTypeMap: Record<string, string> = {
    '1': t('modalForm.risk.risk_register'), // 注册
    '2': t('modalForm.risk.risk_login'), // 登录
  };

  // const limit_type = record.limit_type.toString();
  const limitTypeArray = JSON.parse(val.limit_type);

  if (limitTypeArray.length === 2) {
    return t('business.common_all'); // 全部
  } else if (limitTypeArray.length > 0) {
    return limitTypeArray.map((element) => limitTypeMap[element] || '-').join(',');
  } else {
    return '-';
  }
};
