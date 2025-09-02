<template>
  <div class="flex justify-center items-center">
    <Tooltip v-if="memberId.length >= 9" :title="memberId">
      <span class="mr-2 w20 truncate">{{ memberId }}</span>
    </Tooltip>
    <span class="w20 mr-2" v-else>{{ memberId }}</span>
    <Tooltip
      placement="right"
      :title="getOSContitle(os, userAlive)"
      :get-popup-container="getPopupContainer"
    >
      <LaptopOutlined
        v-if="os === '0'"
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: userAlive === '2' ? '#6CDE07' : '#D9D9D9',
        }"
      />
      <LaptopOutlined
        v-if="os === '24'"
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: userAlive === '2' ? '#6CDE07' : '#D9D9D9',
        }"
      />
      <AndroidOutlined
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: userAlive === '2' ? '#6CDE07' : '#D9D9D9',
        }"
        v-if="os === '26'"
      />
      <AppleOutlined
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: userAlive === '2' ? '#6CDE07' : '#D9D9D9',
        }"
        v-if="os === '27'"
      />
      <Html5Outlined
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: userAlive === '2' ? '#6CDE07' : '#D9D9D9',
        }"
        v-if="os === '25'"
      />
      <ChromeOutlined
        :style="{
          fontSize: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '100px',
          color: '#fff',
          lineHeight: '20px',
          paddingTop: '2px',
          backgroundColor: userAlive === '2' ? '#6CDE07' : '#D9D9D9',
        }"
        v-if="os === '28'"
      />
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
  import {
    AndroidOutlined,
    AppleOutlined,
    Html5Outlined,
    LaptopOutlined,
    ChromeOutlined,
  } from '@ant-design/icons-vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = defineProps({
    userAlive: { type: String },

    os: { type: String },

    memberId: { type: String },
  });

  const { t } = useI18n();
  // userAlive 表示在线和离线 os表示设备
  const getOSContitle = (os: any, userAlive: any): string => {
    const osTitles = {
      '0': 'PC',
      '24': 'PC',
      '26': 'Android',
      '27': 'IOS',
      '25': 'H5',
      '28': 'PWA',
    };
    const statusTitles = {
      '2': t('business.common_active'),
      '1': t('business.common_offline'),
    };
    const osTitle = osTitles[os] || t('common.unknow');
    const statusTitle = statusTitles[userAlive] || t('common.unknow');
    return `${osTitle}${statusTitle}`;
    return `${osTitle}`;
  };

  const getPopupContainer = (trigger: HTMLElement) => {
    return trigger.parentElement;
  };
</script>
