import CBOR from 'cbor-js';

/**
 * 加密
 * @param {*} data
 * @returns
 */
export const cborencode = (data: any) => {
  return CBOR.encode(data);
};

/**
 * 解密
 * @param {*} data
 * @returns
 */
export const cbordencode = (data: any) => {
  return CBOR.decode(data);
};

/**
 * arrayBuffer转base64
 * @param {*} buffer
 * @returns
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);

  return window.btoa(binary);
}

export function murmurhash3_32_gc(key: any, seed: any) {
  let remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

  // eslint-disable-next-line prefer-const
  remainder = key.length & 3; // key.length % 4
  // eslint-disable-next-line prefer-const
  bytes = key.length - remainder;
  h1 = seed;
  // eslint-disable-next-line prefer-const
  c1 = 0xcc9e2d51;
  // eslint-disable-next-line prefer-const
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
    h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
  }

  k1 = 0;

  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    // eslint-disable-next-line no-fallthrough
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    // eslint-disable-next-line no-fallthrough
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;

      k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 = ((h1 & 0xffff) * 0x85ebca6b + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((h1 & 0xffff) * 0xc2b2ae35 + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

/**
 * 设置 axios config
 * @param {*} config axios 配置
 * @param {*} device 24 web 25 h5
 * @param {*} isEncryption 是否加密
 * @param {*} isSign 是否签名
 * @param {*} isEncryption
 * @returns void
 */
export const setAxiosConfig = (
  config: any,
  device: number,
  isEncryption = true,
  isSign = true,
  showConsole = true,
) => {
  const cborStr = cborencode(config.data);
  const cborBase64 = arrayBufferToBase64(cborStr);

  if (!device) {
    throw new Error('device is required');
  }

  // 大致判断config是不是axios的config
  if (!config.url) {
    return;
  }

  if (isSign) {
    if (config.method === 'get') {
      // str := fmt.Sprintf("%s%s%s", device, reqTime, decodedValue)
      try {
        const params = config.params;
        let _urlParams = '';
        if (params)
          _urlParams = `${config.url}?${Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join('&')}`;
        else _urlParams = config.url;

        const str = `${device}${new Date().toDateString()}${_urlParams}`;
        const sign = murmurhash3_32_gc(str, device);
        if (showConsole) {
          console.error('GET加密字符串', str, sign);
        }
        config.headers['X-Ca-Timestamp'] = new Date().toDateString();
        config.headers['X-Ca-Nonce'] = sign;
      } catch (error) {
        throw new Error(`GET加密失败${JSON.stringify(error)}`);
      }
    } else {
      // str := fmt.Sprintf("%s%s%s%s", cborBase64, device, reqTime, decodedValue)
      try {
        const str = `${cborBase64}${device}${new Date().toDateString()}${config.url}`;
        const sign = murmurhash3_32_gc(str, device);
        if (showConsole) {
          console.error('POST加密字符串', str, sign);
        }
        config.headers['X-Ca-Timestamp'] = new Date().toDateString();
        config.headers['X-Ca-Nonce'] = sign;
      } catch (error) {
        throw new Error(`POST加密失败${JSON.stringify(error)}`);
      }
    }
  }

  if (isEncryption) {
    config.data = cborStr;
  }

  return config;
};

/**
 * 处理api响应的数据
 * @param {*} response
 */
export const handleResponse = (response: any) => {
  const data = response.data;
  try {
    const result = CBOR.decode(data);
    response.data = result;
    return response;
  } catch (error) {
    return Promise.reject(new Error(`${response.config.url}解密失败`));
  }
};
