<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #form-group_id>
        <div class="mr-2">
          <FormItemRest>
            <Select
              :maxTagCount="1"
              mode="multiple"
              class="multi_select_m min-w-[150px]"
              v-model:value="chosenPromotion"
              @change="handleChannelChange($event, 'chosenPromotion')"
              showSearch
              :filter-option="filterOption"
            >
              <SelectOption value="all"> {{ t('business.common_all') }}</SelectOption>
              <SelectOption
                v-for="option in promotionSelections"
                :key="option.label"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </Select>
          </FormItemRest>
        </div>
      </template>
      <template #form-channel_id>
        <div class="mr-2">
          <FormItemRest>
            <Select
              :maxTagCount="1"
              mode="multiple"
              class="multi_select_m min-w-[150px]"
              v-model:value="chosenChannel"
              showSearch
              :filter-option="filterOption"
              @change="handleChannelChange($event, 'chosenChannel')"
            >
              <SelectOption value="all"> {{ t('business.common_all') }}</SelectOption>
              <SelectOption
                v-for="option in chanelSelections"
                :key="option.label"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </Select>
          </FormItemRest>
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns, schemas, currentDauType, currentRetentionType } from './index.data';
  import { Select, SelectOption } from 'ant-design-vue';
  import { getChannelReportDau, getChannelLinkSelect } from '@/api/promotion';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const chosenPromotion = ref(['all']);
  const chosenChannel = ref(['all']);
  const chanelSelections = ref<any>([]);
  const selectionsData = ref([] as any);
  const promotionSelections = ref([] as any);
  const scrollHeight = Number(useScrollerHeight(340).value);
  const [registerTable, { clearSelectedRowKeys, reload }] = useTable({
    api: async (params) => {
      const { data } = await getChannelReportDau(params);
      return data;
    },
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    immediate: true,
    beforeFetch: (params) => {
      if (!chosenChannel.value.length) {
        chosenChannel.value = ['all'];
      }
      if (!chosenPromotion.value.length) {
        chosenPromotion.value = ['all'];
      }
      params['group_id'] = chosenPromotion.value.includes('all')
        ? ''
        : chosenPromotion.value.length > 0
        ? chosenPromotion.value
        : '';
      params['channel_id'] = chosenChannel.value.includes('all')
        ? ''
        : chosenChannel.value.length > 0
        ? chosenChannel.value
        : '';
      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });
  // 监听 currentDauType 变化
  watch(
    () => currentDauType.value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        reload();
      }
    },
  );
  // 监听 currentRetentionType 变化
  watch(
    () => currentRetentionType.value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        reload();
      }
    },
  );
  const filterOption = (input: string, option: any) => {
    const label = option?.key?.toString().toLowerCase() || '';
    const searchText = input.toLowerCase();
    return label.includes(searchText);
  };
  function handleChannelChange(data: any, refName: string) {
    const target = refName === 'chosenChannel' ? chosenChannel : chosenPromotion;
    if (data.length > 1 && data[0] === 'all') {
      const index = data.indexOf('all');
      if (index !== -1) {
        data.splice(index, 1);
        target.value = data;
      }
    } else if (data.length > 1 && data.includes('all')) {
      target.value = ['all'];
    }

    if (refName === 'chosenPromotion') {
      if (chosenPromotion.value.includes('all')) {
        chanelSelections.value = selectionsData.value
          .filter((item: any) => item?.channels?.length)
          .flatMap((item: any) =>
            item?.channels.map((channel) => ({
              label: channel.channel_name,
              value: channel.id,
            })),
          );
      } else if (chosenPromotion.value.length === 0) {
        chanelSelections.value = [];
        chosenChannel.value = [];
      } else {
        const filtered = selectionsData.value.filter((item: any) =>
          chosenPromotion.value.includes(item.id),
        );

        const channels = filtered
          .flatMap((item: any) => item?.channels || [])
          .map((channel) => ({
            label: channel.channel_name,
            value: channel.id,
          }));

        chanelSelections.value = channels;

        // 如果当前所选渠道中有值但不在新列表中，则重置渠道选择
        const validIds = channels.map((c) => c.value);
        if (!chosenChannel.value.every((id) => validIds.includes(id))) {
          chosenChannel.value = ['all'];
        }
      }
    }
  }
  const getChanelPromotionOptions = async () => {
    const { data } = await getChannelLinkSelect({ state: 0 });
    if (data?.length) {
      selectionsData.value = data;
      promotionSelections.value = data?.map((item: any) => ({
        label: item.group_name,
        value: item.id,
      }));

      chanelSelections.value = data
        // 过滤出有channels的项
        .filter((item) => item.channels?.length)
        // 将channels数组扁平化
        .flatMap((item) =>
          item.channels.map((channel) => ({
            label: channel.channel_name,
            value: channel.id,
          })),
        );
    }
  };
  // 初始化推广商列表
  onMounted(async () => {
    // 切换tab时，默认选中第一个
    currentDauType.value = '1';
    currentRetentionType.value = '1';
    await getChanelPromotionOptions();
  });
</script>

<style lang="scss" scoped>
  ::v-deep(.ant-table-wrapper) {
    padding-left: 10px;
  }

  ::v-deep(.ant-col.ant-col-1) {
    flex: 0 0 2% !important;
  }

  ::v-deep(.multi_select_m) {
    .ant-select-selector {
      top: -3px;
      overflow: hidden;

      .ant-select-selection-overflow {
        flex-wrap: nowrap;
        height: 44px;
        overflow: hidden;

        .ant-select-selection-overflow-item {
          .ant-select-selection-item {
            height: 30px !important;
            padding-right: 10px !important;
            padding-left: 10px !important;
            line-height: 30px !important;
          }
        }
      }
    }

    .ant-select-selection-placeholder {
      top: 23px;
    }

    .ant-select-clear {
      top: 14px;
    }
  }
</style>
