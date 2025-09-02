/**
 * @file 事件总线
 * @module utils/event-bus
 */
import { useEventBus } from '@vueuse/core';
import { getEnv } from '/@/utils/env';

const { VITE_PROJECT_TAG } = getEnv();

/** 聊天室消息 通知 */
export const CHAT_MESSAGE_BUS = 'CHAT_MESSAGE_BUS';
/** 场馆维护 通知 */
export const MAINTAIN_MESSAGE_BUS = 'MAINTAIN_MESSAGE_BUS';
export const MAINTAIN_TOPIC = VITE_PROJECT_TAG + '/platform';
/** MQTT 连接成功 通知 */
export const MQTT_CONNECT_SUCCESS_BUS = 'MQTT_CONNECT_SUCCESS_BUS';

export function eventBusFun({ topic, data }) {
  switch (topic) {
    case MAINTAIN_TOPIC:
      const maintainMessageBus = useEventBus(MAINTAIN_MESSAGE_BUS);
      maintainMessageBus.emit(data);
      break;
  }
}
