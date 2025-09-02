<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable
      @register="registerTable"
      :class="[isShow ? 'roi__table__warp' : '']"
      :scroll="{ y: scrollHeight }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex == 'blr'">
          <div class="flex items-center justify-center"
            ><img :src="blrSvg" alt="" class="w-4 mr-1" /><div class="">{{
              t('table.race_price.table_BLR_data')
            }}</div></div
          >
        </template>
        <template v-else>
          <span>{{ column.customTitle }}</span>
        </template>
      </template>
      <template #form-newAdd v-if="isHasAuth('30421')">
        <Button type="primary" @click="handleOpenNewAdd(navList)">{{
          t('table.race_price.form_newAdd')
        }}</Button>
      </template>
      <template #form-dateGroup>
        <DateButtonGroup
          :isSelect="isSelect"
          :isCustom="isCustom"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonListAll"
          @update:is-custom="handleIsCustom"
        />
      </template>
      <template #form-modelNameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 42%" v-model:value="currentType" class="br-none">
            <SelectOption value="username">
              {{ t('table.race_price.form_agent_account') }}
            </SelectOption>
            <SelectOption value="created_by">
              {{ t('table.race_price.table_action_operator') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 58%; margin-right: 10px"
            :allowClear="true"
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #form-submitSlot>
        <Button class="ml-1.5" type="primary" @click="getForm().submit()">{{
          t('common.queryText')
        }}</Button>
      </template>
      <template #form-typeColSlot>
        <Tabs
          v-model:activeKey="activeKey"
          class="capsule_tap"
          :destroyInactiveTabPane="true"
          @change="handleChange"
        >
          <TabPane v-for="item in navList" :tab="item.name" :key="item.id" />
        </Tabs>
      </template>
      <template #action="{ record }">
        <div class="text-[#1475e1] cursor-pointer" @click="handleUpdateModal(record, 'update')">{{
          t('modalForm.member.member_authorized_update')
        }}</div>
      </template>
      <template #prepaymentSlot="{ record }">
        <div class="text-[#1475e1] cursor-pointer" @click="handleUpdateModal(record, 'detail')">{{
          record.prepay
        }}</div>
      </template>
      <template #expendSlot="{ record }">
        <div class="text-[#1475e1] cursor-pointer" @click="handleUpdateModal(record, 'detail')">{{
          record.consume
        }}</div>
      </template>
      <template #serviceSlot="{ record }">
        <div class="text-[#1475e1] cursor-pointer" @click="handleUpdateModal(record, 'detail')">{{
          record.fee
        }}</div>
      </template>
      <template #remarkSlot="{ record }">
        <Tooltip :title="record.remark">
          <div class="cursor-pointer text-ellipsis max-w-[150px] overflow-hidden">{{
            record.remark
          }}</div>
        </Tooltip>
      </template>
      <template #summary>
        <TableSummary fixed v-if="sumList.length > 0">
          <TableSummaryRow>
            <TableSummaryCell
              v-for="(item, index) of sumList"
              class="text-center !text-sm"
              :index="index"
              :key="index"
            >
              <template v-if="index < 1">{{ t('business.common_total') }}</template>
              <template v-else-if="index == 10">-</template>
              <template v-else-if="index == 14">{{ item.value + '%' }}</template>
              <template v-else-if="index == 22">{{ item.value + '%' }}</template>
              <template v-else-if="index == 28">{{ item.value + '%' }}</template>
              <template v-else-if="index == 29">{{ item.value + '%' }}</template>
              <template v-else>{{
                item.value !== null && item.value !== undefined && item.value !== ''
                  ? item.value
                  : '-'
              }}</template>
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
    <newAddPrice @register="registerNewAddPriceModal" @active-success="() => reload()" />
    <updateModal @register="registerUpdateModal" @active-success="() => reload()" />
  </PageWrapper>
</template>

<script lang="ts" setup name="racePriceRoi">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonListAll } from './index.data';
  import {
    Select,
    Input,
    SelectOption,
    Button,
    Tabs,
    TabPane,
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
    Tooltip,
  } from 'ant-design-vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import newAddPrice from './components/newAddPrice.vue';
  import updateModal from './components/updateModal/updateModal.vue';
  import { postAdBidsList, getAdGroupSelect } from '/@/api/promotion';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import eventBus from '/@/utils/eventBus';
  import blrSvg from '/@/assets/svg/blrSvg.svg';
  import { cloneDeep } from 'lodash-es';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  interface Item {
    id: number | string;
    name: string;
  }
  const { t } = useI18n();
  const isSelect = ref('');
  const fromSearch = ref('' as string);
  const currentType = ref('username' as string);
  const activeKey = ref(0);
  const isCustom = ref('');
  const sumList = ref<any[]>([]);
  const navList = ref<Item[]>([]);
  const isInit = ref(true);
  const isShow = ref(false);

  const [registerNewAddPriceModal, { openModal: openNewAddModal }] = useModal();
  const [registerUpdateModal, { openModal: openUpdateModal }] = useModal();
  const scrollHeight = Number(useScrollerHeight(450).value);

  const [registerTable, { reload, getForm }] = useTable({
    api: async (params) => {
      const { data } = await postAdBidsList(params);
      if (params.page == 1) {
        if (data.c) {
          sumList.value = columns.map((col) => {
            return {
              title: col.title,
              value: data.c?.[0]?.[col.dataIndex as string],
            };
          });
        } else {
          sumList.value = [];
        }
      }
      const _data = cloneDeep(data);
      delete _data.c;
      if (!data.d) {
        isShow.value = true;
      } else {
        isShow.value = false;
      }
      return _data;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    immediate: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
      },
      customClassForm: true,
      showSubmitButton: false,
      showAdvancedButton: false, //是否收起
      showResetButton: false, //导出按钮隐藏
    },
    beforeFetch: (params) => {
      processingParams(params);
    },
  });

  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    params.gid = activeKey.value.toString();
    delete params.ty;
    if (fromSearch.value) params[currentType.value] = fromSearch.value;
    return params;
  }
  function handleOpenNewAdd(data) {
    openNewAddModal(true, data);
  }

  function handleUpdateModal(data, type) {
    openUpdateModal(true, { data, type });
  }

  async function changeButtonDay(value) {
    await getForm().setFieldsValue({ time: value });
    if (isInit.value) return;
    reload();
  }
  function handleChange() {
    reload();
  }
  function handleIsCustom(v) {
    isCustom.value = v;
  }
  onMounted(async () => {
    const { data } = await getAdGroupSelect();
    navList.value = data;
    isInit.value = false;
    if (!data) {
      activeKey.value = 0;
    } else if (data.length > 2) {
      getForm().setFieldsValue({ ty: 1 });
      activeKey.value = data[0].id;
    } else {
      getForm().setFieldsValue({ ty: 2 });
      activeKey.value = data[1].id;
    }
    reload();
    eventBus.on('onTimeChange', (state) => {
      if (state) {
        isCustom.value = 'custom';
      }
    });
  });
  onBeforeUnmount(() => {
    eventBus.off('onTimeChange');
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    margin-right: 4px;
    border-radius: 4px;
  }

  ::v-deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
    background-color: transparent;
  }

  .roi__table__warp {
    ::v-deep(.roi__first__table) {
      left: 0 !important;
    }

    ::v-deep(.roi__second__table) {
      left: 82px !important;
    }

    ::v-deep(.roi__fourth__table) {
      left: 163px !important;
    }
  }
</style>
