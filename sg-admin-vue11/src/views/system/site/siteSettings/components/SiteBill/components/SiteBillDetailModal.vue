<template>
  <div class="relative main venuesClassZoom" ref="main">
    <BasicModal
      v-bind="$attrs"
      :centered="true"
      :useWrapper="true"
      :wrapperFooterOffset="-99"
      width="1130px"
      @register="registerModal"
      :getContainer="() => $refs.main"
      :showCancelBtn="false"
      :showOkBtn="false"
    >
      <div class="absolute w-full h-40 -top-62">
        <p class="absolute z-100 text-[20px] text-white top-30 left-5"
          >{{ t('business.common_site_name') }}：{{ info?.site_name }}</p
        >
        <p class="absolute z-100 text-[16px] text-white top-45 left-5">
          <span
            >{{ t('table.system.system_table_header_billing_month') }}:
            {{ toTimezone(info?.time, t('common.TimeFormat1')) }}</span
          >
          <span class="ml-20"
            >{{ t('table.system.system_table_header_affiliated_group') }}:
            {{ info?.group_name }}</span
          >
          <span class="ml-20"
            >{{ t('table.system.system_table_header_site_code') }}: {{ info?.prefix }}</span
          >
        </p>
      </div>

      <div class="p-5 mt-5">
        <div>
          <Steps :current="setNum">
            <Step :title="t('common.GenerateBill')">
              <template #description>
                <p>{{ toTimezone(info?.time, t('common.TimeFormat1')) }}</p>
              </template>
            </Step>
            <Step :title="t('table.system.site_bill_to_be_verified')">
              <template #description> </template>
            </Step>
            <Step :title="t('table.system.site_bill_to_be_paid')" />
            <Step :title="t('common.Completed')" />
          </Steps>
        </div>

        <div>
          <Descriptions :column="4" bordered layout="vertical">
            <DescriptionsItem :label="t('table.system.system_table_header_platform_cost')">
              {{ info?.base_fee }}</DescriptionsItem
            >
            <DescriptionsItem :label="t('common.commen_guaranteed_fee') + '(U)'">
              {{ info?.guaranteed_fee }}
            </DescriptionsItem>
            <DescriptionsItem :label="t('common.CDNOverageFee')">
              {{ info?.cdn_overage_fee }}
            </DescriptionsItem>
            <DescriptionsItem :label="t('common.domainOverageFee')">
              {{ info?.domain_overage_fee }}</DescriptionsItem
            >

            <DescriptionsItem :label="t('common.BillSettlement')">
              {{ info?.name }}</DescriptionsItem
            >
            <DescriptionsItem :label="t('table.system.system_table_header_discount_expense')">
              {{ info?.discounted_fee }}
            </DescriptionsItem>
            <DescriptionsItem :label="t('table.system.system_table_header_actual_settlement_fees')">
              <span style="color: #d9001b">{{ info?.actual_settlement_fee }}</span>
            </DescriptionsItem>
            <DescriptionsItem>
              <template #label>
                <span
                  >{{ t('common.billStatus') }}
                  <span
                    >(<span class="primary-color cursor" @click="openRemark(info, 1)">{{
                      t('table.system.system_his')
                    }}</span
                    >)</span
                  ></span
                >
              </template>
              <span
                :style="{
                  color: info?.state == 3 ? '#D9001B' : info?.state == 4 ? '#63A103' : '#F59A23',
                }"
              >
                {{ siteBillStatus[info?.state] }}</span
              >
            </DescriptionsItem>
          </Descriptions>
        </div>
        <div class="mt-3">
          <Card :title="title" bordered v-bind="$attrs" :bodyStyle="{ padding: '20px' }">
            <div class="flex mt--15px ml--15px">
              <!-- <RadioGroup
                class="currentListGroup"
                v-model:value="currency_id"
                button-style="solid"
                @change="changeButtonDayEChartsOverView"
              >
                <RadioButton
                  v-for="(item, index) in currentList"
                  :value="item.value"
                  :key="item.value"
                >
                  {{ item.label }}
                </RadioButton>
              </RadioGroup> -->
              <cdButtonCurrency
                :btn-list="currentList"
                :firstList="[]"
                :showwhitebg="true"
                @change-button-currency="changeButtonDayEChartsOverView"
                v-model="currency_id"
              />
            </div>
            <BasicTable @register="registerTable">
              <template #remarkDiv="{ record }">
                <span
                  v-if="record.remark"
                  class="primary-color cursor"
                  @click="openRemark(record, 2)"
                  >{{ t('common.ViewNotes') }}</span
                >
                <span v-else>- </span>
              </template>
              <template #summary>
                <TableSummary fixed>
                  <TableSummaryRow>
                    <TableSummaryCell class="!text-center !text-sm" :index="0">
                      {{ t('common.SummaryTotal') }}
                    </TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">{{
                      settlement
                    }}</TableSummaryCell>
                    <TableSummaryCell class="!text-center !text-sm">-</TableSummaryCell>
                  </TableSummaryRow>
                </TableSummary>
              </template>
            </BasicTable>
          </Card>
        </div>
      </div>
      <remarkModal @register="registerMark" />
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    Steps,
    Card,
    Descriptions,
    DescriptionsItem,
    RadioGroup,
    RadioButton,
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
  } from 'ant-design-vue';
  import { toTimezone } from '@/utils/dateUtil';
  import { useSiteBillStatus } from '/@/views/system/common/const';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns } from './siteBillDetail.data';
  import remarkModal from './remarkModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getSiteBillDetail } from '@/api/sys';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';

  export default defineComponent({
    name: 'SafeGuardModal',
    components: {
      BasicModal,
      Steps,
      Step: Steps.Step,
      Card,
      Descriptions,
      DescriptionsItem,
      RadioGroup,
      RadioButton,
      cdButtonCurrency,
      BasicTable,
      remarkModal,
      TableSummary,
      TableSummaryRow,
      TableSummaryCell,
    },
    setup() {
      const { t } = useI18n();
      const { siteBillStatus } = useSiteBillStatus();
      const info: any = ref(null);
      const setNum = ref(0);
      const currency_id = ref('' as string);
      const dataSource = ref([]);
      const getTime = ref('');
      const settlement = ref('0' as any);
      const title =
        t('common.PlatformFeeDetails') +
        ' (' +
        t('common.settlement_timezone') +
        '：' +
        t('common.Universal') +
        ')';
      const { currencyTreeList } = useTreeListStore();
      const currentList = ref([
        { name: t('table.member.member_money_all1'), value: '', lable: 'ALL' },
      ] as any);
      const [registerMark, { openModal: openRemarkModal }] = useModal();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async ({ record, data }) => {
          reload();
          getTime.value = record.time;
          info.value = record;
          setNum.value = info.value.state - 1;
          const infoItem = currencyTreeList.find((el: any) => el.id == info.value.currency_id);
          if (infoItem) {
            info.value.name = infoItem.name;
          }
          const row = getRawDataSource();
          currentList.value = [
            { name: t('table.member.member_money_all1'), value: '', lable: 'ALL' },
          ].concat(currencyTreeList.filter((item) => row.n.includes(item.id)));
          dataSource.value.forEach((item) => {
            const matchedItem = currencyTreeList.find((el: any) => el.id == item.currency_id);
            if (matchedItem) {
              item.name = matchedItem.name;
            }
          });
          const dataList = getRawDataSource();
          setModalProps({ confirmLoading: false });
        },
      );

      const [registerTable, { reload, setTableData, getRawDataSource }] = useTable({
        columns,
        useSearchForm: false,
        bordered: true,
        showIndexColumn: false,
        api: getSiteBillDetail,
        beforeFetch: (params) => {
          const date = toTimezone(getTime.value); // '2024-02-21'
          const startTime = dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'); // 转换为 '2024-02-21 00:00:00'
          const endTime = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'); // 转换为 '2024-02-21 23:59:59'
          params['id'] = info.value.id;
          params['start_time'] = startTime;
          params['end_time'] = endTime;
          params['currency_id'] = currency_id.value;
        },
        afterFetch: () => {
          const row = getRawDataSource();
          currentList.value = [
            { name: t('table.member.member_money_all1'), value: '', lable: 'ALL' },
          ].concat(currencyTreeList.filter((item) => row.n.includes(item.id)));
          settlement.value = row?.c[0].settlement_fee;
        },
      });

      async function changeButtonDayEChartsOverView(v) {
        currency_id.value = v;
        reload();
      }

      function openRemark(data, type) {
        if (type == 1) openRemarkModal(true, { data: data.history, type });
        else openRemarkModal(true, { data: data.remark, type });
      }

      return {
        title,
        registerModal,
        info,
        setNum,
        siteBillStatus,
        currentList,
        currency_id,
        changeButtonDayEChartsOverView,
        registerTable,
        registerMark,
        openRemark,
        settlement,
        toTimezone,
        t,
      };
    },
  });
</script>
<style lang="less" scoped>
  .main {
    ::v-deep(.ant-modal-header) {
      width: 100%;
      height: 160px;
      border-bottom: none;
      background-attachment: scroll;
      background-color: rgb(24 145 255) !important;
      background-image: url('../../../../../../../assets/images/bg.svg');
      background-repeat: no-repeat;
      background-position: center bottom;
      background-size: 1440px 623px;
      box-shadow: rgb(0 0 0 / 24.7%) 0 0 10px;
      background-origin: border-box;

      .vben-basic-title {
        color: white;
        font-size: 28px;
      }
    }

    ::v-deep(.ant-modal-body) {
      .scrollbar__wrap {
        border: 0;
      }

      .scrollbar {
        padding: 0;
      }
    }

    ::v-deep(.ant-modal-footer) {
      border: 0;
      background-color: white;
    }

    ::v-deep(.ant-modal-close-x) {
      color: white;
    }

    ::v-deep(.scrollbar) {
      overflow: visible;
    }

    .info-body {
      border-top: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
      color: #666;

      & > div {
        width: 25%;

        & > div:nth-of-type(1) {
          background-color: #f2f2f2;
          font-size: 16px;
        }

        div {
          height: 50px;
          padding-left: 15px;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          line-height: 50px;

          input {
            line-height: 25px;
          }
        }
      }
    }

    ::v-deep(.ant-modal-wrap) {
      overflow: visible;
    }

    ::v-deep(.ant-table-content) {
      table {
        font-size: 12px;
      }
    }

    ::v-deep(.vben-basic-table) {
      .ant-table-title {
        padding: 13px 13px 0;
        background-color: #f9f9f9;

        h2 {
          font-size: 17px;
        }
      }
    }
  }

  .customize {
    ::v-deep(.ant-modal-header) {
      display: none;
    }
  }
</style>
