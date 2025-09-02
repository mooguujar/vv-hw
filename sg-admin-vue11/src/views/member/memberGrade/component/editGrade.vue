<template>
  <BasicModal
    @register="registerEditGradeModal"
    :destroyOnClose="true"
    :title="$t('modalForm.member.member_updata_level')"
    width="1100px"
    :okText="$t('common.confirmSave')"
    :cancelText="$t('business.common_cancel')"
    @ok="okFun"
  >
    <div class="t-form-label-com">
      <Row justify="left" style="flex-flow: nowrap">
        <Col class="pr-16px">
          <Checkbox v-model:checked="blurSearch" /> {{ t('modalForm.member.member_vague') }}
        </Col>
        <Col class="pr-16px">
          <InputGroup compact style="display: flex; width: 360px" class="t-form-label-com">
            <Select
              v-model:value="currentType"
              class="pay-select select-left"
              :dropdownMatchSelectWidth="false"
            >
              <SelectOption value="username">
                {{ $t('table.system.system_member_account') }}
              </SelectOption>
              <SelectOption value="parent_name">
                {{ $t('business.common_super_agent') }}
              </SelectOption>
            </Select>
            <Input
              class="pay-input select-right-input"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
              :maxlength="500"
              @change="blurHandle"
            />
          </InputGroup>
        </Col>
        <Col class="pr-16px">
          <Button type="primary" @click="inquire">{{ $t('business.common_inquire') }}</Button>
        </Col>
        <Col class="pr-16px">
          <FormItem :label="$t('table.report.report_member_level')">
            <Select
              :placeholder="$t('table.member.member_updata_tip1')"
              :options="vipListdata"
              style="width: 140px"
              allowClear
              :disabled="modifyGrade"
              v-model:value="currentUpdateType"
            />
          </FormItem>
        </Col>
        <Col offset="-1">
          <FormItem labelWidth="40px">
            <RadioGroup v-model:value="memberLocking">
              <Radio :value="1" :disabled="radiolocked" style="width: 65px">{{
                $t('table.member.member_locked_')
              }}</Radio>
              <Radio :value="2" :disabled="radiolocking">
                {{ t('table.member.member_open_locked') }}
              </Radio>
              <Tooltip>
                <template #title>
                  <span>{{ t('table.member.member_level_tip') }}</span>
                </template>
                <Button style="width: 20px" shape="circle" size="small">
                  <template #icon>
                    <QuestionOutlined />
                  </template>
                </Button>
              </Tooltip>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
    </div>
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }">
      <template #Deposit="{ record }">
        <DetailReloadTooltip
          v-if="record?.deposit_detail.length"
          :list="changeAmount(record?.deposit_detail)"
          :totalAmount="record?.deposit_amount"
        />
        <span v-else>0.00</span>
      </template>
      <template #Withdraw="{ record }">
        <DetailReloadTooltip
          v-if="record?.withdraw_detail.length"
          :list="changeAmount(record?.withdraw_detail)"
          :totalAmount="record?.withdraw_amount"
        />
        <span v-else>0.00</span>
      </template>
      <template #Cash="{ record }">
        <DetailReloadTooltip
          v-if="record?.cash_profit_detail.length"
          :list="changeAmount(record?.cash_profit_detail)"
          :totalAmount="record?.cash_profit"
        />
        <span v-else>0.00</span>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from './editGrade.data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useMemberStore } from '/@/store/modules/member';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { DetailReloadTooltip } from '/@/components/DetailReloadTooltip/index';
  import {
    TableProps,
    Input,
    Row,
    Col,
    FormItem,
    Select,
    SelectOption,
    Button,
    RadioGroup,
    Radio,
    Tooltip,
    InputGroup,
    message,
    Checkbox,
  } from 'ant-design-vue';
  import { updateMemberLevel, getMemberListLevel, getMemberReanameist } from '/@/api/member/index';
  import { QuestionOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const memberStore = useMemberStore();
  // 获取VIP等级下拉
  memberStore.getVipLevelList();
  memberStore.getLevelList();
  const memberLocking = ref(0 as number);
  //锁定
  const radiolocked = ref(true as any);
  // 解锁
  const radiolocking = ref(true as any);
  // 修改等级的选定和禁止选择
  const modifyGrade = ref(true as boolean);
  //会员账号和上级代理输入
  const currentType = ref('username' as string);
  //账号代理搜索
  const fromSearch = ref('' as string);
  // 选中监听
  const onSelect = ref([] as any);
  //选中等级
  const currentUpdateType = ref(0);
  const arrVavlues = ref([] as any);
  const blurSearch = ref(false as any);
  let selectedRowKey = ref<any>([]);
  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (onSelect.value.length === 0) {
        radiolocked.value = true;
        radiolocking.value = true;
      }
      onSelect.value = selectedRows;
      selectedRowKey.value = selectedRowKeys;
      if (selectedRows.length > 0) {
        currentUpdateType.value = Number(selectedRows[0]?.level_id);
        modifyGrade.value = false;
      } else if (selectedRows.length === 0) {
        modifyGrade.value = true;
      }
      const result = selectedRows.find((item) => item.level_lock_state === '2');
      const resultLoc = selectedRows.find((item) => item.level_lock_state === '1');
      if (!resultLoc && !result) {
        return;
      }
      if (result?.level_lock_state === '2') {
        radiolocked.value = false;
        radiolocking.value = true;
        memberLocking.value = 2;
      }
      if (resultLoc?.level_lock_state === '1') {
        radiolocking.value = false;
        radiolocked.value = true;
        memberLocking.value = 1;
      }
      if (result?.level_lock_state === '2' && resultLoc?.level_lock_state === '1') {
        radiolocking.value = false;
        radiolocked.value = false;
      }
    },
  };
  const [registerTable, { getSelectRows, reload, clearSelectedRowKeys }] = useTable({
    api: getMemberListLevel,
    columns,
    immediate: false,
    bordered: true,
    showIndexColumn: false,
    maxHeight: 450,
    rowKey: 'uid',
    rowSelection: rowSelection,
    beforeFetch: (param) => {
      if (fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
      if (blurSearch.value) {
        param['uid'] = arrVavlues.value.join(',');
      }
      param['fuzzy'] = blurSearch.value;

      return param;
    },
  });
  const [registerEditGradeModal, { setModalProps }] = useModalInner(async () => {
    fromSearch.value = '';
    modifyGrade.value = true;
    currentUpdateType.value = 0;
    await getVipList();
    setModalProps({ confirmLoading: false });
  });

  let vipListdata = ref<any>([]);

  async function getVipList() {
    for (const key in memberStore.levelSelect) {
      vipListdata.value.push({ label: memberStore.levelSelect[key], value: Number(key) });
    }
  }

  // 修改VIP会员等级
  async function okFun() {
    const values = await getSelectRows();
    if (values.length === 0) {
      createMessage.error(t('table.member.member_update_member_tip'));
      return;
    }
    try {
      setModalProps({ confirmLoading: true });
      const list = values
        .filter((item) => item.username) // Filter out items with no 'username'
        .map((item) => item.username);
      const { status, data } = await updateMemberLevel({
        username: list.join(),
        is_lock: memberLocking.value,
        level_id: String(currentUpdateType.value),
      });
      if (status) {
        createMessage.success(data);
        clearSelectedRowKeys();
        radiolocked.value = true;
        radiolocking.value = true;
        modifyGrade.value = true;
        currentUpdateType.value = 0;
        reload();
      } else {
        createMessage.error(t('table.member.member_update_failed'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  async function blurHandle(value) {
    arrVavlues.value = [];
    const data = await getMemberReanameist({ topic: 'username', username: fromSearch.value });
    data.forEach((item) => {
      arrVavlues.value.push(item.uid as never);
    });
  }

  function changeAmount(values) {
    const list = values.map((item) => {
      return {
        label: item.currency_name,
        value: item.amount,
      };
    });
    return list;
  }
  // 查询会员
  async function inquire() {
    if (fromSearch.value) {
      reload();
    } else {
      message.error(t('business.common_search_tip'));
    }
    clearSelectedRowKeys();
  }
</script>
<style lang="less" scoped>
  .select-right-input {
    margin-left: -1px;
  }

  ::v-deep(.ant-select-focused) {
    border-right: none !important;
  }

  ::v-deep(.ant-table-body) {
    table:first-child {
      td:first-child div {
        width: 48px !important;
        min-width: 48px !important;
      }

      .ant-table-placeholder {
        .ant-table-expanded-row-fixed {
          width: 100% !important;
          min-width: 100% !important;
        }

        .ant-empty,
        .ant-empty-image {
          width: 100% !important;
          min-width: 100% !important;
        }
      }
    }
  }
</style>
