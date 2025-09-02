<template>
  <div>
    <BasicModal
      :showCancelBtn="false"
      :showOkBtn="false"
      :title="`${$t('routes.commission.commissionDetail')} (${getDatailTitle})`"
      @register="registerSend"
      :width="910"
      :height="700"
      :closeFunc="closeFunc"
    >
      <Card class="commision-style">
        <!-- 直属业绩 -->
        <CardGrid v-if="agentMode !== 1" class="cardGrade bgColor1" :hoverable="false">
          <div
            >{{ $t('table.system.system_direct_performance') }}
            <Tooltip placement="right">
              <template #title>
                <div
                  ><span class="fac">{{ $t('table.system.system_direct_performance') }}：</span
                  >{{ $t('table.system.commsision_tip_2') }}</div
                >
              </template>
              <Icon icon="tabler:bulb" />
            </Tooltip>
          </div>
          <span class="text-2xl font-700">{{ valid_bet_amount_direct }}</span>
        </CardGrid>
        <!-- 直属佣金 -->
        <CardGrid v-if="agentMode !== 1" class="cardGrade bgColor2" :hoverable="false">
          <div
            >{{ $t('table.system.system_direct_commission')
            }}<Tooltip placement="right">
              <template #title>
                <div
                  ><span class="fac">{{ $t('table.system.system_direct_commission') }}：</span
                  >{{ $t('table.system.commsision_tip_0') }}</div
                >
              </template>
              <Icon icon="tabler:bulb" /> </Tooltip
          ></div>
          <span class="text-2xl font-700">{{ commission_amount_direct }}</span>
        </CardGrid>
        <!-- 团队业绩 -->
        <CardGrid class="cardGrade bgColor1" :hoverable="false">
          <div
            >{{ t('common.group_performance')
            }}<Tooltip placement="right">
              <template #title>
                <div
                  ><span class="fac">{{ t('common.group_performance') }}：</span
                  >{{ $t('common.group_valid_coding') }}</div
                >
              </template>
              <Icon icon="tabler:bulb" /> </Tooltip
          ></div>
          <span class="text-2xl font-700">{{ valid_bet_amount_other }}</span>
        </CardGrid>
        <!-- 团队佣金 -->
        <CardGrid class="cardGrade bgColor2" :hoverable="false">
          <div>
            <div
              >{{ $t('common.group_commission')
              }}<Tooltip placement="right">
                <template #title>
                  <div
                    ><span class="fac">{{ t('common.group_commission') }}：</span
                    >{{ $t('common.group_valid_commission') }}</div
                  >
                </template>
                <Icon icon="tabler:bulb" /> </Tooltip
            ></div>
            <span class="text-2xl font-700">{{ commission_amount_other }}</span>
          </div>
        </CardGrid>
      </Card>
      <!-- 佣金发放记录总揽 -->
      <BasicTable @register="registerList" v-show="!showDetailTable">
        <template #headerCell="{ column }">
          <div
            v-if="
              column.dataIndex === 'valid_bet_amount_direct' ||
              column.dataIndex === 'valid_bet_amount_other' ||
              column.dataIndex === 'commission_amount_direct' ||
              column.dataIndex === 'commission_amount_other'
            "
          >
            {{ column.customTitle }}
            <cdIconCurrency :icon="isCurrencyTitle(currencyId)" class="w-20px img-top" />
          </div>
          <div v-else>{{ column.customTitle }}</div>
        </template>
        <template #summary>
          <TableSummary v-if="getSummaryList">
            <TableSummaryRow>
              <TableSummaryCell class="!text-center !text-sm" :index="0">{{
                $t('business.common_total')
              }}</TableSummaryCell>
              <TableSummaryCell v-if="agentMode !== 1" class="!text-center !text-sm" :index="0">{{
                getSummaryList.valid_bet_amount_direct +
                '/' +
                getSummaryList.valid_bet_cnt_direct +
                t('component.unit.people')
              }}</TableSummaryCell>
              <TableSummaryCell v-if="agentMode !== 1" class="!text-center !text-sm" :index="0">
                -
              </TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0">
                {{
                  getSummaryList.valid_bet_amount_other +
                  '/' +
                  getSummaryList.valid_bet_cnt_other +
                  t('component.unit.people')
                }}
              </TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0"> - </TableSummaryCell>
              <TableSummaryCell v-if="agentMode !== 1" class="!text-center !text-sm" :index="0">
                {{ getSummaryList.commission_amount_direct }}
              </TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0">
                {{ getSummaryList.commission_amount_other }}
              </TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <!-- 佣金发放记录详情 -->
      <BasicTable
        @register="registerTableDetail"
        v-show="showDetailTable"
        class="send-commission-modal-table"
      >
        <template #form-goback>
          <BasicButton
            type="primary"
            class="mb-2.5"
            @click="goback"
            :iconSize="20"
            preIcon="RectBack:svg"
          >
            {{ t('common.back') }}
          </BasicButton>
        </template>
        <template #headerCell="{ column }">
          <div v-if="column.dataIndex === 'contribution_amount'">
            <Tooltip placement="right">
              <template #title>
                <span class="fac">{{ t('table.system.contribution_amount_self') }}：</span>
                {{ t('table.system.commsision_tip_11') }}
              </template>
              <Icon icon="tabler:bulb" />
            </Tooltip>
            {{ t('table.system.contribution_amount_self') }}
            <cdIconCurrency :icon="isCurrencyTitle(currencyId)" class="w-20px img-top" />
          </div>
          <div v-else>{{ column.customTitle }}</div>
        </template>
        <template #summary>
          <TableSummary v-if="getList">
            <TableSummaryRow>
              <TableSummaryCell class="!text-center !text-sm" :index="0">{{
                $t('business.common_total')
              }}</TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0"> - </TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0"> - </TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0">
                {{ totleData.valid_bet_amount_self }}
              </TableSummaryCell>
              <TableSummaryCell class="!text-center !text-sm" :index="0">
                {{ totleData.contribution_amount }}
              </TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    getDetailRecordList,
    getSummaryRecordList,
    getCommissionConfig,
  } from '/@/api/commission/index';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { FormSchema } from '/@/components/Form/index';
  import { ref, h, onMounted } from 'vue';
  import {
    Card,
    CardGrid,
    Tooltip,
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
  } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useGameMapping } from '/@/views/common/commonSetting';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const loading = ref(false as any);
  const { getAllCurrencyList } = useCurrencyStore();
  const { gameMapping } = useGameMapping();
  // 代理模式
  const agentMode = ref(1);
  // 详情表格是否显示
  const showDetailTable = ref(false);
  // 返回
  function goback() {
    showDetailTable.value = false;
  }
  // 总揽表格列表
  const summaryList: BasicColumn[] = [
    {
      title: t('business.changguan'),
      dataIndex: 'mode_id',
      align: 'center',
      minWidth: 100,
      customRender: ({ text, record }) => {
        if (!text) return '-';
        const values = text.split(',');
        const displayText =
          values.length === 6
            ? t('business.common_all')
            : values.map((value) => gameMapping[value] || value).join('/');
        return h(
          'a',
          {
            onClick: () => {
              detailModeId.value = text;
              detailId.value = record.id;
              showDetailTable.value = true;
              reload();
            },
          },
          displayText,
        );
      },
    },
    {
      title: t('table.system.system_direct_performance'),
      dataIndex: 'valid_bet_amount_direct',
      minWidth: 100,
      align: 'center',
      ifShow: () => agentMode.value !== 1,
      customRender: ({ record }) => {
        return (
          `${record.valid_bet_amount_direct}/${record.valid_bet_cnt_direct}` +
          t('component.unit.people')
        );
      },
    },
    {
      title: t('直属佣金比例'),
      dataIndex: 'commission_direct_rate',
      minWidth: 100,
      align: 'center',
      ifShow: () => agentMode.value !== 1,
      customRender: ({ text }) => {
        return text + '%';
      },
    },
    {
      title: t('团队业绩'),
      dataIndex: 'valid_bet_amount_other',
      minWidth: 100,
      align: 'center',
      customRender: ({ record }) => {
        return (
          `${record.valid_bet_amount_other}/${record.valid_bet_cnt_other}` +
          t('component.unit.people')
        );
      },
    },
    {
      title: t('团队佣金比例'),
      dataIndex: 'commission_other_rate',
      minWidth: 100,
      align: 'center',
      customRender: ({ text }) => {
        return text + '%';
      },
    },
    {
      title: t('直属佣金'),
      dataIndex: 'commission_amount_direct',
      minWidth: 100,
      align: 'center',
      ifShow: () => agentMode.value !== 1,
    },
    {
      title: t('团队佣金'),
      dataIndex: 'commission_amount_other',
      minWidth: 100,
      align: 'center',
    },
  ];
  // 表格详情
  const columns: BasicColumn[] = [
    {
      title: t('business.common_type'),
      dataIndex: 'mode_id',
      minWidth: 80,
      align: 'center',
      customRender: () => {
        if (!detailModeId.value) return '-';
        const values = detailModeId.value.split(',');
        return values.length === 6
          ? t('business.common_all')
          : values.map((value) => gameMapping[value] || value).join('/');
      },
    },
    {
      title: t('business.common_member_account'),
      dataIndex: 'username',
      minWidth: 80,
      align: 'center',
    },
    {
      title: t('business.common_super_agent'),
      dataIndex: 'parent_name',
      minWidth: 80,
      align: 'center',
    },
    {
      title: t('table.system.valid_bet_amount_self'),
      dataIndex: 'valid_bet_amount_self',
      minWidth: 80,
      align: 'center',
    },
    {
      title: t('table.system.contribution_amount_self'), //贡献佣金
      dataIndex: 'contribution_amount',
      minWidth: 80,
      align: 'center',
    },
  ];
  // 搜索表单
  const searchFormSchema: FormSchema[] = [
    {
      field: 'goback',
      component: 'Input',
      label: '',
      slot: 'goback',
    },
    {
      field: 'selectType',
      component: 'Select',
      label: '',
      colProps: { span: 4, class: 'm-l-265px' },
      defaultValue: 'username',
      componentProps: {
        allowClear: false,
        getPopupContainer: () => document.body,
        options: [
          {
            label: t('business.common_member_account'),
            value: 'username',
          },
          {
            label: t('business.common_super_agent'),
            value: 'parent_name',
          },
        ],
      },
    },
    {
      field: 'selectValue',
      component: 'Input',
      label: '',
      colProps: { span: 8, class: 'm-l-10px' },
    },
  ];
  // 获取总揽id
  const getSummaryId = ref('' as any);
  // 直属业绩
  const valid_bet_amount_direct = ref('0' as any);
  // 直属佣金
  const commission_amount_direct = ref('0' as any);
  // 团队业绩
  const valid_bet_amount_other = ref('0' as any);
  // 团队佣金
  const commission_amount_other = ref('0' as any);
  // 当前币种
  const currencyId = ref('' as any);
  // 详情场馆ID
  const detailModeId = ref('' as any);
  // 详情查询id
  const detailId = ref('' as any);
  // 总揽总计列表
  const getSummaryList = ref([] as any);
  // 详情总计列表
  const getList = ref([] as any);
  const getDatailTitle = ref('' as any);
  // 详情总计数据
  const totleData = ref({ valid_bet_amount_self: '0.00', contribution_amount: '0.00' } as any);
  //判断表格标题是否是货币
  function isCurrencyTitle(currencyId) {
    if (!currencyId) return false;
    let hasCurrency = getAllCurrencyList.filter((c) => c.id === currencyId);
    return hasCurrency.length > 0 ? hasCurrency[0].name : false;
  }
  // 获取总揽表格列表
  const [registerList, { reload: reloadList }] = useTable({
    api: async () => {
      const params = {
        id: getSummaryId.value,
      };
      const { data, status } = await getSummaryRecordList(params);
      if (status) {
        valid_bet_amount_direct.value = data.total.valid_bet_amount_direct;
        commission_amount_direct.value = data.total.commission_amount_direct;
        valid_bet_amount_other.value = data.total.valid_bet_amount_other;
        commission_amount_other.value = data.total.commission_amount_other;
        getSummaryList.value = data.detail.c[0];
        return data.detail;
      }
      return [];
    },
    immediate: false,
    columns: summaryList,
    bordered: true,
    useSearchForm: false,
    showIndexColumn: false,
  });
  // 获取详情表格列表
  const [registerTableDetail, { reload, getForm }] = useTable({
    api: async () => {
      const params = {
        id: detailId.value,
        page: 1,
        page_size: 25,
      };
      const values = getForm().getFieldsValue();
      params[values.selectType] = values.selectValue;
      const { data, status } = await getDetailRecordList(params);
      let list = [];
      if (status) {
        loading.value = false;
        list = data?.d;
        getList.value = data?.d;
        totleData.value = data?.c[0];
      }
      return list;
    },
    immediate: false,
    showIndexColumn: false,
    useSearchForm: true,
    bordered: true,
    columns,
    formConfig: {
      actionColOptions: {
        class: 't-form-label-com m-l-10px',
        span: 1,
      },
      showResetButton: false,
      schemas: searchFormSchema,
      size: FORM_SIZE as any,
    },
  });
  // 进入该页面
  const [registerSend] = useModalInner((data) => {
    getSummaryId.value = data.data.id;
    currencyId.value = data?.data?.currency_id;
    getDatailTitle.value = data?.data?.username;
    reloadList();
    loading.value = true;
  });
  // 关闭弹窗时重置表单
  function closeFunc() {
    getForm().resetFields();
    showDetailTable.value = false;
    return true;
  }
  // 获取佣金配置
  const getCommissionConfigData = async () => {
    const data = await getCommissionConfig();
    agentMode.value = data.mode;
  };
  onMounted(async () => {
    await getCommissionConfigData();
  });
</script>

<style lang="scss" scoped>
  ::v-deep(.vben-basic-table-form-container) {
    padding: 0 !important;
  }

  .commision-style {
    margin-bottom: 10px;
  }

  .commision-style .ant-card-grid {
    padding: 20px 10px 20px 40px;
  }

  ::v-deep(.ant-card-grid) {
    width: 50%;
  }

  ::v-deep(.vben-basic-table .vben-basic-table-form-container) {
    padding: 0 !important;
  }

  ::v-deep(.img-top) {
    vertical-align: top;
  }

  .commision-style .cardGrade {
    color: #fff;
  }

  .bgColor1 {
    background: linear-gradient(170.74deg, #2f4553 5.61%, #263d4b 96.19%);
  }

  .bgColor2 {
    background-color: #1475e1;
  }

  .fac {
    color: #facd91;
  }
</style>
<style lang="scss">
  .send-commission-modal-table {
    .ant-form {
      // margin: 0;
      padding: 0;
    }
    &.vben-basic-table {
      padding: 0;
    }
  }
</style>
