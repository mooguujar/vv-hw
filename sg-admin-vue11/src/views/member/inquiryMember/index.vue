<template>
  <PageWrapper class="LayoutTable" :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" bordered :scroll="{ y: scrollHeight }">
      <template #form-custom>
        <a-input-group compact style="display: flex; width: 330px" class="t-form-label-com">
          <a-select
            style="width: 55%"
            v-model:value="currentType"
            class="pay-select"
            :listHeight="500"
            @change="handleChangeUsername"
          >
            <a-select-option value="username">
              {{ $t('business.common_member_account') }}
            </a-select-option>
            <a-select-option value="email">
              {{ $t('business.common_email_account') }}
            </a-select-option>
            <a-select-option value="phone">
              {{ $t('business.common_phone_number') }}
            </a-select-option>
            <a-select-option value="realname">
              {{ $t('business.common_realiy_name') }}
            </a-select-option>
            <a-select-option value="top_name">
              {{ $t('common.top_name') }}
            </a-select-option>
            <a-select-option value="parent_name">
              {{ $t('business.common_super_agent') }}
            </a-select-option>
            <a-select-option value="facebook"> Facebook </a-select-option>
            <a-select-option value="whatsapp"> Whatsapp </a-select-option>
            <a-select-option value="telegram"> Telegram </a-select-option>
            <a-select-option value="zalo"> Zalo </a-select-option>
            <a-select-option value="line"> Line </a-select-option>
            <a-select-option value="twitter"> X </a-select-option>
            <!-- <a-select-option value="cpf"> CPF </a-select-option> -->
          </a-select>
          <a-input
            v-if="currentType === 'realname'"
            class="pay-input"
            style="width: 45%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
            @change="changeSearch"
            @blur="fromSearch = $event.target.value.trim()"
          />
          <a-input
            class="pay-input"
            style="width: 45%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
            :options="fuzzyOptions"
            @search="handleFuzzySearch"
            v-else
          />
        </a-input-group>
      </template>
      <template #form-startDate="{ model, field }">
        <a-date-picker
          :placeholder="`${$t('business.common_start_time')}`"
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
          style="width: 300px"
        />
      </template>
      <template #member_tree="{ record }">
        {{ levelList.find((item) => item.level_id === record.member_tree)?.name }}
      </template>
      <template #memberId="{ record }">
        <tooltipIcon
          class="cursor-pointer text-blue"
          :userAlive="record.online"
          :memberId="record.username"
          :os="record.last_login_device"
          @click="openDamaDetailModal(true, { uid: record.uid, username: record.username })"
        />
      </template>
      <template #balance="{ record }">
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
      <template #action="{ record }">
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
              ifShow: isHasAuth('10104'),
              onClick: disableDiscount.bind(null, record),
            },
            {
              label:
                record.commission_state === 1
                  ? $t('table.member.member_rebate_nomal')
                  : $t('table.member.member_rebate_stop'),
              color: record.commission_state === 1 ? '' : 'error',
              onClick: disabledCommission.bind(null, record),
              ifShow: () => record.member_type == 2 && isHasAuth('10111'),
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
              ifShow: isHasAuth('10109'),
              label: `${$t('business.common_edit')}`,
              onClick: editFun.bind(null, record),
            },
            {
              label: `${$t('business.Venue_balance')}`,
              onClick: checkViews.bind(null, record),
            },
          ]"
        />
      </template>
      <template #form-search>
        <a-button type="primary" class="mr-2" @click="getForm().submit()">{{
          $t('business.common_inquire')
        }}</a-button>
      </template>
      <template #form-importField>
        <a-button
          type="primary"
          class="responsive-ml !mr-2 !bg-#719f2f !text-white !border-color-#719f2f"
          v-if="isHasAuth('10110')"
          @click="handleExportIn"
        >
          {{ $t('business.common_import') }}
        </a-button>
        <a-button
          class="!bg-#f3b151 !border-color-#f3b151 !text-white"
          type="primary"
          @click="handleExportTableList"
          :class="[locale === 'zh_CN' && '!mr-2']"
        >
          {{ $t('business.common_export') }}
        </a-button>
      </template>
      <template #form-changeState>
        <a-button
          v-if="auths(['10103', '10104', '10111', '10112'])"
          type="primary"
          @click="handleBeachUpdate"
        >
          {{ $t('business.common_chang_status') }}
        </a-button>
      </template>
      <template #memberRealname="{ record }">
        <RealNameTooltip
          v-if="record?.realname?.first"
          :list="setRealName(record.realname)"
          :totalAmount="record.realname.first"
        />
        <div v-else>{{ record.realname.first ? setName(record.realname) : '-' }}</div>
      </template>

      <template #form-stateSelect>
        <div
          class="flex t-form-label-com"
          style="margin-right: 10px"
          :class="[setClassWidth({ zh_CN: '!w-[280px]', default: '!w-[380px]' })]"
        >
          <Select
            style="width: 58%"
            v-model:value="selectTypeValue"
            @change="changeClick(selectTypeValue)"
            :options="stateTypeOptions"
            class="select-left"
          />
          <Select
            style="width: 42%"
            v-model:value="selectStatus"
            :placeholder="$t('common.chooseText')"
            :allowClear="true"
            :options="commonOptionsState"
            class="select-right"
          />
        </div>
      </template>
    </BasicTable>
    <disModal @register="registerModal" @ok-fun="okFun" @enable-success="enable" />
    <setStatusModel
      @register="registerSetStateModel"
      @success-load="enable"
      :titleicon="'notice'"
      :operationApi="operationApi"
    />
    <ImportMembers
      @register="registerImportMembers"
      @enable="enable"
      @import-success="importSuccess"
      @diamondsuccess="enable"
    />
    <excelTable @register="registerExcelTable" />
    <DamaDialog @register="registerDamaDetailModal" :titleicon="'history'" />
    <UpdateSateModal @register="registerUpdate" @success-load="enable" />
    <venuesModal @register="registerVenues" />
  </PageWrapper>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    defineComponent,
    onMounted,
    ref,
    onBeforeMount,
    watch,
    nextTick,
    onUnmounted,
  } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './inquiry.data';
  import { auths, isHasAuth } from '@/utils/authFunction';
  import {
    exportMemList,
    update_bonus,
    update_commission,
    update_rebate,
    getMemberList,
    uservEnable,
    getLevelList,
    getbalance,
    getbalanceLocker,
    updatestateMember,
    getBalanceAgency,
    getMemberReanameist,
    getMerchantNote,
  } from '/@/api/member/index';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { Select, Input, DatePicker, message, FormItem, AutoComplete } from 'ant-design-vue';
  import ReloadTooltip from '/@/views/member/common/ReloadTooltip.vue';
  import tooltipIcon from '../common/tooltipIcon.vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  //停启用弹框
  import disModal from './components/disModal.vue';
  //设置状态
  import setStatusModel from './components/setStatusModel.vue';
  //查看场馆
  import venuesModal from './components/venuesModal.vue';
  //import dayjs from 'dayjs';
  import { useMemberStore } from '/@/store/modules/member';
  // getVipLevelList
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { exportCsvFromResponse, useExportFile } from '/@/utils/helper/paramsHelper';
  import ImportMembers from '../common/Modal/ImportMembers.vue';
  import excelTable from '../common/Modal/excelTable.vue';
  //import { openConfirm } from '/@/utils/confirm';
  import { stateTypeOptions, stateOptions, stateListOptions } from '../common/const';
  import { buildUUID } from '/@/utils/uuid';
  import DamaDialog from '/@/components/DamaDialog/index.vue';
  import { RealNameTooltip } from '/@/components/RealNameTooltip/index';
  import { useDebounceFn } from '@vueuse/core';
  import UpdateSateModal from './components/updateSateModal.vue';
  import { dateGroupButtonListAll } from '../../report/comprehensiveReport/index.data';
  import { setClassWidth, tabHeight395 } from '/@/views/common/component';
  import { socketClient } from '@/utils/socket';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { useUserStore } from '/@/store/modules/user';
  import { useLocaleStoreWithOut } from '@/store/modules/locale';
  import eventBus from "@/utils/eventBus";

  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const fetching = ref(false as any);
  const datalist = ref([] as any);
  const { t } = useI18n();

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const [registerUpdate, { openModal: updateOpenModal }] = useModal();
  const [registerVenues, { openModal: openMdalVenues }] = useModal();
  export default defineComponent({
    name: 'InquiryMemberNocash',
    components: {
      ReloadTooltip,
      BasicTable,
      TableAction,
      PageWrapper,
      disModal,
      AutoComplete,
      Select,
      [Select.name]: Select,
      ASelectOption: Select.Option,
      [Input.name]: Input,
      [Input.Group.name]: Input.Group,
      tooltipIcon,
      [DatePicker.name]: DatePicker,
      ImportMembers,
      excelTable,
      setStatusModel,
      //FormItem,
      DamaDialog,
      RealNameTooltip,
      SearchOutlined,
      UpdateSateModal,
      venuesModal,
      DateButtonGroup,
    },
    emit: ['enableSuccess', 'okFun'],
    setup() {
      const scrollHeight = Number(useScrollerHeight(tabHeight395).value);
      const currentLanguage = useLocaleStoreWithOut();
      const locale = currentLanguage.getLocale;
      const fuzzyOptions = ref([]);
      const operationApi = <any>ref();
      const $router = useRouter();
      const route = useRoute();
      const { exportFile } = useExportFile();
      const { createMessage } = useMessage();
      const [registerDamaDetailModal, { openModal: openDamaDetailModal }] = useModal();
      const model = ref<FormModel>({
        start_time: null,
        end_time: null,
      });
      const realnameUidArr = ref([] as any);
      //有效会员查询
      const is_available = ref('' as string);
      const levelId = ref(null as any);
      const setBalanceObj = ref({} as any);
      const disabledStartDate = (date) => {
        if (!model.value.end_time || !date) return false;
        return date.valueOf() > model.value.end_time.valueOf();
      };

      const disabledEndDate = (date) => {
        if (!model.value.start_time || !date) return false;
        return date.valueOf() < model.value.start_time.valueOf();
      };
      async function changeButtonDay(value) {
        //
        nextTick(async () => {
          // await getForm().setFieldsValue({ time: [value[0], value[1]] });
          // reload();
        });
      }
      const onStartDateChange = (value) => {
        model.value.start_time = value;
      };
      const onEndDateChange = (value) => {
        model.value.end_time = value;
      };
      const isReload = ref(false);
      const levelList = ref<any>([]);
      const memberStore = useMemberStore();
      // 获取VIP等级下拉
      memberStore.getVipLevelList();
      const commonOptionsState = ref(stateOptions as any);
      // 获取层级下拉
      memberStore.getLevelList();
      const selectTypeValue = ref('state' as any);
      const selectStatus = ref('' as any);
      const realnameFilterList = ref([] as any);
      const sortKey = ref('' as any);
      const sortType = ref('' as any);
      const exportParam = ref(null as any);

      const [registerTable, { getForm, reload, getColumns, setColumns, updateTableDataRecord }] =
        useTable({
          //title: '会员查询',
          api: getData,
          columns,
          formConfig: {
            schemas: searchFormSchema,
            actionColOptions: {
              class: 't-form-label-com ',
              span: 1,
            },
            showSubmitButton: false,
            showActionButtonGroup: false,
            showResetButton: false, //关闭导入功能
            resetButtonOptions: {
              text: t('business.common_import'),
            },
            resetFunc: ImportMembersFunc,
          },
          useSearchForm: true,
          //showTableSetting: true,
          bordered: true,
          showIndexColumn: false,
          beforeFetch: async (param) => {
            // param.start_time = param.start_time ? setStartformatDate(param.start_time) : null;
            // param.end_time = param.end_time ? setEndformatDate(param.end_time) : null;
            const { validate } = await getForm();
            const values = await validate();
            // param['start_time'] = setStartformatDate(values.time[0]);
            // param['end_time'] = setEndformatDate(values.time[1]);
            const condValues = values;
            delete values.fuzzy;
            if (values.created_at) {
              values['created_at'] = [
                setStartformatDate(values.created_at[0]),
                setEndformatDate(values.created_at[1]),
              ].join();
            }
            if (currentType.value == 'realname') {
              // if(realnameUidArr.value.length===0) {
              // 	return message.error('会员姓名不存在')
              // }
              if (realnameUidArr.value.length) {
                condValues[currentType.value] = realnameUidArr.value
                  ? realnameUidArr.value.join(',')
                  : '';
              } else {
                condValues[currentType.value] = fromSearch.value;
              }
            } else {
              condValues[currentType.value] = fromSearch.value ? fromSearch.value : '';
            }
            if (!condValues.sid) delete condValues.sid;
            delete condValues.start_time;
            delete condValues.end_time;
            delete param.start_time;
            delete param.end_time;
            delete param.state;
            delete param.search;
            delete param.importField;
            delete param.changeState;
            condValues['timezone'] = userStore.defaultTimezone;
            param['cond'] = condValues;
            if (selectStatus.value && selectTypeValue.value) {
              condValues[selectTypeValue.value] = String(selectStatus.value);
            }
            if (selectStatus.value === '3') {
              condValues['online'] = '2';
              delete condValues['state'];
            } else if (selectStatus.value === '4') {
              condValues['online'] = '1';
              delete condValues['state'];
            }
            if (is_available.value) {
              condValues['is_available'] = is_available.value;
            } else {
              delete condValues['is_available'];
            }
            for (var key in condValues) {
              delete param[key];
            }
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
            // for (let key in condValues) {
            //   if (condValues.hasOwnProperty(key) && condValues[key] === '') {
            //     delete condValues[key];
            //   }
            // }
            if (isReload.value) {
              param = {
                page: param.page,
                rows: param.rows,
              };
              isReload.value = false;
            }
            param.order = sortKey.value || 1;
            param.method = sortType.value || 'desc';
            exportParam.value = param;
            return param;
          },
          sortFn: (sortInfo) => {
            //升序和降序
            const { field, order } = sortInfo;
            sortKey.value = field == 'MemberBalance' ? 2 : field == 'MemberCommissionData' ? 3 : 1;
            sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
          },
        });
      const [registerModal, { openModal }] = useModal();
      const [registerSetStateModel, { openModal: openSetState }] = useModal();
      const [registerImportMembers, { openModal: openImportMembers }] = useModal();
      const [registerExcelTable, { openModal: openExcelTable }] = useModal();

      //定义当前选中的框
      const currentType = ref('username' as any);
      //输入当前的值
      const fromSearch = ref(null as string);

      // 监听currentType变化并更新表单
      watch(currentType, (newVal) => {
        if (getForm()) {
          getForm().setFieldsValue({ currentType: newVal });
        }
      });

      onMounted(async () => {
        const response = await getLevelList({ page: 1, page_size: 25 });
        levelList.value = response.d;
        nextTick(async () => {
          if (route.query.vip) {
            await getForm().setFieldsValue({ vip: route.query.vip });
          }
          if (route.query.level) {
            await getForm().setFieldsValue({ level_id: route.query.level });
            is_available.value = route.query.is_available;
          } else {
            await getForm().setFieldsValue({
              vip: route.query.vipLevel ? route.query.vipLevel : '',
            });
            is_available.value = route.query.is_available;
          }
          // 将currentType传递给表单
          await getForm().setFieldsValue({ currentType: currentType.value });
          enable();
        });
      });
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
      function changeClick(val: string) {
        if (val === 'state') {
          commonOptionsState.value = stateOptions;
        } else {
          commonOptionsState.value = stateListOptions;
        }
      }
      function handleExportIn() {
        openImportMembers(true, 'data');
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
          setBalanceList(
            item,
            'balance',
            t('table.member.member_wallet_balance'),
            item._balanceList,
          );
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

      async function getData(params) {
        // 获取会员层级

        const data = await getMemberList(params);
        data.d.forEach((item) => {
          setBalance(item);
        });

        return data;
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
          name: 'DetailsMember',
          state: { id: record.uid, username: record.username, realname: name1 },
        });
        sessionStorage.setItem(
          'DetailsMember_state',
          JSON.stringify({
            path: '/member/inquiryMember',
            id: record.uid,
            username: record.username,
            realname: name1,
          }),
        );
        sessionStorage.setItem('inquiryMember_activeKey', '1');
      }
      // 编辑跳转
      function editFun(record) {
        let name = '';
        if (record.realname.first) {
          name = setName(setRealName(record.realname));
        } else {
          name = '';
        }
        $router.push({
          name: 'EditMember',
          state: { id: record.uid, realname: name },
        });
      }

      async function ImportMembersFunc() {
        openImportMembers(true, {});
      }
      watch(
        () => userStore.dynamicMqtt,
        async (newVal) => {
          if (newVal[0] && !userStore.dynamicBoo) {
            await exportMemList(exportParam.value);
            userStore.dynamicBoo = true;
          }
        },
        { deep: true }
      );
      async function handleExportTableList() {
        try {
          if (userStore.dynamicBoo) {
            return createMessage.error(t('common.feedbacktext10'));
          }
          await reload();
          userStore.dynamicStr = String(new Date().getTime());
          exportParam.value['topic_id'] = String(userStore.dynamicStr);
          exportParam.value['uid'] = buildUUID();
          socketClient.addSubscribe(`${info['prefix']}/${userStore.dynamicStr}`); // 导出订阅
        } catch (e) {
          console.error(e);
        }
      }

      onUnmounted(() => {
        socketClient.removeSubscribe(`${info['prefix']}/${userStore.dynamicStr}`); // 移除导出订阅
      });

      async function okFun(values) {
        //const values = await validate();
        const { stateType, uid, state, remarks } = values;
        if (stateType == 'member') {
          let params = {
            uid: uid,
            record: {
              bonus_note: remarks,
              state: (state == 1 ? 2 : 1).toString(),
            },
          };
          const { status, data } = await uservEnable(params);
          status === true && values ? message.success('data') : message.error(data);
        }
      }

      function disabledFun(data) {
        openSetState(true, data);
        // const name = data.state == 1 ? '您确定停用该会员状态吗？' : '您确定启用该会员状态吗？';
        // const placeholder = data.state == 1 ? '请输入停用原因' : '请输入启用原因';
        // const type = data.state == 1 ? 'stop' : 'open';
        // openModal(true, {
        //   name: name,
        //   placeholder: placeholder,
        //   data,
        //   type: type,
        //   isUpdate: true,
        //   stateType: 'member',
        // });
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

      // 停启用按钮
      async function disableStatus(data) {
        const { status, data: result } = await getMerchantNote({
          uid: data.uid,
          type: '1',
        });
        if (status) data.note = result.note;
        operationApi.value = updatestateMember;
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
          updateTableDataRecord(data.uid, data);
          //enable();
        } else {
          createMessage.error(t('table.member.member_balance_fail'));
        }
      }
      //优惠状态
      async function disableDiscount(data) {
        const { status, data: result } = await getMerchantNote({
          uid: data.uid,
          type: '2',
        });
        if (status) data.note = result.note;
        operationApi.value = update_bonus;
        const text =
          data.bonus_state === 1
            ? t('business.common_deactivate')
            : t('business.common_on_activate');
        openSetState(true, {
          data: data,
          titlePreIcon: 'question',
          title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${t(
            'table.member.member_this_discount',
          )}`,
          handle: 'bonus_state',
        });
      }
      //佣金状态
      async function disabledCommission(data) {
        const { status, data: result } = await getMerchantNote({
          uid: data.uid,
          type: '3',
        });
        if (status) data.note = result.note;
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
        const { status, data: result } = await getMerchantNote({
          uid: data.uid,
          type: '4',
        });
        if (status) data.note = result.note;
        operationApi.value = update_rebate;
        const text =
          data.rebate_state === 1
            ? t('business.common_deactivate')
            : t('business.common_on_activate');
        openSetState(true, {
          data: data,
          titlePreIcon: 'question',
          title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${t(
            'table.member.member_this_walter',
          )}`,
          handle: 'rebate_state',
        });
      }
      function hadnleRealodAmount(record) {
        enable();
      }

      function enable() {
        reload();
      }
      function submitFun() {
        is_available.value = '';
        reload();
      }
      function importSuccess(data) {
        openExcelTable(true, data);
      }

      const getOSContitle = (os, userAlive) => {
        const osTitles = {
          Android: 'Android',
          iOS: 'IOS',
          H5: 'H5',
        };

        const statusTitles = {
          1: t('business.common_active'),
          0: t('business.common_offline'),
        };
        const osTitle = osTitles[os] || t('common.unknow');
        const statusTitle = statusTitles[userAlive] || t('common.unknow');

        return `${osTitle}${statusTitle}`;
      };
      function setName(value) {
        const _list = value.filter((item) => {
          return item.label == 'first';
        });
        const _value = value.filter((item) => {
          return item.label === _list[0].value;
        });
        return _value[0].value;
      }

      const handleSearch = useDebounceFn(async (value) => {
        // 确保输入长度至少为3个字符
        if (!value || value.length < 2) {
          datalist.value = []; // 清空现有数据列表（可选）
          return false;
        }
        fetching.value = true;
        if (value.length >= 2) {
          try {
            const data = await getMemberReanameist({ topic: currentType.value, username: value });
            if (currentType.value === 'realname') {
              realnameFilterList.value = repeatFilter(data);
              datalist.value = data;
            } else {
              datalist.value = data;
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            datalist.value = []; // 出错时清空数据列表
          } finally {
            fetching.value = false;
          }
        }
      }, 500);
      const mockVal = (str: string, repeat = 1) => {
        return {
          value: str.repeat(repeat),
        };
      };
      async function handleFuzzySearch(searchText) {
        const { fuzzy } = await getForm().getFieldsValue();
        if (fuzzy) {
          const { data } = await getMemberList({
            cond: { username: fromSearch.value, fuzzy: 1, timezone: userStore.defaultTimezone },
            page: 1,
            page_size: 25,
          });
        }
      }
      function handleChangeUsername(val) {
        fromSearch.value = null;
        //handleSearch('');
      }
      function handleBeachUpdate(): Promise<void> {
        updateOpenModal(true, 'data');
        return Promise.reject();
      }
      function checkViews(record) {
        openMdalVenues(true, { data: record });
      }
      function changeSearchType(val) {
        const dataRealName = datalist.value.filter((item) => {
          return item.username === val;
        });
        const arr = [];
      }
      function repeatFilter(arr: any) {
        let arr1 = [];
        let newArr = [];
        for (const i of arr) {
          if (arr1.find((c: any) => c.username === i?.username)) {
            continue;
          }
          arr1.push(i as never);
        }
        return arr1;
      }
      async function changeSearch() {
        const data = await getMemberReanameist({
          topic: currentType.value,
          username: fromSearch.value,
        });
        const arr = [];
        data.forEach((item) => {
          arr.push(item.uid as never);
        });
        realnameUidArr.value = arr;
        // if(arr.length===0) {
        // 	fromSearch.value = '';
        // 	message.error('会员姓名不存在')
        // }
      }
      return {
        levelList,
        registerTable,
        detailsFun,
        editFun,
        disabledFun,
        registerModal,
        onMounted,
        currentType,
        fromSearch,
        enable,
        hadnleRealodAmount,
        handleExportTableList,
        getOSContitle,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        rebateFun,
        okFun,
        ImportMembers,
        registerImportMembers,
        registerExcelTable,
        importSuccess,
        registerSetStateModel,
        levelId,
        disableStatus,
        disableDiscount,
        disabledCommission,
        stateTypeOptions,
        selectTypeValue,
        selectStatus,
        stateOptions,
        changeClick,
        commonOptionsState,
        handleRealodcommissionAmount,
        registerDamaDetailModal,
        openDamaDetailModal,
        setRealName,
        setName,
        operationApi,
        isHasAuth,
        handleSearch,
        handleFuzzySearch,
        datalist,
        fuzzyOptions,
        handleChangeUsername,
        handleBeachUpdate,
        registerUpdate,
        changeSearchType,
        realnameUidArr,
        realnameFilterList,
        changeSearch,
        handleExportIn,
        auths,
        checkViews,
        venuesModal,
        registerVenues,
        getForm,
        changeButtonDay,
        dateGroupButtonListAll,
        setClassWidth,
        scrollHeight,
        locale
      };
    },
  });
</script>

<style scoped>
  @media (width < 1681px) {
    .responsive-ml {
      margin-right: 10px;
    }
  }

  .hidden {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }

  ::v-deep(.selectSearch .ant-select-selector .ant-select-selection-placeholder) {
    padding: 0 !important;
  }

  .modalText {
    font-size: 1rem;
    text-align: center;
  }

  .LayoutTable ::v-deep(.ant-input-group) {
    display: flex;
  }
</style>
<style scoped>
  /* 本页按照UI样式的修改，不放在公版  开始 */
  ::v-deep(.ant-tooltip) {
    max-width: auto !important;
  }

  ::v-deep(.ant-select-auto-complete) {
    border-right-width: 0 !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-table-wrapper td .ant-tooltip-arrow-content) {
    background-color: rgb(0 0 0 / 80%) !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-table-wrapper td .ant-tooltip-inner) {
    min-height: auto !important;
    background-color: rgb(0 0 0 / 80%) !important;
    font-size: 12px !important;
    font-weight: 500;
    line-height: 12px !important;
  }

  ::v-deep(.select-left > .ant-select-selector) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  ::v-deep(.select-right > .ant-select-selector) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  ::v-deep(.vben-basic-form--compact .ant-form-item) {
    margin-bottom: 0 !important;
  }

  :deep(td.ant-table-column-sort) {
    background: none;
  }

  /* ::v-deep(.ant-select-selector .ant-select-selection-search) {
    width: 20px;
  } */

  /* 本页按照UI样式的修改，不放在公版  结束 */

  /* 避免压缩页面以后，搜寻条件不见 */
</style>
