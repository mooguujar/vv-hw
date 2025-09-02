<template>
  <div :class="prefixCls" class="relative w-full h-full">
    <div :class="`${prefixCls}-animation`">
      <img :src="animation" alt="" class="gif-img" />
    </div>
    <div :class="`${prefixCls}-form`">
      <LoginForm />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import LoginForm from './LoginForm.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import animation from '/@/assets/webp/login.gif';
  import base from '/@/assets/webp/base.webp';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });
  const { prefixCls } = useDesign('login');
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #011024;
  @screen-xl: 1200px;
  @screen-xl-1800: 1800px;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;

      &-form {
        background: transparent !important;
      }
    }
  }

  .@{prefix-cls} {
    transition: opacity 0.5s ease-in-out;
    min-height: 100%;
    background-image: url('/@/assets/webp/login-box-bg.webp');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    /* stylelint-disable-next-line media-query-no-invalid */
    @media (max-width: @screen-xl) {
      padding-top: 200px;
      background-image: none;
      /* stylelint-disable-next-line order/properties-order */
      background-color: #011024;
    }

    .@{prefix-cls}-animation {
      width: 1162px;
      height: 826px;
      scale: (0.9);
      position: relative;
      background-image: url('/@/assets/webp/base.webp');

      @media (max-width: @screen-xl) {
        display: none;
      }

      /* stylelint-disable-next-line media-query-no-invalid */
      @media (min-width: @screen-2xl) {
        position: absolute;
        top: 55%;
        left: -20px;
        transform: translateY(-50%);
      }

      @media (min-width: @screen-xl-1800) {
        position: absolute;
        top: 55%;
        left: 5%;
        transform: translateY(-50%);
      }

      @media (min-width: @screen-xl) {
        position: absolute;
        top: 55%;
        left: 5%;
        transform: translateY(-50%);
      }

      .gif-img {
        width: 343px;
        height: 362px;
        position: absolute;
        left: 342px;
        top: -63px;
      }
    }

    .@{prefix-cls}-form {
      width: 460px;
      min-height: 455px;
      margin: 0 auto;
      padding: 52px 32px 0;
      border-radius: 8px;
      background: rgb(34 59 89 / 60%);
      box-shadow: 1px 1px 0 0 rgb(112 195 255 / 25%) inset,
        0 10px 40px 0 rgb(70 166 255 / 20%) inset;

      /* stylelint-disable-next-line media-query-no-invalid */
      @media (min-width: @screen-2xl) {
        position: absolute;
        top: 50%;
        right: 300px;
        transform: translateY(-50%);
      }

      @media (min-width: @screen-xl) {
        position: absolute;
        top: 50%;
        right: 150px;
        transform: translateY(-50%);
      }

      /* stylelint-disable-next-line media-query-no-invalid */
      @media (min-width: @screen-xl-1800) {
        position: absolute;
        top: 50%;
        right: 100px;
        transform: translateY(-50%);
      }

      & input {
        font-size: 18px !important;
      }

      & .ant-form-item {
        margin-bottom: 32px;
      }

      & .ant-form-item:nth-last-child(2) {
        margin-bottom: 25px;
      }

      & .ant-form-item:last-child {
        margin-bottom: 23px;
      }

      & .ant-input {
        border: 0;
        border-radius: 6px;
      }

      & .ant-input-affix-wrapper-lg {
        padding: 3.5px 11px;
        border: 0;
      }

      & .ant-dropdown-trigger {
        width: 136px;
      }

      & .ant-input-affix-wrapper {
        border: 0;
      }

      & .ant-input:focus,
      .ant-input-affix-wrapper-focused,
      .ant-input-affix-wrapper-focused:focus {
        border-right-width: 0 !important;
      }

      & .ant-form-item-has-error span {
        background-color: #12253b !important;
      }

      & .ant-btn-primary {
        color: #071824;
      }

      & .ant-btn-primary:hover,
      .ant-btn-primary:focus {
        border-color: #00e701;
        background: #00e701;
      }

      & ::placeholder {
        color: #44597a;
      }

      & .ant-input-password-icon {
        color: #b1bad3;
      }
    }

    span.ant-input-affix-wrapper {
      background: #12253b;
    }

    input:not([type='checkbox']) {
      padding: 11px;
      background: transparent !important;
      box-shadow: 0 0 0 1000px #12253b inset !important;
      color: #b1bad3 !important;
    }

    input[type='password'] {
      padding: 11px;
      background: transparent !important;
      color: #b1bad3 !important;
    }

    .ant-divider-inner-text {
      color: @text-color-secondary;
      font-size: 18px;
    }
  }
</style>
