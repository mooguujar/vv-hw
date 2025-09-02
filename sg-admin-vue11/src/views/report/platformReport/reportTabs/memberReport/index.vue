<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable">
      <template #form-custom>
        <div class="!flex">
          <!-- <Checkbox v-model:checked="checked" @change="selectVague">模糊</Checkbox> -->
          <a-input-group compact style="display: flex">
            <Select v-model:value="currentType" class="pay-select select-left">
              <SelectOption value="username">
                {{ t('business.common_member_account') }}
              </SelectOption>
              <SelectOption value="parent_name">
                {{ t('business.common_super_agent_line') }}
              </SelectOption>
            </Select>
            <Input
              class="mr-2.5 select-right-input"
              allowClear
              style="width: 100%"
              :placeholder="t('business.common_search_tip')"
              v-model:value="fromSearch"
            />
          </a-input-group>
        </div>
      </template>
      <template #summary>
        <TableSummary v-if="stateList" fixed>
          <TableSummaryRow>
            <TableSummaryCell class="text-center" :index="0">{{
              totalgameListByMemberList.username ? totalgameListByMemberList.username : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="1">-</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="2">{{
              totalgameListByMemberList.parent_name ? totalgameListByMemberList.parent_name : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="3">{{
              totalgameListByMemberList.level_name ? totalgameListByMemberList.level_name : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="4">{{
              totalgameListByMemberList.vip ? totalgameListByMemberList.vip : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="5">{{
              totalgameListByMemberList.bet_count ? totalgameListByMemberList.bet_count : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="6">
              {{
                totalgameListByMemberList.bet_count_proportion
                  ? `${mul(totalgameListByMemberList.bet_count_proportion, 100)}%`
                  : '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="7">{{
              totalgameListByMemberList.bet_amount ? totalgameListByMemberList.bet_amount : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="8">{{
              totalgameListByMemberList.valid_bet_amount
                ? totalgameListByMemberList.valid_bet_amount
                : '-'
            }}</TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="9"
              :class="[
                totalgameListByMemberList.net_amount > 0 ? 'text-[#E91134]' : 'text-[#1CD91C]',
              ]"
              >{{
                totalgameListByMemberList.net_amount ? totalgameListByMemberList.net_amount : '-'
              }}</TableSummaryCell
            >
            <TableSummaryCell
              class="text-center"
              :index="10"
              :class="[
                totalgameListByMemberList.profit_rate > 0 ? 'text-[#E91134]' : 'text-[#1CD91C]',
              ]"
              >{{
                totalgameListByMemberList.profit_rate
                  ? `${totalgameListByMemberList.profit_rate}%`
                  : '-'
              }}</TableSummaryCell
            >
          </TableSummaryRow>
        </TableSummary>
      </template>
      <template #currency="{ record }">
        <div>
          <cdIconCurrency :icon="currencyName(record?.currency_id)" class="w-20px mr-3px" />
          {{ currencyName(record?.currency_id) }}
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { ref, onMounted } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import {
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
    Input,
    Select,
    SelectOption,
  } from 'ant-design-vue';
  import { getGameListByMember } from '/@/api/report/index';
  import { mul } from '/@/utils/number';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { PageWrapper } from '/@/components/Page';

  const { t } = useI18n();
  const props = defineProps({
    historyData: {
      type: Object,
      default: () => {},
    },
  });

  const FORM_SIZE = useFormSetting().getFormSize;
  const sortKey = ref('' as any);
  const sortType = ref('' as any);

  const stateList = ref(false as any);
  const currentType = ref<any>('username');
  const fromSearch = ref<any>();
  if (props.historyData.username) {
    fromSearch.value = props.historyData.username;
  }
  // const FORM_SIZE = useFormSetting().getFormSize;
  const totalgameListByMemberList = ref({} as any);
  const { currencyAllTreeList } = useTreeListStore();
  const currentList = ref([...currencyAllTreeList] as any);
  // const currentList = ref([{ name: t('table.member.member_money_all'), value: '',lable:'ALL' },...currencyTreeList] as any);
  const [registerTable, { getForm, getColumns }] = useTable({
    api: async (data) => {
      try {
        const response = await getGameListByMember(data);
        if (response && response.length > 0) {
          stateList.value = true;
        } else {
          stateList.value = false;
        }
        const gameListByMemberList = response.filter((item) => {
          if (item.uid === '0') {
            //后台的uid会有空的情况
            totalgameListByMemberList.value = item;
          } else {
            return true;
          }
        });
        return gameListByMemberList;
      } catch (error) {
        return [];
      }
    },
    resizeHeightOffset: 40,
    columns,
    bordered: true,
    useSearchForm: true,
    formConfig: {
      schemas,
      size: FORM_SIZE,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
      },
    },
    showIndexColumn: false,
    pagination: false,
    beforeFetch: async (param) => {
      if (fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
      param['start_time'] = history.state.start_time;
      param['end_time'] = history.state.end_time;
      param['currency_id'] = history.state.currency_id;
      param['platform_id'] = history.state.platform_id;
      param['sort_key'] = sortKey.value ? sortKey.value : 'valid_bet_amount';
      param['sort_type'] = sortType.value ? sortType.value : 'desc';
      return param;
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
  });
  function currencyName(id) {
    let currencyName = currentList.value.filter((c) => c.id === id)[0].name;
    return currencyName;
  }
  onMounted(async () => {
    await getForm().setFieldsValue({
      optionsSelect: history.state.type,
      searchValue: history.state.values,
    });
  });
</script>
<style lang="less" scoped>
  .red {
    color: #e91134;
  }

  .green {
    color: #1cd91c;
  }
</style>
