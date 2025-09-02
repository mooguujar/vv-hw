<template>
  <div @click="openDrawer(true)">
    <div class="settingBadge">
      <Badge>
        <template #count>
          <span class="notify-count">新</span>
        </template>
      </Badge>
    </div>
    <Icon icon="ion:settings-outline" />
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import SettingDrawer from './SettingDrawer';
  import Icon from '@/components/Icon/Icon.vue';
  import { Badge } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';

  export default defineComponent({
    name: 'SettingButton',
    components: { SettingDrawer, Icon, Badge },
    setup() {
      const [register, { openDrawer }] = useDrawer();

      return {
        register,
        openDrawer,
      };
    },
  });
</script>
<style lang="less" scoped>
  @keyframes jump {
    from {
      transform: scale3d(1, 1, 1) translateY(0);
    }

    5% {
      transform: scale3d(1.03, 0.97, 1) translateY(-1px);
    }

    12.5% {
      transform: scale3d(1, 1, 1) translateY(-10px);
    }

    20% {
      transform: scale3d(0.98, 1.02, 1) translateY(-1px);
    }

    25% {
      transform: scale3d(1.06, 0.94, 1) translateY(4px);
    }

    32.5% {
      transform: scale3d(0.97, 1.03, 1) translateY(-4px);
    }

    40% {
      transform: scale3d(1, 1, 1) translateY(0);
    }

    100% {
      transform: scale3d(1, 1, 1) translateY(0);
    }
  }
  .settingBadge {
    position: absolute;
    top: 0px;
    right: 0px;
    animation-duration: 1.6s;
    animation-name: jump;
    animation-iteration-count: 5;
  }
  .settingBadge + .app-iconify {
    padding-left: 12px;
    padding-right: 12px;
  }
  .notify-count {
    height: 14px;
    line-height: 13px;
    font-size: 12px;
    background-color: #e91134;
    padding: 1px 6px;
    border-radius: 20px;
    position: absolute;
    top: 16px;
    margin-right: 3px;
    z-index: 80;
  }
</style>
