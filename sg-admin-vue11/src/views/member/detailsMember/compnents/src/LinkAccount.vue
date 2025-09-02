<template>
  <div class="login">
    <Title :name="$t('table.member.member_link_accont')">
      <template #content>
        <div class="!float-right m-t-3 flex t-form-label-com">
          <InputGroup compact class="!flex">
            <Select
              style="width: 70%"
              v-model:value="props.data.type"
              class="pay-select"
              :options="linkArray"
            />
            <Input
              class="w-full !m-r-5"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="props.data.value"
            />
          </InputGroup>
          <Button @click="queryBtnClick" type="primary" class="m-r-5">{{
            $t('business.common_inquire')
          }}</Button>
        </div>
      </template>
    </Title>

    <BasicTable @register="registerTable" class="!p-0" :scroll="{ y: scrollHeight }">
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: $t('business.common_deal_with'),
              onClick: dealModalOpen.bind(null, record),
            },
          ]"
        />
      </template>
      <template #balance="{ record }">
        <ReloadTooltip
          v-if="Number(record.balance_amount) > 0"
          :record="record"
          :list="record._balanceList"
          :balanceTotle="record.balance_amount"
          @reload="sucessReload"
        />
        <div v-else> 0.00</div>
      </template>
      <template #MemberCommissionData="{ record }">
        <ReloadTooltip
          v-if="Number(record.balance_agency_amount) > 0"
          :record="record"
          :list="record._commissionList"
          :balanceTotle="record.balance_agency_amount"
          @reload="sucessReload"
        />
        <div v-else> 0.00</div>
      </template>
      <template #memberRealname="{ record }">
        <RealNameTooltip
          v-if="record?.real_name?.first"
          :list="setRealName(record.real_name)"
          :totalAmount="record.real_name.first"
        />
        <div v-else>{{ record.real_name.first ? setName(record.real_name) : '-' }}</div>
      </template>
    </BasicTable>
    <dealModal @register="registerDeal" @sucess-reload="sucessReload" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Title } from '../../compnents/index';
  import { linkColumns, formlink } from '../../details.data';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Button, InputGroup, Select, SelectOption, Input } from 'ant-design-vue';
  import { getLinkedList, updatestateMember } from '/@/api/member/index';
  //import { openConfirm } from '/@/utils/confirm';
  //import { useRoute } from 'vue-router';
  import dealModal from './modal/dealModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ReloadTooltip from '../../../common/ReloadTooltip.vue';
  import { linkOptions } from '../../../common/const.ts';
  import { RealNameTooltip } from '/@/components/RealNameTooltip/index';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { setClounmsWidth } from '/@/views/common/component';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(415).value);
  const props = defineProps({
    data: { type: Object, default: { value: null, type: 5 } },
  });

  defineEmits(['register']);
  const [registerTable, { reload, getColumns, setColumns, setPagination }] = useTable({
    api: getData,
    columns: linkColumns,
    //useSearchForm: true,
    showIndexColumn: false,
    bordered: true,
    actionColumn: {
      width: setClounmsWidth(100, 160),
      title: t('business.common_operate'),
      dataIndex: 'action',
      // fixed: 'right',
      ifShow: !isControlValueSet(),
      slots: { customRender: 'action' },
    },

    beforeFetch: (param) => {
      processingParams(param);
    },
    afterFetch: () => {},

    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;

      return {
        sort_key: field ? field : '',
        sort_type: order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '',
      };
    },
  });
  const [registerDeal, { openModal }] = useModal();
  const linkArray = ref(linkOptions as any);
  function dealModalOpen(record) {
    openModal(true, record);
  }
  function setRealName(item) {
    const result = Object.keys(item).map(function (key) {
      //var currency_id = key.substring(1); // 获取数字部分作为 currency_id
      return {
        label: key,
        value: item[key],
      };
    });
    return result;
  }

  function processingParams(params) {
    params['search_type'] = props.data.type || 5;
    params['uid'] = history.state.id;
    if (props.data.type && props.data.value) {
      params['search_value'] = props.data.value;
    }

    return params;
  }
  function setName(value) {
    const _list = value.filter((item) => {
      return item.label == 'first';
    });
    const _value = value.filter((item) => {
      return item.label === _list[0].value;
    });
    return _value[0].value;
  }
  async function getData(params) {
    // 获取会员层级
    const data = await getLinkedList(params);
    data.d.forEach((item) => {
      setBalance(item);
    });

    return data;
  }
  // 构建余额数据
  function setBalanceList(item, id, name, _list) {
    if (Reflect.has(item[id], 'uid')) {
      delete item[id].uid;
    }
    const list = {
      id: id,
      name: name,
      list: Object.keys(item[id])
        .map((label) => ({ label, value: item[id][label] }))
        .filter((item) => {
          return item.label != 'site_id';
        }),
    };
    _list.push(list);
  }

  function setBalance(item) {
    if (!item._balanceList) {
      item._balanceList = [];
    }

    if (!item._commissionList) {
      item._commissionList = [];
    }

    if (item.balance) {
      setBalanceList(item, 'balance', t('table.member.member_wallet_balance'), item._balanceList);
    }
    if (item.balance_locker) {
      setBalanceList(
        item,
        'balance_locker',
        t('table.member.member_balance_locker'),
        item._balanceList,
      );
    }
    if (item.balance_agency) {
      setBalanceList(item, 'balance_agency', '', item._commissionList);
    }
  }
  function queryBtnClick() {
    setPagination({ current: 1 });
    sucessReload();
  }
  function sucessReload() {
    reload();
  }
  defineExpose({
    sucessReload,
    reload,
  });
  onMounted(() => {});
</script>
