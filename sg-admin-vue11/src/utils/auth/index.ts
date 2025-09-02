import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CURRENT_SITE, CacheTypeEnum, OSSURL, SITE_LIST, TOKEN_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getCurrentSite() {
  return getAuthCache(CURRENT_SITE);
}

export function getSiteList() {
  return getAuthCache(SITE_LIST);
}

/**
 *
 * @param uploadType (上传类型 1-视频 2-图片)
 * @returns
 */
export function getOssUrlByUploadType(uploadType) {
  const ossUrlArr: Array<any> = getAuthCache(OSSURL);
  const ossUrl = ossUrlArr.find((as) => as.uploadType === uploadType);
  if (ossUrl) return ossUrl.apiDomain;
  return '';
  // return getAuthCache(OSSURL)
}

export function setCurrentSite(info) {
  setAuthCache('CURRENT_SITE', info);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

//动态生成随机密码

export function generateCustomPassword() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // 生成包含一个随机大写字母的数组
  const randomUppercaseLetter = Array.from({ length: 1 }, () =>
    uppercaseCharacters.charAt(Math.floor(Math.random() * uppercaseCharacters.length)),
  );

  // 生成包含两个随机小写字母的数组
  const randomLowercaseLetters = Array.from({ length: 2 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  );

  // 生成包含五个随机数字的数组
  const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1);

  // 将以上三个数组合并成一个密码数组
  const passwordArray = [...randomUppercaseLetter, ...randomLowercaseLetters, ...randomNumbers];

  // 对密码数组进行乱序
  const shuffledPasswordArray = shuffleArray(passwordArray);

  // 将乱序后的数组转换成字符串，得到最终的密码，并返回
  const password = shuffledPasswordArray.join('');
  return password;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
