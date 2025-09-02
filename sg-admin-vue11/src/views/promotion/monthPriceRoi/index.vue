<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #form-newAdd>
        <Button type="primary" @click="handleOpenNewAdd({ type: 1 })" v-if="isHasAuth('30431')">{{
          t('business.add_new')
        }}</Button>
      </template>
      <template #advNameSlot="{ record }">
        <div class="flex items-center justify-center">
          <Tooltip :title="record.name" v-if="record.name.length > 9">
            <span class="mr-[6px] truncate">{{ record.name }}</span>
          </Tooltip>
          <span class="mr-[6px] truncate" v-else>{{ record.name }}</span>
          <span
            v-if="record.backup_domain_cnt > 0"
            class="text-[#1475e1] cursor-pointer"
            @click="
              openDomianModal(true, {
                name: record.name,
                backup_domain: record.backup_domain,
                backup_domain_cnt: record.backup_domain_cnt,
              })
            "
            >[{{ record.backup_domain_cnt }}]</span
          >
        </div>
      </template>
      <template #status="{ record }">
        <div class="tag-wrap">
          <div class="tag-label" :style="{ top: labelTop, left: labelLeft }">
            <Tag :color="getStatusColor(record.status)" style="font-size: 8px">
              {{ getStatusTxt(record.status) }}
            </Tag>
          </div>
        </div>
        <div class="tag-content">
          <span v-if="record.status === 3">{{ record.date }}</span>
          <TooltipTable v-else :record="record" />
        </div>
      </template>
      <template #form-modelNameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="name">
              {{ t('table.race_price.form_ad_name') }}
            </SelectOption>
            <SelectOption value="username">
              {{ t('table.race_price.form_agent_account') }}
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
      <template #form-submitSlot>
        <Button class="ml-1.5" type="primary" @click="getForm().submit()">{{
          t('common.queryText')
        }}</Button>
      </template>
      <!-- 汇总、已结束、未开始的tab -->
      <template #form-typeColSlot>
        <Tabs
          v-model:activeKey="activeKey"
          class="capsule_tap"
          :destroyInactiveTabPane="true"
          @change="handleChange"
        >
          <TabPane v-for="item in navList" :tab="item.label" :key="item.value" />
        </Tabs>
      </template>
      <template #action="{ record }">
        <span
          v-if="isHasAuth('30431')"
          class="mr-4 cursor-pointer text-[#1475e1]"
          @click="handleOpenNewAdd({ type: 2, ...record })"
          >{{ t(`table.promotion.promotion_renewal`) }}</span
        >
        <span
          v-if="isHasAuth('30432') && record.status !== 1"
          class="mr-4 cursor-pointer text-[#1475e1]"
          @click="handleOpenNewAdd({ type: 3, ...record })"
          >{{ t('common.editorText') }}</span
        >
        <span
          class="cursor-pointer text-red"
          @click="showConfirm(record)"
          v-if="isHasAuth('30433')"
          >{{ t('common.delText') }}</span
        >
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
    <domianAddModal @register="registerDomianModal" @active-success="() => reload()" />
  </PageWrapper>
</template>

<script lang="ts" setup name="racePriceRoi">
  import { computed, ref } from 'vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { BasicTable, useTable } from '/@/components/Table';
  import { TooltipTable } from '/@/components/TooltipTable';
  import { columns, searchSchema } from './index.data';
  import {
    InputGroup,
    Select,
    Input,
    SelectOption,
    FormItemRest,
    Button,
    Tabs,
    TabPane,
    Tag,
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
    message,
    Tooltip,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import newAddPrice from './components/newAddPrice.vue';
  import domianAddModal from './components/domianAddModal.vue';
  import { postAdMonthlyList, getAdMonthlyDelete } from '/@/api/promotion';
  import { cloneDeep } from 'lodash-es';
  import { openConfirm } from '/@/utils/confirm';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const scrollHeight = Number(useScrollerHeight(450).value);

  const { t } = useI18n();
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);
  const activeKey = ref(0);
  /** 记录临时状态 */
  const tempStatue = ref('11');
  /** 总计 */
  const sumList = ref<any[]>([]);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const navList = [
    { label: t('routes.commission.commissionCollect'), value: 0 },
    { label: t('business.common_month'), value: 2 },
    { label: t('common.ended'), value: 1 },
    { label: t('common.no_started'), value: 3 },
  ];
  /** 多语言广告时间字段 */
  const currentLanguage = useLocaleStoreWithOut();
  const labelTop = computed(() => {
    switch (currentLanguage.getLocale) {
      case 'en_US':
        return '-3px';
      default:
        return '6px';
    }
  });
  const labelLeft = computed(() => {
    switch (currentLanguage.getLocale) {
      case 'en_US':
        return '-19px';
      default:
        return '-20px';
    }
  });

  // 定义状态颜色, 1: 已结束 2: 进行中 3: 未开始
  const getStatusColor = (status) => {
    switch (status) {
      case 3:
        return 'green';
      case 2:
        return 'red';
      case 1:
        return 'grey';
      default:
        return 'grey';
    }
  };
  // 定义状态文字
  const getStatusTxt = (status) => {
    switch (status) {
      case 3:
        return t('common.no_started');
      case 2:
        return t('business.progress');
      case 1:
        return t('common.ended');
      default:
        return t('common.no_started');
    }
  };
  const [registerNewAddPriceModal, { openModal: openNewAddModal }] = useModal();

  const [registerDomianModal, { openModal: openDomianModal }] = useModal();

  const [registerTable, { reload, getForm }] = useTable({
    api: async (params) => {
      const { data } = await postAdMonthlyList(params);
      if (params.page == 1) {
        if (data.c) {
          sumList.value = columns.map((col) => {
            let value = data.c?.[0]?.[col.dataIndex as string];
            const type = ['deposit_roi_rate', 'deposit_rate', 'rec_rate'];
            if (col.dataIndex === 'updated_at' || col.dataIndex === 'consume_day') value = '-';
            return {
              title: col.title,
              value: type.includes(col.dataIndex as string) && value ? `${value}%` : value,
            };
          });
        } else {
          sumList.value = [];
        }
      }
      const _data = cloneDeep(data);
      delete _data.c;
      return _data;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    maxHeight: 570,
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
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
  });
  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    if (fromSearch.value) params[currentType.value] = fromSearch.value;
    params['sort_key'] = sortKey.value ? sortKey.value : '';
    params['sort_type'] = sortType.value ? sortType.value : '';
    if (activeKey.value == 2) params['current_month'] = 1;
    return params;
  }
  /** 新增、续费、编辑事件 */
  function handleOpenNewAdd(data) {
    openNewAddModal(true, data);
  }

  /** 切换汇总、已结束、未开始的tab标签事件 */
  function handleChange() {
    getForm().setFieldsValue({ isShow: activeKey.value });
    if (activeKey.value === 0) {
      // setTimeout(() => {
      // }, 0);
      getForm().setFieldsValue({ status: tempStatue.value });
      reload();
      tempStatue.value = '11';
    } else {
      if (tempStatue.value == '11')
        tempStatue.value = JSON.parse(JSON.stringify(getForm().getFieldsValue().status));
      getForm().setFieldsValue({ status: activeKey.value });
      reload();
    }
  }
  function showConfirm(record) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('table.google.report_columns_APP_delete_msg_1'),
      () => {
        handleDelete(record.id, record.channel_id);
      },
      'confirmModal',
    );
  }
  async function handleDelete(id, channel_id) {
    const { data, status } = await getAdMonthlyDelete({ id: id, channel_id: channel_id });
    if (status) {
      message.success(t('layout.setting.operatingTitle'));
      reload();
    } else {
      message.error(data);
    }
  }
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

  .tag-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 65px;
    height: 65px;
    overflow: hidden;
    text-align: center;
  }

  .tag-label {
    position: absolute;
    transform: rotate(-45deg);
    white-space: nowrap;
  }

  .tag-label span {
    display: block;
    margin: 1px 0;
    padding: 0 20px;
    border: 0 solid #fff;
    border-radius: 0;
    color: #fff;
    font-size: 8px;
    line-height: 14px;
  }

  .tag-label span.ant-tag-green {
    background-color: #1475e1;
  }

  .tag-label span.ant-tag-grey {
    background-color: #d9d9d9;
  }

  .tag-label span.ant-tag-red {
    background-color: #e91134;
  }

  .tag-content {
    padding: 10px 0;
  }

  .truncate {
    display: inline-block; /* 使 span 成为块元素 */
    max-width: 150px; /* 设置最大宽度，根据需要调整 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 使用省略号表示超出部分 */
    white-space: nowrap; /* 不换行 */
  }
</style>
