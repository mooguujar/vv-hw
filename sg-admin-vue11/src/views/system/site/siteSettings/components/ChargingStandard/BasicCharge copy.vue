<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="site-config">
    <Card :title="t('common.BasicCharges')" style="width: 100%">
      <div class="columns-3">
        <div v-for="(item, index) in dataList" :v-key="item.name" class="flex mb-5 items-center">
          <div class="flex-initial w-32 div-40 div-title mt-3px">
            <Tooltip placement="topLeft" :title="item.label">
              {{ item.label }}
            </Tooltip>
          </div>
          <div class="div-40 mr-5px div-s">:</div>
          <div class="flex items-center">
            <div
              class="min-w-140px flex items-center justify-center"
              v-if="item.name == 'cdn_fee' || item.name == 'domain_fee'"
            >
              <RadioGroup>
                <Radio :value="'1'">按量</Radio>
                <Radio :value="'2'">包月</Radio>
              </RadioGroup>
            </div>
            <Input :value="item.value" class="flex-initial" :disabled="true" :size="'large'">
              <template #addonAfter>
                <div>
                  <cdIconCurrency :icon="'USDT'" class="w-20px" />
                  {{ item.unit }}
                </div>
              </template>
            </Input>
          </div>
        </div>
      </div>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { Card, Input, Tooltip, RadioGroup, Radio } from 'ant-design-vue';
  import { configList } from '@/api/sys';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const dataList = ref();
  const dataLabel = {
    sid: t('common.siteID'),
    line_fee: t('common.LineMaintenanFee'),
    cdn_fee: t('common.CDNMaintenanFee'),
    domain_fee: t('common.DomainExtraCharge'),
    code: t('business.common_site_protocol'),
    bond: t('common.SiteDeposit'),
    overdraft: t('common.MaximumOverdraft'),
    site_fee: t('common.WebsiteCosts'),
  };
  const dataUnit = {
    sid: '',
    line_fee: 'USDT',
    cdn_fee: 'USDT/1GB',
    domain_fee: `USDT/${t('table.member.member_ge')}`,
    code: '',
    bond: 'USDT',
    overdraft: 'USDT',
    site_fee: 'USDT',
  };

  const GetCostDetail = async () => {
    const data = await configList();
    let arrData = [];
    for (let i = 0; i < Object.entries(data).length; i++) {
      var item = {};
      if (Object.entries(data)[i]) {
        item['name'] = Object.entries(data)[i][0];
        item['value'] = Object.entries(data)[i][1];
        item['label'] = dataLabel[item['name']];
        item['unit'] = dataUnit[item['name']];
      }
      if (item['unit']) {
        arrData.push(item);
      }
    }
    const arr = arrData.map((item: any, index) => {
      return {
        id: index,
        ...item,
      };
    });
    dataList.value = arr;
    let customOrder = [0, 5, 1, 3, 2, 4];

    // 创建一个映射表
    let orderMap = {};
    customOrder.forEach((id, index) => {
      orderMap[id] = index;
    });
    arr.sort((a, b) => orderMap[a.id] - orderMap[b.id]);
  };
  const table = ref();
  onMounted(() => {
    GetCostDetail();
  });
</script>
<style scoped>
  .div-40 {
    height: 40px;
    overflow: hidden;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;

    .ant-input {
      height: 40px;
    }
  }

  .div-title {
    padding: 3px;
    padding-top: 10px;
    text-align: right;
  }

  .div-s {
    padding-top: 10px;
  }

  ::v-deep(.ant-input-disabled) {
    border-color: #dce3f1;
    background-color: #f6f7fb !important;
  }

  ::v-deep(.ant-input-group-addon-disabled) {
    border-color: #dce3f1;
    background-color: #dce3f1 !important;
  }

  ::v-deep(.ant-radio-group) {
    display: flex;
    align-items: center;
  }
</style>
