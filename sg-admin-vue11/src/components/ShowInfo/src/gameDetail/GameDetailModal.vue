<template>
  <div class="GameMain" ref="main" :style="{ display: isShow ? 'block' : 'none' }">
    <BasicModal
      :showCancelBtn="false"
      v-bind="$attrs"
      :centered="true"
      :min-height="gameHeight"
      :title="$t('table.report.report_game_result')"
      width="750px"
      @register="registerModal"
      :showOkBtn="false"
      :getContainer="() => $refs.main"
    >
      <div class="flex justify-around items-center bg-[#1a2c38]">
        <div
          class="bg-[#1a2c38] text-[#B1BAD3] !text-center flex flex-col items-center justify-around"
        >
          <iframe
            v-if="hasgameDetail"
            :src="currentDomain"
            width="750"
            id="myIframe"
            :height="gameHeight"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { defineComponent, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '@/locales/useLocale';

  const { getLocale } = useLocale();

  const props = {
    hasgameDetail: { type: Boolean, default: false },
  };
  const { t } = useI18n();
  export default defineComponent({
    components: { BasicModal },
    props,
    setup() {
      const info = ref({} as any);
      const detail = ref(null as any);
      const gameDetail = ref('');
      const gameHeight = ref();
      const isShow = ref(false);
      const gameHeightObj = {
        crash: '460',
        Crash: '460',
        dice: '700',
        Dice: '700',
        blackjack: '760',
        Blackjack: '760',
        plinko: '560',
        Plinko: '560',
        mines: '800',
        Mines: '800',
        limbo: '500',
        Limbo: '500',
        hilo: '460',
        Hilo: '460',
      };
      function getUrlParams(domain) {
        return `${domain}/${getLocale.value.split('_')[0]}/minigame-result?admin=1&theme=defalut`;
      }
      const domainObj = {
        ht: 'https://a79163.com',
        a01: 'https://a01.168pn.com',
        win6: 'https://win6.com',
        localhost: 'https://a79163.com',
        ju88: 'https://ju88.app',
        // 正式环境目前没有
        x02: 'https://x02.uat.today',
        v03: 'https://v03.uat.today',
        'v03.uat': 'https://v03.uat.today',
        'x02.uat': 'https://x02.uat.today',
        betbo: 'https://betbo.uat.today',
        betff: 'https://betff.uat.today',
      };
      const currentDomain = ref('');
      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        // 兼容crash等于3的情况
        if (Number(data.game) === 3) {
          data.game = 'crash';
        }
        const iframe = document.getElementById('myIframe') as any;
        let resObj = {};
        const currentNet = window.location.hostname;

        Object.keys(domainObj).forEach((item) => {
          if (currentNet.includes(item)) currentDomain.value = getUrlParams(domainObj[item]);
        });
        if (data.num === 1) {
          isShow.value = false;
          gameHeight.value = 800;
          setModalProps({ confirmLoading: false });
          const res = {
            admin: 1,
            game: data.name,
            uid: data.uid,
            id: data.id,
            type: 'xxxxxxxxxxxxxx',
          };
          resObj = JSON.stringify(res);
        } else {
          gameHeight.value = gameHeightObj[data.game] ? Number(gameHeightObj[data.game]) : 760;
          isShow.value = true;
          setModalProps({ confirmLoading: false });
          const res = {
            admin: 1,
            game: data.game,
            uid: data.uid,
            id: data.id,
            type: 'xxxxxxxxxxxxxx',
          };
          resObj = JSON.stringify(res);
        }
        Object.keys(domainObj).forEach((item) => {
          if (currentNet.includes(item)) {
            currentDomain.value = getUrlParams(domainObj[item]);

            setTimeout(() => {
              iframe.contentWindow && iframe.contentWindow.postMessage(resObj, currentDomain.value);
            }, 111);
          }
        });
      });

      return {
        registerModal,
        info,
        detail,
        gameHeight,
        isShow,
        currentDomain,
      };
    },
  });
</script>
<style lang="less" scoped>
  .GameMain {
    ::v-deep(.ant-modal-header) {
      border-bottom: 0;
      background-color: #1a2c38 !important;

      .vben-basic-title {
        color: white;
        font-size: 28px;
      }
    }

    ::v-deep(.ant-modal-body) {
      .scrollbar__wrap {
        border-radius: 4px;
        background-color: #1a2c38 !important;
      }
    }

    ::v-deep(.ant-modal-footer) {
      border: 0;
    }

    ::v-deep(.scroll-container) {
      padding: 0;
      background-color: #1a2c38;
    }

    ::v-deep(.ant-modal-content) {
      background-color: #1a2c38;
      // background-image: url('../../../assets/images/infoModalBg.webp');
      background-repeat: no-repeat;
      background-size: contain;
    }

    ::v-deep(.ant-modal-close-x) {
      color: white;
    }
  }

  .info-content {
    background-color: #1a2c38;
  }
</style>
