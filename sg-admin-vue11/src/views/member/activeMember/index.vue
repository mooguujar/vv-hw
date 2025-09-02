<template>
  <PageWrapper class="LayoutTable" :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label:
                record.state === '1'
                  ? $t('table.member.member_account_nomal')
                  : $t('table.member.member_account_stop'),
              color: record.state === '1' ? '' : 'error',
              ifShow: isHasAuth('10103'),
              onClick: disableStatus.bind(null, record),
            },
            {
              label:
                record.bonus_state === 1
                  ? $t('table.member.member_discount_nomal')
                  : $t('table.member.member_discount_stop'),
              color: record.bonus_state === 1 ? '' : 'error',
              onClick: disableDiscount.bind(null, record),
              ifShow: isHasAuth('10104'),
            },
            {
              label:
                record.commission_state === 1
                  ? $t('table.member.member_rebate_nomal')
                  : $t('table.member.member_rebate_stop'),
              color: record.commission_state === 1 ? '' : 'error',
              onClick: disabledCommission.bind(null, record),
              ifShow: isHasAuth('10111'),
            },
            {
              label:
                record.rebate_state === 1
                  ? `${$t('table.member.member_rebate_status')}`
                  : `${$t('table.member.member_rebate_stoped')}`,
              color: record.rebate_state === 1 ? '' : 'error',
              ifShow: isHasAuth('10112'),
              onClick: rebateFun.bind(null, record),
            },
            {
              label: `${$t('business.common_detail')}`,
              onClick: detailsFun.bind(null, record),
              ifShow: isHasAuth('10133'),
            },
            {
              label: `${$t('business.common_edit')}`,
              onClick: editFun.bind(null, record),
              ifShow: isHasAuth('10109'),
            },
            {
              label: `${$t('business.Venue_balance')}`,
              onClick: venueHandle.bind(null, record),
            },
          ]"
        />
      </template>
      <template #username="{ record }">
        <tooltipIcon
          class="cursor-pointer text-blue"
          :userAlive="record.online"
          :memberId="record.username"
          :os="record.last_login_device"
          @click="openDamaDetailModal(true, { uid: record.uid, username: record.username })"
        />
      </template>
      <template #Balance="{ record }">
        <ReloadTooltip
          v-if="Number(record.balance_total) > 0"
          :record="record"
          :list="record._balanceList"
          :balanceTotle="record.balance_total"
          @reload="hadnleRealodAmount"
        />
        <div v-else>0.00</div>
      </template>
      <template #MemberCommissionData="{ record }">
        <ReloadTooltip
          :record="record"
          v-if="Number(record.balance_agency_total) > 0"
          :balanceTotle="record.balance_agency_total"
          :list="record._commissionList"
          @reload="handleRealodcommissionAmount"
        />
        <div v-else>0.00</div>
      </template>
      <template #form-custom>
        <InputGroup compact style="display: flex; width: 440px">
          <Select v-model:value="currentType" class="pay-select" :listHeight="500">
            <SelectOption value="username">
              {{ $t('business.common_member_account') }}
            </SelectOption>
            <SelectOption value="parent_name">
              {{ $t('business.common_super_agent') }}
            </SelectOption>
            <SelectOption value="realname"> {{ $t('business.common_realiy_name') }} </SelectOption>
            <SelectOption value="phone"> {{ $t('business.common_phone_number') }} </SelectOption>
            <SelectOption value="email"> {{ $t('business.common_email_account') }} </SelectOption>
            <SelectOption value="facebook"> Facebook </SelectOption>
            <SelectOption value="whatsapp"> Whatsapp </SelectOption>
            <SelectOption value="telegram"> Telegram </SelectOption>
            <SelectOption value="zalo"> Zalo </SelectOption>
            <SelectOption value="line"> Line </SelectOption>
            <SelectOption value="twitter"> X </SelectOption>
          </Select>
          <Input
            class="pay-input mr-2.5"
            allowClear
            :placeholder="`${$t('table.member.member_inquiry_input')}`"
            v-model:value="fromSearch"
            @blur="fromSearch = $event.target.value.trim()"
          />
        </InputGroup>
      </template>
      <template #memberRealname="{ record }">
        <RealNameTooltip
          v-if="record?.realname?.first"
          :list="setRealName(record.realname)"
          :totalAmount="record.realname.first"
        />
        <div v-else>{{ record.realname.first ? setName(record.realname) : '-' }}</div>
      </template>
    </BasicTable>
    <disModal @register="registerModal" @enable-success="enable" />
    <setStatusModel
      @register="registerSetStateModel"
      @success-load="enable"
      :titleicon="'notice'"
      :operationApi="operationApi"
    />
    <DamaDialog @register="registerDamaDetailModal" :titleicon="'history'" />
    <venuesModal @register="registerVenues" />
  </PageWrapper>
</template>

<script lang="ts" setup name="ActiveMemberNocash">
  import { ref, onBeforeMount, onMounted } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './active.data';
  import {
    update_bonus,
    update_commission,
    update_rebate,
    getMemberList,
    getLevelList,
    getBalanceAgency,
  } from '/@/api/member/index';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { Input, Select, SelectOption, InputGroup } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import disModal from '../inquiryMember/components/disModal.vue';
  import tooltipIcon from '../common/tooltipIcon.vue';
  import ReloadTooltip from '../common/ReloadTooltip.vue';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import eventBus from '/@/utils/eventBus';
  import { useMemberStore } from '/@/store/modules/member';
  import setStatusModel from '../inquiryMember/components/setStatusModel.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import DamaDialog from '/@/components/DamaDialog/index.vue';
  import { RealNameTooltip } from '/@/components/RealNameTooltip/index';
  import { isHasAuth, auths } from '@/utils/authFunction';
  //查看场馆
  import venuesModal from '/@/views/member/inquiryMember/components/venuesModal.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight340 } from '../../common/component';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight340).value);
  const $router = useRouter();
  const operationApi = ref();
  const isReload = ref(false);
  const { exportFile } = useExportFile();
  //定义当前选中的框
  const currentType = ref('username' as any);
  //输入当前的值
  const fromSearch = ref('' as any);
  const { createMessage } = useMessage();
  const levelList = ref<any>([]);
  const [registerModal, { openModal }] = useModal();
  const [registerDamaDetailModal, { openModal: openDamaDetailModal }] = useModal();
  const [registerVenues, { openModal: openMdalVenues }] = useModal();
  defineEmits(['enableSuccess']);
  const [registerTable, { getForm, reload, getColumns, setColumns }] = useTable({
    api: getData,
    //title: '在线会员',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      // actionColOptions: {
      //   class: 't-form-col',
      //   xxl: 12,
      //   xl: 12,
      //   lg: 12,
      // },
      actionColOptions: {
        class: 'inquireButtonBox t-form-label-com',
      },
      showResetButton: false,
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('business.common_import'),
      },
      resetFunc: handleExportTableList,
    },
    useSearchForm: true,
    //showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      // width: 320,
      title: t('business.common_operate'), //操作
      dataIndex: 'action',
      minWidth: 100,
      slots: { customRender: 'action' },
      ifShow: auths(['10103', '10104', '10133', '10112', '10111', '10109']),
      // fixed: 'right',
    },
    beforeFetch: async (param) => {
      const { validate } = await getForm();
      const values = await validate();
      const condValues = values;
      //if (fromSearch.value) {
      condValues[currentType.value] = fromSearch.value;
      //}
      param['fuzzy'] = condValues['fuzzy'];
      delete condValues['fuzzy'];
      condValues['timezone'] = userStore.defaultTimezone;
      param['cond'] = condValues;
      condValues['online'] = '2';
      for (var key in condValues) {
        delete param[key];
      }
      // for (let key in condValues) {
      //   if (condValues.hasOwnProperty(key) && condValues[key] === '') {
      //     delete condValues[key];
      //   }
      // }
      if (!condValues['last_login_device']) {
        delete condValues['last_login_device'];
      }
      if (!condValues['level_id']) {
        delete condValues['level_id'];
      }
      if (!condValues['username']) {
        delete condValues['username'];
      }
      if (!condValues['vip']) {
        delete condValues['vip'];
      }
      if (isReload.value) {
        param = {
          page: param.page,
          rows: param.rows,
        };
        isReload.value = false;
      }
      return param;
    },
  });
  const [registerSetStateModel, { openModal: openSetState }] = useModal();
  const memberStore = useMemberStore();
  // 获取VIP等级下拉
  memberStore.getVipLevelList();
  // 获取层级下拉
  memberStore.getLevelList();
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const values = await validate();
      values.isLike = 1;
      if (currentType.value && fromSearch.value) {
        values[currentType.value] = fromSearch.value;
      }
      //await exportFile(exportActiveList, values, '活跃会员');
    } catch (e) {
      console.error(e);
    }
    // 避免匯出後自動查詢
    return Promise.reject();
  }

  // function rebateFun(data) {
  //   const name =
  //     data.bonus_state === 1
  //       ? t('table.member.member_rabate_successText')
  //       : t('table.member.member_rabate_failText');
  //   const placeholder =
  //     data.bonus_state === 1
  //       ? t('table.member.member_stop_reason')
  //       : t('table.member.member_open_reason');
  //   const type = data.bonus_state === 1 ? 'stop' : 'open';
  //   openModal(true, {
  //     name: name,
  //     data,
  //     placeholder: placeholder,
  //     type: type,
  //     isUpdate: true,
  //     stateType: 'rebate',
  //   });
  // }
  async function getData(params) {
    const data = await getMemberList(params);
    data.d.forEach((item) => {
      setBalance(item);
    });

    return data;
  }
  function venueHandle(record) {
    openMdalVenues(true, { data: record });
  }
  onBeforeMount(() => {
    eventBus.off('reloadTable');
  });

  onMounted(async () => {
    // 获取会员层级
    const response = await getLevelList({ page: 1, page_size: 25 });
    levelList.value = response.d;
    eventBus.on('reloadTable', async () => {
      isReload.value = true;
      await reload();
    });
    await getForm().setFieldsValue({ vip: '' });
  });

  function disabledFun(data) {
    openSetState(true, data);
    // const name = data.state == '1' ? '您确定停用该会员状态吗？' : '您确定启用该会员状态吗？';
    // const placeholder = data.state == '1' ? '请输入停用原因' : '请输入启用原因';
    // const type = data.state == '1' ? 'stop' : 'open';
    // openModal(true, {
    //   name: name,
    //   placeholder: placeholder,
    //   data,
    //   type: type,
    //   isUpdate: true,
    //   stateType: 'member',
    // });
  }
  // 详情跳转
  function detailsFun(record) {
    let name1 = '';
    if (record.realname.first) {
      name1 = setName(setRealName(record.realname));
    } else {
      name1 = '';
    }
    $router.replace({
      name: 'DetailsOnlineMember',
      state: { id: record.uid, username: record.username, key: 'active', realname: name1 },
    });
    sessionStorage.setItem(
      'DetailsMember_state',
      JSON.stringify({
        path: '/member/activeMember',
        key: 'active',
        id: record.uid,
        username: record.username,
        realname: name1,
      }),
    );
    sessionStorage.setItem('activeMember_activeKey', '1');
  }
  //编辑跳转
  function editFun(record) {
    let name = '';
    if (record.realname.first) {
      name = setName(setRealName(record.realname));
    } else {
      name = '';
    }
    $router.push({
      name: 'EditOnlineMember',
      state: { id: record.uid, key: 'active', realname: name },
    });
  }
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
  // 停启用按钮
  function disableStatus(data) {
    operationApi.value = false;
    //type:1会员状态 2优惠状态 3 返佣状态 4 反水状态
    const text =
      data.state === '1' ? t('business.common_deactivate') : t('business.common_on_activate');
    openSetState(true, {
      data: data,
      titlePreIcon: 'question',
      title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${t(
        'table.member.member_this_member',
      )}`,
      handle: 'state',
    });
  }
  //优惠状态
  async function disableDiscount(data) {
    operationApi.value = update_bonus;
    const text =
      data.bonus_state === 1 ? t('business.common_deactivate') : t('business.common_on_activate');
    openSetState(true, {
      data: data,
      titlePreIcon: 'question',
      title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${t(
        'table.member.member_this_discount',
      )}`,
      handle: 'bonus_state',
    });
  }
  // 佣金余额刷新
  async function handleRealodcommissionAmount(record) {
    const { data, status } = await getBalanceAgency({ uid: record.uid });
    if (status) {
      createMessage.success(t('table.member.member_balance_sucess'));
      const setbalanceObj = {
        balance_agency: {},
      };
      setbalanceObj.balance_agency = data;
      setBalance(setbalanceObj);
      enable();
    } else {
      createMessage.error(t('table.member.member_balance_fail'));
    }
  }
  //佣金状态
  function disabledCommission(data) {
    operationApi.value = update_commission;
    const text =
      data.commission_state === 1
        ? t('business.common_deactivate')
        : t('business.common_on_activate');
    openSetState(true, {
      data: data,
      titlePreIcon: 'question',
      title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${t(
        'table.member.member_this_rebate',
      )}`,
      handle: 'commission_state',
    });
  }
  // 返水状态
  async function rebateFun(data) {
    operationApi.value = update_rebate;
    const text =
      data.rebate_state === 1 ? t('business.common_deactivate') : t('business.common_on_activate');
    openSetState(true, {
      data: data,
      titlePreIcon: 'question',
      title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${t(
        'table.member.member_this_walter',
      )}`,
      handle: 'rebate_state',
    });
  }
  function setBalance(item) {
    //item._balanceList.push(item);
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
  function hadnleRealodAmount(record) {
    reload();
  }
  function enable() {
    reload();
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
  function setName(value) {
    const _list = value.filter((item) => {
      return item.label == 'first';
    });
    const _value = value.filter((item) => {
      return item.label === _list[0].value;
    });
    return _value[0].value;
  }
</script>

<style scoped>
  .LayoutTable ::v-deep(.ant-input-group) {
    display: flex;
  }
</style>
