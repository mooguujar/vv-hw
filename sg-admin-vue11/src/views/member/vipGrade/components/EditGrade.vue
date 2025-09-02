<template>
  <BasicModal
    @register="registerEditGradeModal"
    :showCancelBtn="false"
    :title="t('table.member.member_update_level_')"
    width="1200px"
    :okText="t('common.confirmSave')"
    @ok="okFun"
    @visible-change="closeFunction"
  >
    <div class="t-form-label-com">
      <Row justify="left" style="flex-flow: nowrap">
        <Col class="w-auto pr-10px blurbox">
          <Checkbox v-model:checked="blurSearch">{{ t('modalForm.member.member_vague') }}</Checkbox>
        </Col>
        <Col class="w-auto pr-10px">
          <InputGroup compact style="display: flex; width: 380px" class="t-form-label-com">
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
        <Col class="pr-10px">
          <Button type="primary" @click="inquire">{{ $t('business.common_inquire') }}</Button>
        </Col>
        <Col class="pr-10px">
          <InputGrop compact style="display: flex" class="t-form-label-com">
            <Select
              v-model:value="levelType"
              class="pay-select select-left w-130px"
              :showArrow="false"
              :open="false"
            >
              <SelectOption value="viplevel">
                {{ t('table.system.system_vip_level') }}
              </SelectOption>
            </Select>
            <Select
              v-if="levelType == 'viplevel'"
              class="pay-input w-168px select-right"
              :placeholder="$t('table.member.member_select_level')"
              :options="vipListdata"
              allowClear
              :disabled="modifyGrade"
              v-model:value="currentUpdateType"
            />
          </InputGrop>
        </Col>
        <Col offset="-1">
          <FormItem labelWidth="40px">
            <RadioGroup v-model:value="memberLocking">
              <Radio :value="1" :disabled="radiolocked">
                {{ $t('table.member.member_locked_') }}
              </Radio>
              <Radio :value="2" :disabled="radiolocking">
                {{ t('table.member.member_open_locked') }}
              </Radio>
              <Tooltip>
                <template #title>
                  <span>{{ t('table.member.member_level_tip1') }}</span>
                </template>
                <Button style="width: 20px" class="toolTip-btn" shape="circle" size="small">
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
          v-if="record?.deposit_detail.length > 0"
          :list="changeAmount(record?.deposit_detail)"
          :totalAmount="record?.deposit_amount"
        />
        <span style="color: #1475e1" v-else>0.00</span>
      </template>
      <template #Withdraw="{ record }">
        <DetailReloadTooltip
          v-if="record?.withdraw_detail.length > 0"
          :list="changeAmount(record?.withdraw_detail)"
          :totalAmount="record?.withdraw_amount"
        />
        <span style="color: #1475e1" v-else>0.00</span>
      </template>
      <template #Cash="{ record }">
        <DetailReloadTooltip
          v-if="record?.cash_profit_detail.length > 0"
          :list="changeAmount(record?.cash_profit_detail)"
          :totalAmount="record?.cash_profit"
        />
        <span style="color: #1475e1" v-else>0.00</span>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from './editGrade.data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useMemberStore } from '/@/store/modules/member';
  import { useMessage } from '/@/hooks/web/useMessage';
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
    Checkbox,
  } from 'ant-design-vue';
  import { updateMemberVip, getMemberListLevel, getMemberReanameist } from '/@/api/member/index';
  import { QuestionOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { DetailReloadTooltip } from '/@/components/DetailReloadTooltip/index';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const memberStore = useMemberStore();
  defineEmits(['register']);
  //const { t } = useI18n();
  // 获取VIP等级下拉
  memberStore.getVipLevelList();
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
  const currentUpdateType = ref(0 as any);
  //层级等级
  const levelType = ref('viplevel' as string);
  const arrVavlues = ref([] as any);
  let selectedRowKey = ref<any>([]);

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (onSelect.value.length === 0) {
        radiolocked.value = true;
        radiolocking.value = true;
      }
      onSelect.value = selectedRows;
      selectedRowKey.value = selectedRowKeys;
      currentUpdateType.value = Number(onSelect.value[0]?.vip) || 0;
      memberLocking.value = Number(onSelect.value[0]?.lock_vip);
      if (selectedRows.length) {
        modifyGrade.value = false;
      } else if (selectedRows.length === 0) {
        modifyGrade.value = true;
      }
      const result = selectedRows.find((item) => item.lock_vip === 2);
      const resultLoc = selectedRows.find((item) => item.lock_vip === 1);
      if (!resultLoc && !result) {
        return;
      }
      if (result?.lock_vip === 2) {
        radiolocked.value = false;
        radiolocking.value = true;
      }
      if (resultLoc?.lock_vip === 1) {
        radiolocking.value = false;
        radiolocked.value = true;
      }
      if (result?.lock_vip === 2 && resultLoc?.lock_vip === 1) {
        radiolocking.value = false;
        radiolocked.value = false;
      }
    },
  };
  const blurSearch = ref(false);
  const [registerTable, { getSelectRows, reload, clearSelectedRowKeys, setTableData }] = useTable({
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

  const [registerEditGradeModal, { setModalProps, closeModal }] = useModalInner(async () => {
    fromSearch.value = '';
    setTableData([]);
    currentUpdateType.value = 0;
    await getVipList();
    setModalProps({ confirmLoading: false });
  });

  let vipListdata = ref<any>([]);

  async function getVipList() {
    const memberStore = useMemberStore();
    const outputArray: { label: string; value: string }[] = [];
    for (const index in memberStore.vipLevelSelect) {
      outputArray.push({
        label: `VIP${memberStore.vipLevelSelect[index]}`,
        value: memberStore.vipLevelSelect[index],
      });
    }
    vipListdata.value = outputArray;
  }

  // 修改VIP会员等级
  async function okFun() {
    const values = await getSelectRows();
    if (values.length === 0) {
      closeModal();
      return;
    }
    try {
      setModalProps({ confirmLoading: true });
      const list = values
        .filter((item) => item.username) // Filter out items with no 'username'
        .map((item) => item.username);
      const { status, data } = await updateMemberVip({
        username: list.join(),
        is_lock: memberLocking.value,
        level: String(currentUpdateType.value),
      });
      if (status) {
        createMessage.success(data);
        clearSelectedRowKeys();
        radiolocked.value = true;
        radiolocking.value = true;
        modifyGrade.value = true;
        reload();
      } else {
        createMessage.error(t('table.member.member_update_failed'));
      }
      closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  async function blurHandle(value) {
    arrVavlues.value = [];
    const data = await getMemberReanameist({
      topic: currentType.value,
      username: fromSearch.value,
    });
    data.forEach((item) => {
      arrVavlues.value.push(item.uid as never);
    });
  }

  function closeFunction(visible: boolean) {
    if (!visible) {
      setTableData([]);
      fromSearch.value = '';
    }
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
      createMessage.error(t('business.common_search_tip'));
    }
    clearSelectedRowKeys();
  }
</script>
<style lang="less" scoped>
  .toolTip-btn:hover {
    border: 1px solid #1475e1 !important;
    color: #1475e1 !important;
  }

  .select-right-input {
    margin-left: -1px;
  }

  ::v-deep(.ant-select-focused) {
    border-right: none !important;
  }

  .blurbox {
    height: 42px;
    line-height: 42px !important;

    ::v-deep(.ant-checkbox) {
      position: absolute;
      top: 14px;
    }

    ::v-deep(.ant-checkbox + span) {
      margin-left: 14px;
    }
  }

  ::v-deep(.ant-checkbox + span),
  ::v-deep(.ant-select-selection-item) {
    color: #535353 !important;
    font-weight: 500 !important;
  }

  .pay-input {
    ::v-deep(.ant-select-selector) {
      border-left: none !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
</style>
