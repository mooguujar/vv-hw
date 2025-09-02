import { genMessage } from './helper';
import ant_en_Us from 'ant-design-vue/es/locale/en_US';
import ant_pt_BR from 'ant-design-vue/es/locale/pt_BR';
import ant_th_TH from 'ant-design-vue/es/locale/th_TH';
import ant_vi_VN from 'ant-design-vue/es/locale/vi_VN';
import ant_zh_CN from 'ant-design-vue/es/locale/zh_CN';
import ant_hi_IN from 'ant-design-vue/es/locale/hi_IN';
import ant_ko_KR from 'ant-design-vue/es/locale/ko_KR';

const antdLocalObj = {
  en_US: ant_en_Us,
  pt_BR: ant_pt_BR,
  th_TH: ant_th_TH,
  vi_VN: ant_vi_VN,
  zh_CN: ant_zh_CN,
  hi_IN: ant_hi_IN,
  ko_KR: ant_ko_KR,
};

const modulesObj = {
  en_US: import.meta.glob('./langBack/**/en.json'),
  pt_BR: import.meta.glob('./langBack/**/pt.json'),
  th_TH: import.meta.glob('./langBack/**/th.json'),
  vi_VN: import.meta.glob('./langBack/**/vi.json'),
  zh_CN: import.meta.glob('./langBack/**/zh.json'),
  hi_IN: import.meta.glob('./langBack/**/hi.json'),
  ko_KR: import.meta.glob('./langBack/**/ko.json'),
  in_ID: import.meta.glob('./langBack/**/in.json'),
  ja_JP: import.meta.glob('./langBack/**/ja.json'),
};
export async function langLoader(lang: string) {
  const childModules = modulesObj[lang];
  const antdLocale = antdLocalObj[lang];
  const newModules = {};
  const keys = Object.keys(childModules);
  for (const key of keys) {
    newModules[key] = await childModules[key]();
  }
  return {
    message: {
      ...genMessage(newModules as Recordable<Recordable>),
      antdLocale,
    },
  };
}
