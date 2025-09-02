import { type MqttClient as TMqttClient } from 'precompiled-mqtt';
import { ref } from 'vue';
import { getEnv } from '/@/utils/env';
import { useEventBus } from '@vueuse/core';
import { MQTT_CONNECT_SUCCESS_BUS, eventBusFun } from '/@/utils/event-bus';
import { useUserStore } from '/@/store/modules/user';
import { useAppStore } from '/@/store/modules/app';
import eventBus from '/@/utils/eventBus';
import { useCurrencyStore } from '/@/store/modules/currency';
import { getFinanceLatest } from '/@/api/finance';
import { useNoticeStore } from '/@/store/modules/notice';
import { exportCsvFromResponse } from '/@/utils/helper/paramsHelper';
// import { isObject } from '/@/utils/is';
/**
 * ws://34.92.35.218:8088
 * user = "rmqtt", password = "www.123.com",
 */

type TMqttServer = Array<{
  host: string;
  port: number;
  protocol?: 'wss' | 'ws' | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs';
}>;

const mqttConnectSuccessBus = useEventBus(MQTT_CONNECT_SUCCESS_BUS);
const mqttMessages = ref<any[]>([]);

class SocketClient {
  client: TMqttClient | null = null;
  inputStore: any | null = null;
  subscribeList: string[] = [];

  /** 上一次连接登录状态 */
  lastLoginStatus: string | null = null;

  #MQTT_SERVER: TMqttServer | null = null;

  #log = (message: string, ...rest: any) => {
    console.log(`%c Mqtt ${message}`, 'color: #e10d8a', ...rest);
    if (message === '订阅成功') {
      const userStore = useUserStore();
      if (userStore.dynamicStr && rest[0][0]?.topic.includes(userStore.dynamicStr)) {
        userStore.setDynamicMqtt(rest);
      }
    }
  };

  constructor() {
    this.#log('实例化');
    this.generateMQTT_SERVER();
  }

  /** 生成 #MQTT_SERVER */
  public generateMQTT_SERVER() {
    const { VITE_SOCKET_URL_LIST_STRING } = getEnv();

    console.log(VITE_SOCKET_URL_LIST_STRING);

    if (!VITE_SOCKET_URL_LIST_STRING) {
      this.#MQTT_SERVER = null;
      return;
    }

    const list = VITE_SOCKET_URL_LIST_STRING.split(',');
    const result: TMqttServer = [];
    list.forEach((item) => {
      const [protocol, host, port] = item.split('|');
      result.push({
        host,
        port: Number(port),
        protocol: protocol as any,
      });
    });
    this.#MQTT_SERVER = result;
    console.log('this.#MQTT_SERVER', this.#MQTT_SERVER);
  }

  /** 断开重新连接 */
  public endOrConnect() {
    if (this.client != null) {
      this.#log('已经连接, 断开连接中...');
      const opts: any = null;
      this.client.end(true, opts, () => {
        this.connect();
      });
    }
  }

  public async connect(inputStore?) {
    this.inputStore = inputStore;

    if (this.#MQTT_SERVER) {
      const userStore = useUserStore();
      const token = userStore.getToken;
      // storeToRefs
      if (this.lastLoginStatus === null) this.lastLoginStatus = token;

      if (this.lastLoginStatus === token) {
        if (this.client != null) {
          this.#log('已经连接');
          return;
        }
      } else {
        this.lastLoginStatus = token;
        this.endOrConnect();
        return;
      }

      this.#log('连接中...');

      // 随机生成10位的 客户端ID
      const r = Math.random().toString(36).slice(-10);
      const clientId = token ? `${token}-${Math.floor(Math.random() * 100)}` : `web-random-${r}`;
      this.#log('clientId', clientId);

      import('precompiled-mqtt').then((mqtt) => {
        // const { VITE_SOCKET_USERNAME, VITE_SOCKET_PASSWORD } = getEnv()
        this.client = mqtt.connect({
          // username: VITE_SOCKET_USERNAME,
          // password: VITE_SOCKET_PASSWORD,
          keepalive: 20,
          clientId,
          servers: this.#MQTT_SERVER!,
        });
        this.eventHandler();
      });
    } else {
      this.#log('请在 env文件中 配置连接地址');
    }
  }

  public addSubscribe(subscribeEvent: string, successFn?: () => void) {
    console.log('开始订阅', subscribeEvent);
    if (this.client != null && subscribeEvent) {
      this.client.subscribe(subscribeEvent, (error, granted) => {
        if (error) {
          this.#log(`订阅失败${subscribeEvent}`, error);
        } else {
          this.#log('订阅成功', granted);
          if (successFn) successFn();
          this.subscribeList.push(subscribeEvent);
        }
      });
    }
  }

  public removeSubscribe(subscribeEvent: string, successFn?: () => void) {
    if (this.client != null && subscribeEvent) {
      this.client.unsubscribe(subscribeEvent, (error: any) => {
        if (error) {
          this.#log('取消订阅失败', error);
        } else {
          this.#log(`取消订阅成功 ${subscribeEvent}`);
          const index = this.subscribeList.indexOf(subscribeEvent);
          if (index > -1) this.subscribeList.splice(index, 1);

          if (successFn) successFn();
        }
      });
    }
  }

  public eventHandler() {
    const appStore = useAppStore();
    if (this.client != null) {
      this.client.on('connect', (arg) => {
        this.#log('连接成功', 'Info: ', arg);
        mqttConnectSuccessBus.emit(MQTT_CONNECT_SUCCESS_BUS);
        // if (!appStore.getMqttIsConnected) this.inputStore?.noticeStore.getNotice();
        appStore.setMqttIsConnected(true);
      });

      this.client.on('message', (topic, _message, packet) => {
        let data = {};
        const inportArr: any = [];
        const userStore = useUserStore();
        const info = userStore.getUserInfo;
        // 导出
        if (topic.includes(`${info['prefix']}/${userStore.dynamicStr}`)) {
          data = JSON.parse(packet?.payload?.toString());
          if (data?.d?.length) {
            mqttMessages.value.push(data.d); // 收集所有分片
            console.log(data?.d?.length, 1111);
          }

          if (data?.e === 'end') {
            try {
              const all = mqttMessages.value.flat(); // 扁平化所有数组
              const res = {
                d: all.map(val => [val]), // 转换为二维数组
              };
              exportCsvFromResponse(res);
              userStore.dynamicBoo = false;
            } catch (err) {
              console.error('导出失败', err);
              userStore.dynamicBoo = false;
            }

            // 清理状态
            socketClient.removeSubscribe(`${info['prefix']}/${userStore.dynamicStr}`);
            userStore.dynamicStr = '';
            mqttMessages.value = [];
          }
        }

        // 导入
        if (topic.includes(`${info['prefix']}/merchant/import/${userStore.importStr}`)) {
          inportArr.push(JSON.parse(packet?.payload?.toString()));
          userStore.setInportMqtt(inportArr);
          console.log(222, JSON.parse(packet?.payload?.toString()));
        }
        console.log(111334, topic);
        if (topic.includes(`${info['prefix']}/merchant/promo/pending`)) {
          const noticeStore = useNoticeStore();
          noticeStore.initReviewCounts();
          // this.inputStore?.noticeStore.updateNotice(data);
        }
        try {
          if (topic.includes(`${info['prefix']}/feedback/${info['name']}`)) {
            eventBus.emit('feedback_data', true);
          }
          //返回字符串，所以单独处理
          if (
            !topic.includes(`${info['prefix']}/common`) &&
            !topic.includes(`/zk/currency/status`) &&
            !topic.includes(`${info['prefix']}/merchant/promo/pending`) &&
            !topic.includes(`${info['prefix']}/feedback/${info['name']}`)
          ) {
            data = JSON.parse(packet?.payload?.toString());
          }
          if (topic.includes(`${info['prefix']}/merchant/notice`)) {
            this.inputStore?.noticeStore.updateNotice(data);
          }

          if (topic.includes(`${info['prefix']}/merchant/balance`)) {
            eventBus.emit('RefreshBalance', data);
          }

          if (topic.includes(`${info['prefix']}/notification/deposit`)) {
            eventBus.emit('RefreshNotification', data);
            this.inputStore?.noticeStore.getNotice();
          }

          if (topic.includes(`${info['prefix']}/siteMaintain`)) {
            eventBus.emit('RefreshSiteMaintain', data);
          }
          if (topic.includes(`${info['prefix']}/common`)) {
            eventBus.emit('RefreshWebsiteList', data);
          }
          if (topic.includes(`/zk/currency/status`)) {
            getFinanceLatest().then((res) => {
              const currencyStore = useCurrencyStore();
              currencyStore.initCurrencyList();
            });
          }
        } catch (error) {
          this.#log('收到消息解析失败', error);
        }
      });

      this.client.on('error', (error) => {
        this.#log(`发生错误：${error}`);
        appStore.setMqttIsConnected(false);
      });

      this.client.on('offline', () => {
        this.#log('离线');
        appStore.setMqttIsConnected(false);
      });

      this.client.on('disconnect', (disconnectInfo) => {
        this.#log('断开连接', disconnectInfo);
        appStore.setMqttIsConnected(false);
        this.client = null;
      });

      this.client.on('reconnect', () => {
        this.#log('重新连接');
      });

      this.client.on('end', () => {
        this.#log('连接结束');
        this.client = null;
      });

      this.client.on('close', () => {
        this.#log('连接关闭');
        this.client = null;
      });

      this.client.on('outgoingEmpty', () => {
        this.#log('发送队列为空');
      });

      this.client.on('packetreceive', (packetreceiveInfo) => {
        this.#log('收到数据包 《《《《《《《《《《《', packetreceiveInfo);
      });

      this.client.on('packetsend', (packetsendInfo) => {
        this.#log('发送数据包 》》》》》》》》》》》', packetsendInfo);
      });
    }
  }

  /** 关闭mqtt连接 */
  close() {
    if (this.client != null) {
      const opts: any = null;
      this.client.end(true, opts);
    }
  }
}

export const socketClient = new SocketClient();
