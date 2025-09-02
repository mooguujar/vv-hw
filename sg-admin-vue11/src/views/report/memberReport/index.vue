<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-dataSlot>
        <DateButtonGroup
          :isSelect="isSelect"
          :dateGroupButtonList="dateGroupButtonList"
          @change-button-day="changeButtonDay"
        />
      </template>
      <template #form-usernameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="username">
              {{ t('business.common_member_account') }}
            </SelectOption>
            <SelectOption value="parent_name">
              {{ t('business.common_super_agent') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>

      <template #tableTitle>
        <div class="w-full">
          <cdButtonCurrency
            :btn-list="currentList"
            @change-button-currency="changeClick"
            v-model="currency_id"
          />
        </div>
      </template>
      <template #username-slot="{ record }">
        <div class="text-[#1475e1] cursor-pointer" @click="() => goToMemberDetail(record.uid)">{{
          record.username
        }}</div>
      </template>
      <template #validBet="{ record }">
        <ReloadTooltip
          :record="record"
          :currency_id="currency_id"
          :timeRange="{ end_time: model.end_time, start_time: model.start_time }"
          :type="'valid_bet_amount'"
        />
      </template>
      <template #realValidBet="{ record }">
        <ReloadTooltip
          :record="record"
          :currency_id="currency_id"
          :timeRange="{ end_time: model.end_time, start_time: model.start_time }"
          :type="'real_valid_bet_amount'"
        />
      </template>
      <template #netAmount="{ record }">
        <ReloadTooltip
          :record="record"
          :currency_id="currency_id"
          :timeRange="{ end_time: model.end_time, start_time: model.start_time }"
          :type="'net_amount'"
        />
      </template>
      <template #depositAmount="{ record }">
        <Tooltip
          v-if="record.tip.deposit_count !== 0"
          placement="rightTop"
          overlayClassName="ad-tooltip"
        >
          <template #title>
            <div class="flex flex-col">
              <div class="flex flex-row">
                <div class="py-2 pl-5 whitespace-nowrap">
                  {{ $t('table.report.save_days') }}：
                </div>
                <div class="py-2 pr-5 whitespace-nowrap"> {{ record.tip.deposit_days }} </div>
              </div>
              <div class="flex flex-row">
                <div class="py-2 pl-5 whitespace-nowrap">
                  {{ $t('table.report.save_time') }}：
                </div>
                <div class="py-2 pr-5 whitespace-nowrap"> {{ record.tip.deposit_count }} </div>
              </div>
            </div>
          </template>
          <div>{{ record.deposit_amount }}</div>
        </Tooltip>
        <div v-else>{{ record.deposit_amount }}</div>
      </template>

      <template #giftAmount="{ record }">
        <Tooltip placement="rightTop" overlayClassName="ad-tooltip">
          <div>{{ record.gift_amount }}</div>
        </Tooltip>
      </template>

      <template #withdrawAmount="{ record }">
        <Tooltip
          v-if="record.tip.withdraw_count !== 0"
          placement="rightTop"
          overlayClassName="ad-tooltip"
        >
          <template #title>
            <div class="flex flex-col">
              <div class="flex flex-row">
                <div class="py-2 pl-5 whitespace-nowrap">
                  {{ $t('table.report.save_time') }}：
                </div>
                <div class="py-2 pr-5 whitespace-nowrap"> {{ record.tip.withdraw_count }} </div>
              </div>
            </div>
          </template>
          <div>{{ record.withdraw_amount }}</div>
        </Tooltip>
        <div v-else>{{ record.withdraw_amount }}</div>
      </template>

      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: $t('table.report.report_betInfo'),
              onClick: betInfoFun.bind(null, record, column),
            },
          ]"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="MemberReportNocash">
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { InputGroup, Select, Input, SelectOption, FormItemRest, Tooltip } from 'ant-design-vue';
  import { getMemberReportList, exportReportMember } from '/@/api/report/index';
  import { useRouter } from 'vue-router';
  import ReloadTooltip from './components/ReloadTooltip.vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { PageWrapper } from '/@/components/Page';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { isHasAuth } from '@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const isSelect = ref('days' as string);
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const $router = useRouter();
  const fromSearch = ref('' as string);
  const currentType = ref('username' as string);
  const currency_id = ref('' as string);
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const { currencyTreeList } = useTreeListStore();

  const { exportFile } = useExportFile();

  const [registerTable, { reload, getForm, getRawDataSource }] = useTable({
    api: async (params) => {
      const res = await getMemberReportList(params);

      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => res.n.includes(item.id)));
      delete res.n;
      delete res.c;
      return res;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
      },
      customClassForm: true,
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showAdvancedButton: false, //是否收起
      showResetButton: isHasAuth('50604'), //导出按钮隐藏
      resetFunc: handleExportTableList,
    },
    beforeFetch: (params) => {
      processingParams(params);
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
    actionColumn: {
      maxWidth: 100,
      title: t('business.common_operate'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    immediate: false,
  });
  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    params['currency_id'] = currency_id.value;
    if (fromSearch.value) params[currentType.value] = fromSearch.value;
    params['sort_key'] = sortKey.value ? sortKey.value : 'valid_bet_amount';
    params['sort_type'] = sortType.value ? sortType.value : 'desc';
    return params;
  }

  function changeButtonDay(value, se) {
    isSelect.value = se;
    nextTick(async () => {
      model.value.start_time = value[0];
      model.value.end_time = value[1];
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
  async function goToMemberDetail(v) {
    const { validate } = getForm();
    const values = await validate();
    values.start_time = values.time[0];
    values.end_time = values.time[1];
    setDateParmas(values);

    $router.push({
      name: 'MemberDetail',
      state: {
        uid: v,
        currencyId: currency_id.value,
        start_time: values.start_time,
        end_time: values.end_time,
        isSelect_: isSelect.value,
      },
    });
  }

  async function betInfoFun(record, column) {
    const { validate } = getForm();
    const values = await validate();
    let state: any = {
      uid: record.uid,
      currency_id: currency_id.value,
      username: record.username,
    };
    const { time } = values;
    if (time && time.length > 0) {
      state.start_time = values.time[0];
      state.end_time = values.time[1];
    }
    setDateParmas(state);
    $router.push({
      name: 'BetInfo',
      state,
    });
  }
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      processingParams(param);
      await exportFile(exportReportMember, param, t('routes.report.memberReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }

  .currentListGroup {
    ::v-deep(.ant-radio-button-wrapper:first-child) {
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      border-left-width: 1px;
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      border-left-width: 1px;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px;
      border-left-width: 1px solid #d9d9d9;
      text-align: center;
    }
  }
</style>
