<script setup lang='ts'>
import { PhBaseDialog, PhBasePopup } from '@tg/bccomponents'
import { useAppStore, useDialogStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppAddToDesk from '~/components/AppAddToDesk.vue'
import AppDialogLoginPwa from '~/components/AppDialogLoginPwa.vue'
import AppDialogPromoAd from '~/components/AppDialogPromoAd.vue'
import AppDialogShareRegisterLink from '~/components/AppDialogShareRegisterLink.vue'
import AppReloadDialog from '~/components/AppReloadDialog.vue'
import AppReloadNotLoginDialog from '~/components/AppReloadNotLoginDialog.vue'

defineOptions({ name: 'AppGlobalDialog' })
const { t } = useI18n()
const { showSafeDialog, showShareRegisterLinkDialog, showPromoAdDialog, showLoginPwaDialog } = storeToRefs(useDialogStore())
const { isLogin } = storeToRefs(useAppStore())
</script>

<template>
  <div>
    <!-- IOSPwa提示 -->
    <AppAddToDesk />
    <!-- 首页弹窗 -->
    <AppReloadDialog v-if="isLogin" />
    <AppReloadNotLoginDialog v-else />
    <!-- 登录pwa -->
    <PhBasePopup v-model="showLoginPwaDialog">
      <AppDialogLoginPwa />
    </PhBasePopup>
    <!-- 保险库弹窗 -->
    <PhBaseDialog v-if="showSafeDialog" v-model="showSafeDialog">
      保险库弹窗
    </PhBaseDialog>
    <!-- 分享注册链接 -->
    <PhBaseDialog
      v-if="showShareRegisterLinkDialog" v-model="showShareRegisterLinkDialog" :title="t('分享注册链接')"
      style="--ph-base-dialog-background-color: #F6F7F8;"
    >
      <AppDialogShareRegisterLink />
    </PhBaseDialog>
    <AppDialogPromoAd v-if="showPromoAdDialog" />
  </div>
</template>

<style lang='scss' scoped></style>
