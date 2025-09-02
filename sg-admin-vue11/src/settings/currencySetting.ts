import type { SelectProps } from 'ant-design-vue';

export const currencySetting = 'CNY';

export const CURRENCY = {
  CNY: 'CNY',
  /**
   * BTC
   * @description 比特币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://bitcoin.org/zh_CN/
   */
  BTC: 'BTC',

  /**
   * ETH
   * @description 以太坊是一个开源的有智能合约功能的公共区块链平台，通过其专用加密货币以太币提供去中心化的虚拟机来处理点对点合约。
   * @see https://ethereum.org/zh/
   */
  ETH: 'ETH',

  /**
   * LTC
   * @description 莱特币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://litecoin.org/zh/
   */
  LTC: 'LTC',

  /**
   * USDT
   * @description 泰达币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://tether.to/
   */
  USDT: 'USDT',

  /**
   * DOGE
   * @description 狗狗币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://dogecoin.com/
   */
  DOGE: 'DOGE',

  /**
   * BCH
   * @description 比特币现金是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://www.bitcoincash.org/
   */
  BCH: 'BCH',

  /**
   * XRP
   * @description 瑞波币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://ripple.com/xrp/
   */
  XRP: 'XRP',

  /**
   * EOS
   * @description 柚子币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://eos.io/
   */
  EOS: 'EOS',

  /**
   * TRX
   * @description 波场币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://tron.network/
   */
  TRX: 'TRX',

  /**
   * BNB
   * @description 币安币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://www.binance.com/
   */
  BNB: 'BNB',

  /**
   * USDC
   * @description 美元币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://www.centre.io/usdc
   */
  USDC: 'USDC',

  /**
   * APE
   * @description 猩猩币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see http://www.apecoin.org/
   */
  APE: 'APE',

  /**
   * BUSD
   * @description 币安美元是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://www.binance.com/
   */
  BUSD: 'BUSD',

  /**
   * CRO
   * @description 信用币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://crypto.com/
   */
  CRO: 'CRO',

  /**
   * DAI
   * @description DAI是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://makerdao.com/en/
   */
  DAI: 'DAI',

  /**
   * LINK
   * @description 链接币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://chain.link/
   */
  LINK: 'LINK',

  /**
   * SAND
   * @description 沙子币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * @see https://www.sandbox.game/en/
   */
  SAND: 'SAND',

  /**
   * SHIB
   * @description 狗狗币是一种点对点的数字货币，基于开源软件协议，不受中央机构管控。
   * SHIB是一个社区驱动的实验性去中心化的匿名代币，它的创始人是一个叫做“狗狗”的匿名人士。
   * @see https://shibatoken.com/
   */
  SHIB: 'SHIB',

  /**
   * UNI
   * @description Uniswap是一个基于以太坊的去中心化交易协议，用于在以太坊上交换ERC20代币。
   * @see https://uniswap.org/
   */
  UNI: 'UNI',

  /**
   * MATIC
   * @description Polygon是一个基于以太坊的去中心化交易协议，用于在以太坊上交换ERC20代币。
   * @see https://polygon.technology/
   */
  MATIC: 'MATIC',

  /**
   * EUR
   * @description 欧元
   * @see https://www.ecb.europa.eu/home/html/index.en.html
   */
  EUR: 'EUR',

  /**
   * JPY
   * @description 日元
   * @see https://www.boj.or.jp/en/index.htm/
   */
  JPY: 'JPY',

  /**
   * BRL
   * @description 巴西雷亚尔
   * @see https://www.bcb.gov.br/en/home
   */
  BRL: 'BRL',

  /**
   * CAD
   * @description 加拿大元
   * @see https://www.bankofcanada.ca/
   */
  CAD: 'CAD',

  /**
   * INR
   * @description 印度卢比
   * @see https://www.rbi.org.in/
   */
  INR: 'INR',
  /**
   * VND
   * @description 越南盾
   * @see https://www.sbv.gov.vn/
   */
  VND: 'VND',
  /**
   * THB
   * @description 泰铢
   * @see https://www.bot.or.th/
   */
  THB: 'THB',
  ARS: 'ARS',
  CLP: 'CLP',
  PEN: 'PEN',
  MXN: 'MXN',
  KRW: 'KRW',
  IDR: 'IDR',
  PHP: 'PHP',
};

export const CURRENCYPRO = {
  TRC20: 'trc20',
  ERC20: 'erc20',
  BTC: 'btc',
};

export const CURRENCY_UNIT_ID = {
  /**
   * 货币符号 ¥
   * 最小单位 分 1/100
   */
  '701': '0.00',
  /**
   * 货币符号 R$
   * 最小单位 分 1/100
   */
  '702': '0.00',
  /**
   * 货币符号 ₹
   * 最小单位 paisa 1/100
   */
  '703': '0.00',
  /**
   * 货币符号 ฿
   * 最小单位 撒丹 1/100
   */
  '705': '0.00',
  /**
   * 货币符号 đ
   * 最小单位 盾 1
   */
  '704': '0.00',
  /**
   * 虚拟币
   */
  '706': '0.000000',
  '707': '0.000000',
  '708': '0.000000',
  '709': '0.000000',
  '710': '0.00',
  '711': '0.00',
  '712': '0.00',
  '713': '0.00',
  '714': '0.00',
  '715': '0.00',
  '716': '0.00',
  '717': '0.000000',
  '718': '0.000000',
  '719': '0.000000',
  '720': '0.000000',
  '721': '0.000000',
  '722': '0.000000',
  '723': '0.000000',
  '724': '0.000000',
  '725': '0.000000',
  '726': '0.000000',
  '727': '0.000000',
  '728': '0.000000',
  '729': '0.000000',
  '730': '0.000000',
  '731': '0.000000',
  '732': '0.000000',
  '733': '0.000000',
  '734': '0.000000',
  '735': '0.000000',
};

export const CURRENCY_UNIT = {
  /**
   * 货币符号 ¥
   * 最小单位 分 1/100
   */
  CNY: '0.00',
  /**
   * 货币符号 R$
   * 最小单位 分 1/100
   */
  BRL: '0.00',
  /**
   * 货币符号 ₹
   * 最小单位 paisa 1/100
   */
  INR: '0.00',
  /**
   * 货币符号 ฿
   * 最小单位 撒丹 1/100
   */
  THB: '0.00',
  /**
   * 货币符号 đ
   * 最小单位 盾 1
   */
  VND: '0.00',
  /**
   * 虚拟币
   */
  USDT: '0.00',
  BTC: '0.00000000',
  ETH: '0.00000000',
  BNB: '0.00',
  EUR: '0.00',
  JPY: '0.00',
  CAD: '0.00',
  ARS: '0.00',
  CLP: '0.00',
  PEN: '0.00',
  MXN: '0.00',
  LTC: '0.00',
  DOGE: '0.00',
  BCH: '0.00',
  XRP: '0.00',
  EOS: '0.00',
  TRX: '0.00',
  USDC: '0.00',
  APE: '0.00',
  BUSD: '0.00',
  CRO: '0.00',
  DAI: '0.00',
  LINK: '0.00',
  SAND: '0.00',
  SHIB: '0.00',
  UNI: '0.00',
  MATIC: '0.00',
  KRW: '0.00',
  IDR: '0.00',
  PHP: '0.00',
};

// currency list
export const currencyList: SelectProps['options'] = [
  { label: 'CNY', value: CURRENCY.CNY },
  { label: 'BRL', value: CURRENCY.BRL },
  // { label: 'BTC', value: CURRENCY.BTC },
  { label: 'INR', value: CURRENCY.INR },
  { label: 'THB', value: CURRENCY.THB },
  { label: 'USDT', value: CURRENCY.USDT },
  { label: 'VND', value: CURRENCY.VND },
];
// USDT协议
export const protocol: SelectProps['options'] = [
  { label: '全部', value: 0 },
  { label: 'TRC20', value: CURRENCYPRO.TRC20 },
  { label: 'ERC20', value: CURRENCYPRO.ERC20 },
];
// BTC协议
export const btcProtocol: SelectProps['options'] = [
  { label: '全部', value: 0 },
  { label: 'BTC', value: CURRENCYPRO.BTC },
];
// 货币转换对应支付方式
export const currencyToMethodsMap = {
  701: '004002',
  702: '004003',
  703: '004001',
  704: '004004',
  705: '004005',
  706: '004006',
  707: '004007',
};
//会员模块-出款卡管理-数字货币
export const currencyListUsdt = [
  { label: '全部', value: null },
  { label: 'USDT', value: '706' },
  { label: 'BTC', value: '707' },
];

//会员管理-出款卡管理-银行卡类型-银行类型
export const currentBankNameMap = {
  '701': '019001',
  '702': '019002',
  '703': '019003',
  '704': '019004',
  '705': '019005',
  '710': '019006',
  '711': '019007',
  '712': '019008',
  '713': '019009',
  '714': '019010',
  '715': '019011',
  '716': '019012',
};

//会员管理-出款卡管理-协议类型
export const currentProtocolNameMap = {
  '706': '018001',
  '707': '018002',
  '708': '018003',
  '709': '018004',
  '717': '018005',
  '718': '018006',
  '719': '018007',
  '720': '018008',
  '721': '018009',
  '722': '018010',
  '723': '018011',
  '724': '018012',
  '725': '018013',
  '726': '018014',
  '727': '018015',
  '728': '018016',
  '729': '018017',
  '730': '018018',
  '731': '018019',
  '732': '018020',
};

export const VirtualCurrencyRules = {
  //ERC20
  '1801': /^(0x)?[0-9a-fA-F]{40}$/,
  // TRC20
  '1802': /^(T|t)[1-9A-HJ-NP-Za-km-z]{33}$/,
  // USDT
  '1803': /^(0x)?[0-9a-fA-F]{40}$/,
  // BTC
  '1804': /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  // Omni
  '1805': /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  // ETH
  '1806': /^(0x)?[0-9a-fA-F]{40}$/,
  // ERC20
  '1807': /^(0x)?[0-9a-fA-F]{40}$/,
  // BNB
  '1808': /^(bnb1)[0-9a-z]{38}$/,
  // BEP20
  '1809': /^(bnb1)[0-9a-z]{38}$/,
  // LTC
  '1810': /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
  // Litecoin
  '1811': /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
  // DOGE
  '1812': /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
  // Dogecoin
  '1813': /[1-9A-HJ-NP-Za-km-z]{34}$/,
  // BCH
  '1814': /^(bitcoincash:)?(q|p)[a-z0-9]{41}$/,
  // BTC
  '1815': /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  // XRP
  '1816': /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/,
  // Ripple
  '1817': /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/,
  //EOS
  '1818': /^(0x)?[a-zA-Z1-5]{1}[a-zA-Z1-5.]{11,}$/,
  // EOS
  '1819': /^(0x)?[a-zA-Z1-5]{1}[a-zA-Z1-5.]{11,}$/,
  // TRX
  '1820': /^(T|t)[1-9A-HJ-NP-Za-km-z]{33}$/,
  // Tron
  '1821': /^(T|t)[1-9A-HJ-NP-Za-km-z]{33}$/,
  // USDC
  '1822': /^0x[0-9A-Fa-f]{40}$/,
  // ETH
  '1823': /^(0x)?[0-9a-fA-F]{40}$/,
  //APE
  '1824': /^0x[0-9A-Fa-f]{40}$/,
  // ETH
  '1825': /^(0x)?[0-9a-fA-F]{40}$/,
  // BUSD
  '1826': /^(0x)?[0-9A-Fa-f]{40}$/,
  // BEP20
  '1827': /^(0x)?[0-9A-Fa-f]{40}$/,
  // ETH
  '1828': /^(0x)?[0-9a-fA-F]{40}$/,
  // CRO
  '1829': /^(0x)?[0-9A-Fa-f]{40}$/,
  // Crypto
  '1830': /[0-9A-Za-z]{42}$/,
  // DAI
  '1831': /^(0x)?[0-9A-Fa-f]{40}$/,
  // ETH
  '1832': /^(0x)?[0-9a-fA-F]{40}$/,
  // LINK
  '1833': /^(0x)?[0-9A-Fa-f]{40}$/,
  // ETH
  '1834': /^(0x)?[0-9a-fA-F]{40}$/,
  // SAND
  '1835': /^(0x)?[0-9A-Fa-f]{40}$/,
  // ETH
  '1836': /^(0x)?[0-9a-fA-F]{40}$/,
  // SHIB
  '1837': /^(0x)?[0-9A-Fa-f]{40}$/,
  // ETH
  '1838': /^(0x)?[0-9a-fA-F]{40}$/,
  // UNI
  '1839': /^(0x)?[0-9A-Fa-f]{40}$/,
  // ETH
  '1840': /^(0x)?[0-9a-fA-F]{40}$/,
  // MATIC
  '1841': /^(0x)?[0-9A-Fa-f]{40}$/,
  // Polygon
  '1842': /^(0x)?[0-9A-Fa-f]{40}$/,
};
