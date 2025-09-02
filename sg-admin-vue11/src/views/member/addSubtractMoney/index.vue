<template>
  <PageWrapper class="moneyLayout">
    <div class="ant-modal-confirm-title">
      <a
        class="addmoneyText"
        v-for="(item, index) in ButtonList"
        :class="{ 'primary-color': currentComponet === item.type }"
        :key="index"
        @click="setTab(item.type)"
      >
        {{ item.value }}
      </a>
    </div>

    <component :is="currentComponet" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button } from '/@/components/Button';
  import { Space } from 'ant-design-vue';
  import addMoney from './addMoney.vue';
  import moreMoney from './moreAddMoney.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  export default defineComponent({
    components: { PageWrapper, Button, addMoney, moreMoney, Space },
    setup() {
      const FORM_SIZE = useFormSetting().getFormSize;
      const ButtonList = ref([] as any);
      let currentComponet = ref('addMoney' as String);
      function setTab(_key) {
        currentComponet.value = _key;
      }
      const reSetMadelFormHeight = () => {
        let maxModelHeight = window.innerHeight - 72;
        //  let titleHeight = document.getElementsByClassName('ant-modal-confirm-title')[0].clientHeight + 120;
        // document.getElementsByClassName('addMoney')[0].style.maxHeight = maxModelHeight + 'px';
        // document.getElementsByClassName('ant-modal')[0].style.maxHeight = maxModelHeight + 'px';
      };
      watch(currentComponet, (newValue, oldValue) => {
        if (newValue) {
          reSetMadelFormHeight();
        }
      });
      onMounted(() => {
        const { t } = useI18n();
        ButtonList.value = [
          { value: t('modalForm.member.member_add_reduce'), type: 'addMoney' },
          { value: t('modalForm.member.member_add_moreReduce'), type: 'moreMoney' },
        ];
        reSetMadelFormHeight();
      });
      return { ButtonList, setTab, currentComponet, FORM_SIZE, t };
    },
  });
</script>

<style lang="less">
  // .addMoney .moneyLayout .spaceTop {
  //   margin-bottom: 10px;
  // }
  // .addMoney {
  //   overflow: hidden !important;
  // }

  .addMoney .ant-form {
    overflow: hidden scroll !important;
  }

  .addMoney .ant-row {
    //max-height: 700px;
    max-height: 530px;
  }

  .addMoney .ant-modal {
    top: -80px !important;
  }

  .addMoney .ant-input-number-lg {
    font-size: 14px !important;
  }

  .addMoney .ant-modal-confirm .ant-modal-body {
    padding: 0 !important;
  }

  .addMoney .ant-modal-confirm-body .ant-modal-confirm-content {
    margin: 0;
    padding: 0;
  }

  .addMoney .ant-modal-confirm-title {
    margin-bottom: 20px;
    padding: 16px 16px 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 4px 4px 0 0;
    background-color: #1475e1 !important;
    color: rgb(0 0 0 / 85%);
    font-size: 16px;
    line-height: 24px;

    .addmoneyText {
      margin-right: 5px;
      padding: 7px 15px;
      border-radius: 50px;
      background-color: #1475e1;
      color: #fff !important;
      text-align: center !important;
    }

    .primary-color {
      //color: @primary-color;
      background-color: #fff;
      color: #1475e1 !important;
    }
  }

  .addMoney .header {
    height: 30px;
    background-color: @header-bg;
  }

  .addMoney .ant-modal-confirm-title + div > div {
    width: 100%;
    margin: auto !important;

    form {
      //height: 430px;
      height: 560px;
      //margin-bottom: 100px;
      margin-bottom: 70px;
      margin-left: 0 !important;
      overflow-y: scroll;
    }

    form > div {
      //border:1px solid blue;
      width: 490px;
      margin: auto;

      .ant-col > .ant-row > .ant-form-item-label > label {
        color: #444 !important;
        font-family: 'PingFang SC' !important;
        font-size: 14px !important;
        font-weight: 500 !important;
      }

      .ant-col > .ant-row > .ant-form-item-control {
        //border:1px solid red!important;
        .ant-input-number-disabled {
          .ant-input-number-input {
            //border:1px solid red!important; //禁用目前没设计对应的样式
          }
        }

        .ant-select-selector {
          //border: 1px solid #B1BAD3;
          box-shadow: none !important;
        }

        .ant-select-selection-placeholder {
          color: #ccc !important;
          font-weight: 400;
        }

        .ant-select-arrow,
        .ant-select-clear {
          //color:#B1BAD3;
        }

        .ant-radio-group > .ant-radio-wrapper-checked > .ant-radio-checked {
          box-shadow: none !important;
        }

        .ant-input-number {
          box-shadow: none !important;

          input::placeholder {
            color: #ccc;
            font-weight: 400;
          }
        }

        .ant-input-affix-wrapper {
          textarea {
            padding-left: 10px;
            box-shadow: none !important;
          }

          textarea::placeholder {
            color: #ccc;
            font-weight: 400;
          }
        }

        .ant-input-number-handler-wrap {
          // border-color: #B1BAD3;
          span {
            // border-color: #B1BAD3;
            //color: #B1BAD3;
          }
        }
        //.ant-input-number:focus {
        //  box-shadow: none!important;
        //}
        //.ant-input-number::placeholder {
        //  color:red!important;
        //}
      }
    }
    //form > div > div:nth-last-child(2) {
    //  padding-bottom: 10px;
    //}
    form > div > div:last-child {
      //border-top: 1px solid #ccc;
      position: fixed;
      width: 490px;
      //padding-top: 30px;
      //border-top: 1px solid #B1BAD3;
      //display: none;
      //margin-top: 440px;
      margin-top: 550px;

      button {
        //margin-top: 30px;
        margin-top: 10px;
      }
    }

    .ant-input-number {
      box-shadow: none !important;

      input::placeholder {
        color: #ccc;
        font-weight: 400;
      }
    }
  }
  //批量加款减款
  //.addMoney .ant-modal-confirm-title + div > form {
  //  display: none;
  //}
  .addMoney .ant-modal-confirm-title + div > form > div {
    width: 490px;
    margin: auto;

    div > div > div > label {
      color: #444 !important;
      font-family: 'PingFang SC' !important;
      font-size: 14px !important;
      font-weight: 500 !important;
    }

    .ant-form-item-control {
      //border:1px solid red!important;
      textarea {
        // border: 1px solid #B1BAD3;
        // box-shadow: none!important;
        padding-left: 10px;
      }

      textarea::placeholder {
        color: #ccc;
        font-weight: 400;
      }
    }

    .ant-input-number {
      // border: 1px solid #B1BAD3;
      box-shadow: none !important;

      input::placeholder {
        color: #ccc;
        font-weight: 400;
      }
    }

    .ant-select-selector {
      //  border: 1px solid #B1BAD3!important;
      box-shadow: none !important;
    }

    .ant-select-selection-placeholder {
      color: #ccc !important;
      font-weight: 400;
    }

    .ant-select-arrow,
    .ant-select-clear {
      // color:#B1BAD3;
    }
  }
  //.addMoney .ant-modal-confirm-title + div > form > div > div:nth-last-child(2) {
  //
  //}
  .addMoney .ant-modal-confirm-title + div > form {
    //height: 430px;
    height: 460px;
    //margin-bottom: 100px;
    margin-bottom: 70px;
    overflow-y: scroll;
  }

  .addMoney .ant-modal-confirm-title + div > form > div > div:last-child {
    //border-top: 1px solid #ccc;
    position: fixed;
    width: 490px;
    //margin-top: 10px;
    //margin-top: 440px;
    margin-top: 470px;
    //padding-top: 30px;
    padding-top: 10px;
  }

  .addMoney {
    .ant-modal-confirm-btns {
      display: none;
    }
  }
</style>
