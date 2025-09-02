<template>
  <PageWrapper :contentStyle="{ margin: '10px' }">
    <Tabs class="capsule_tap" v-if="getCount > 0">
      <template v-for="item in achieveList">
        <TabPane :tab="item.value" :key="item.key" v-if="item.ifShow">
          <component :is="item.key" :info="item.type" />
        </TabPane>
      </template>
    </Tabs>
    <noData v-else />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Space, Tabs } from 'ant-design-vue';
  import { Button } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import wallet from './component/FundingLog.vue';
  import operate from './component/Operationlog.vue';
  import login from './component/LoginLog.vue';
  import vipLog from './component/vipLog.vue';
  import exchange from './component/ExchangeLog.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import levelLog from './component/LevelLog.vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import noData from '/@/views/sys/noData/index.vue';

  const { t } = useI18n();
  export default defineComponent({
    components: {
      Button,
      wallet,
      operate,
      login,
      PageWrapper,
      Space,
      Tabs,
      exchange,
      vipLog,
      TabPane: Tabs.TabPane,
      levelLog,
      noData,
    },
    setup() {
      const achieveList = [
        {
          value: t('table.member.member_fund_log'),
          key: 'wallet',
          type: 1,
          ifShow: isHasAuth('10127'),
        },
        {
          value: t('table.member.member_operate_log'),
          key: 'operate',
          ifShow: isHasAuth('10125'),
          type: 5,
        },
        {
          value: t('table.member.member_login_log'),
          key: 'login',
          type: 6,
          ifShow: isHasAuth('10123'),
        },
        {
          value: t('table.member.member_exchange_log'),
          key: 'exchange',
          type: 3,
          ifShow: isHasAuth('10701'),
        }, //兑换日志
        {
          value: t('table.member.member_vip_log'),
          key: 'vipLog',
          type: 4,
          ifShow: isHasAuth('10702'),
        }, //VIP日志
        {
          value: t('table.member.level_log'),
          key: 'levelLog',
          type: 5,
          ifShow: isHasAuth('70892'),
        },
      ];
      let currentModal = ref('wallet' as string);
      let currenttype = ref(1 as Number);
      const getCount = ref(null as any);
      function tabChang(_key: string, type: Number) {
        currenttype.value = type;
        currentModal.value = _key;
      }
      onMounted(() => {
        achieveList.forEach((log) => {
          if (log.ifShow) {
            getCount.value++;
          }
        });
      });
      return { tabChang, currentModal, currenttype, achieveList, getCount };
    },
  });
</script>
<style scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 10px !important;
  }

  ::v-deep(.vben-basic-form) {
    background-color: #fff;
  }
</style>
