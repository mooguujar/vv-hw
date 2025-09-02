/** 用户名(3-14字符,数字和字母) */
export const usernameReg = /^\w{3,30}$/
/** 用户名2(6-18字符,数字和字母) */
export const usernameReg2 = /^\w{6,30}$/
/** 必须含有大写和小写字母 */
export const upperLowerReg = /^(?=.*[a-z])(?=.*[A-Z]).+$/
/** 至少一位数字 */
export const lastOneNumberReg = /.*\d.*/
/** 邮箱 */
export const emailReg = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
/** 支付密码(6位数字) */
export const payPasswordReg = /^\d{6}$/
/** 虚拟币地址 */
export const virtualCoinAddressReg = /^[a-z0-9]{5,100}$/i
/** 仅数字 */
export const numberReg = /^\d+$/
/** 数字开头 */
export const startWithNumber = /^\d/
/** 中文 */
export const chineseRegex = /[\u4E00-\u9FA5\u3000-\u303F\uFF00-\uFFEF]/
/** 中国手机号码 */
export const chinaPhoneReg = /^1[3-9]\d{9}$/
/** 菲律宾手机号码 */
export const philippinePhoneReg = /^(09|\+639)\d{9}$/ // /^(09|\+639|\+6309)\d{9}$/
/** 巴西手机号码 */
export const brazilPhoneReg = /^(\+55\s?)?(\(?\d{2}\)?\s?)?9\d{4}-?\d{4}$/
/** 兑换码 */
export const couponReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/
// 双因子验证密码
export const twoFactorReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
