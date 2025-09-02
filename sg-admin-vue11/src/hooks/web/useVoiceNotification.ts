import { useWebNotification } from '@vueuse/core';
import type { WebNotificationOptions } from '@vueuse/core';

export const useVoiceNotification = (options: WebNotificationOptions) => {
  // safari 支持； chrome浏览器需要https
  const { isSupported, notification, show } = useWebNotification(options);

  const open = (audioUrl = '') => {
    if (isSupported.value) {
      // 生成audio
      const audio = document.createElement('audio');
      // 音频地址
      audio.src = audioUrl;
      show();
      audioUrl && audio.play();
    }
  };

  return { open };
};
