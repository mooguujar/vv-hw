/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 网络请求 URL */
  readonly VITE_HTTP_BASEURL: string
  /** 网络请求超时时间 */
  readonly VITE_HTTP_TIMEOUT: number
  /** Socket 地址，使用','分隔多个连接地址，每个连接地址通过|分隔, 第一位是协议，第二位是ip或者域名，第三位是端口 */
  readonly VITE_SOCKET_URL_LIST_STRING: string
  /** Socket 用户名 */
  readonly VITE_SOCKET_USERNAME: string
  /** Socket密码 */
  readonly VITE_SOCKET_PASSWORD: string
  /** 站点名称 */
  readonly VITE_OFFICIAL_NAME: string
  /** 站点域名 */
  readonly VITE_OFFICIAL_DOMAIN: string
  /** 包网名称 */
  VITE_SITE_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'cbor-js'
