<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerRecord" class="!p-0" :scroll="{ y: scrollHeight }">
      <template #form-createIp>
        <div class="mr-2">
          <!-- <Button type="primary" class="mr-2" @click="back">{{ t('common.back') }}</Button> -->
          <BasicButton type="primary" :iconSize="20" @click="back" preIcon="RectBack:svg">
            {{ t('common.back') }}
          </BasicButton>
        </div>
      </template>
      <template #form-commissionSummary>
        <DateButtonGroup
          v-if="showBtns()"
          :isSelect="isSelect"
          isEndToday
          @change-button-day="changeButtonDay"
          @change="changeBtn"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
      <template #form-usernameSlot>
        <a-input-group style="display: flex; width: 350px">
          <Select :dropdownMatchSelectWidth="false" v-model:value="userType">
            <!--兑换码-->
            <SelectOption value="code">
              {{ t('common.redeemCode') }}
            </SelectOption>
            <!--领取会员-->
            <SelectOption value="username">
              {{ t('common.get_membership') }}
            </SelectOption>
          </Select>
          <Input
            class="mr-5"
            allowClear
            :placeholder="t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #currency_id="{ record }">
        <div v-if="record.currency_id">
          {{ record.currency_id }}
          <cdIconCurrency :icon="record.currency_id" class="w-20px ml-5px" />
        </div>
      </template>
      <template #deposit_amount="{ record }">
        <div v-if="record.uid && record.uid !== '0'">
          {{ record.deposit_amount }}
        </div>
        <div v-else>-</div>
      </template>
      <template #withdraw_amount="{ record }">
        <div v-if="record.uid && record.uid !== '0'">
          {{ record.withdraw_amount }}
        </div>
        <div v-else>-</div>
      </template>
      <template #form-state="{ model, field }">
        <Select
          v-model:value="state"
          allowClear
          :dropdownMatchSelectWidth="false"
          :options="changetypeOptions"
          @change="changeState"
          :placeholder="t('business.common_all')"
        />
      </template>
      <template #bet="{ record }">
        <Tooltip v-if="record.bet?.length">
          <template #title>
            <div class="code-tooltip">
              <div class="code-tooltip-header">
                <span>{{ t('table.report.report_platform_name') }}</span>
                <span>{{ t('table.report.report_valid_bet_amount') }}</span>
              </div>
              <ul>
                <li v-for="(val, ind) in record.bet" :key="ind">
                  <div>{{ val.platform_name }}</div>
                  <div class="whitespace-nowrap">{{ val.valid_bet_amount }}</div>
                </li>
              </ul>
            </div>
          </template>
          <span>{{ setRealName(record.bet, record.currency_id) }}</span>
        </Tooltip>
        <div v-else>-</div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup name="exchangeCodeDetails">
  import { ref, computed } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchForm } from './index.data.ts';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { exportExchangeCode, getExchangeCode } from '@/api/activity';
  import { useRouter } from 'vue-router';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Select, Input, SelectOption, Button, Tooltip } from 'ant-design-vue';
  import { dateGroupButtonList } from '@/views/discountActivity/redeemCode/exchangeCode/index.data';
  import { DateButtonGroup } from '@/components/DateButtonGroup';
  import { setEndformatDate, setStartformatDate } from '@/utils/dateUtil';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { useUserStore } from '@/store/modules/user';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight.js';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(350).value);
  dateGroupButtonList[0].label = t('table.member.member_today'); //今日
  dateGroupButtonList[1].label = t('modalForm.common.yesterday'); //昨日
  dateGroupButtonList[2].label = t('table.member.member_week'); //本周
  dateGroupButtonList[3].label = t('table.member.member_month'); //本月
  const userType = ref('code' as string);
  const isSelect = ref('month' as string);
  const state = ref('1');
  const isState = ref(false); // 默认未选择
  const isQuery = ref(false); // 查询过
  const isTime = ref(false); // 时间快选 默认未选择
  const ifData = ref(true); // 一级页面携带参数
  const isData = ref(true); // 一级页面携带参数
  const isTimeArr = ref([]);
  const changetypeOptions = [
    {
      key: t('table.member.member_money_all1'),
      value: '',
      label: t('table.member.member_money_all1'),
    },
    {
      label: t('common.code_not_used'),
      value: '1',
      key: t('common.code_not_used'),
    },
    {
      label: t('common.code_used'),
      value: '2',
      key: t('common.code_used'),
    },
  ];
  const { exportFile } = useExportFile();
  const fromSearch = ref('' as any);
  const store = useUserStore();
  const {
    setDetailExchangeCode,
    setDetailCodeExchange,
    setOnePageData,
    setOnePageList,
    getDetailExchangeCode,
    getDetailCodeExchange,
    getOnePageData,
    getOnePageList,
  } = useUserStore();
  const currencyList2 = computed(() => store.currencyList2);
  const [registerRecord, { getForm, reload, getColumns, setColumns, getPaginationRef }] = useTable({
    api: getExchangeCode,
    columns,
    formConfig: {
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com action-btn-box',
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showResetButton: isHasAuth('41107'),
      resetFunc: handleExportTableList,
    },
    bordered: true,
    showIndexColumn: false,
    useSearchForm: true,
    beforeFetch: (param) => {
      /**
       * 验证码、领取会员 跳转2级页面走这里；
       * */
      if (hist.state.userType) {
        selectFromSearch(hist.state.userType, hist.state.fromSearch);
      }

      /**
       * 跳转2级页面后清空时间；
       * */
      if (!hist.state.time) {
        getForm().setFieldsValue({ time: ['', ''] });
        param.start_time = '';
        param.end_time = '';
        if (!Object.keys(getOnePageData).length && !Object.keys(getOnePageList).length) {
          isSelect.value = '';
        }
      }

      /**
       * 时间快选：默认未选择；
       * */
      if (isTime.value) {
        param.start_time = isTimeArr.value[0] ? setStartformatDate(isTimeArr.value[0]) : null;
        param.end_time = isTimeArr.value[1] ? setEndformatDate(isTimeArr.value[1]) : null;
      }

      /**
       * 未查询过：设置状态；
       * 查询过：
       * */
      if (!isQuery.value) {
        getForm().setFieldsValue({ state: hist.state.num || '' });
        state.value = isState.value ? state.value : hist.state.num;
      } else {
        let values = getForm().getFieldsValue();
        state.value = values?.state;
        getForm().setFieldsValue({ state: values?.state || '' });
        if (state.value === '1') {
          param.start_time = '';
          param.end_time = '';
        } else {
          if (param.time) {
            param.start_time = param.time[0] || null;
            param.end_time = param.time[1] || null;
            getForm().setFieldsValue({ time: [param.start_time, param.end_time] });
          } else {
            param.start_time = null;
            param.end_time = null;
          }
        }
      }

      /**
       * 一级页面携带参数；
       * fromTableBtn: 从表格来
       * */
      if (Object.keys(getOnePageData).length && !getOnePageData?.fromTableBtn && ifData.value) {
        ifData.value = false;
        getForm().setFieldsValue({ time: [getOnePageData.ti[0], getOnePageData.ti[1]] });
        isSelect.value = getOnePageData.sta;
      }
      if (Object.keys(getOnePageList).length && !getOnePageList?.fromTableBtn && isData.value) {
        isData.value = false;
        getForm().setFieldsValue({ time: [getOnePageList.ti[0], getOnePageList.ti[1]] });
        isSelect.value = getOnePageList.sta;
      }
      if (
        (getOnePageData?.fromTableBtn && ifData.value) ||
        (getOnePageList?.fromTableBtn && isData.value)
      ) {
        isSelect.value = '';
      }

      delete param.time;
      param['id'] = hist.state.id;
      param['expire'] = Object.keys(getDetailExchangeCode).length ? 1 : 2;
      param.state = state.value;
      if (fromSearch.value) {
        param[userType.value] = fromSearch.value;
      }
      isQuery.value = true;
    },
  });

  const router = useRouter();
  const hist = Object.keys(getDetailExchangeCode).length
    ? getDetailExchangeCode
    : getDetailCodeExchange;
  const back = async (record) => {
    // router.go(-1);
    setDetailExchangeCode({});
    setDetailCodeExchange({});
    if (Object.keys(getOnePageData).length) {
      setOnePageData({
        sta: getOnePageData.sta || '',
        ti: getOnePageData.ti || '',
        uname: getOnePageData.uname || '',
        show: true,
      });
    }
    if (Object.keys(getOnePageList).length) {
      setOnePageList({
        sta: getOnePageList.sta || '',
        ti: getOnePageList.ti || '',
        uname: getOnePageList.uname || '',
        hid: true,
      });
    }
  };
  const changeState = async (record) => {
    state.value = record;
    isState.value = true;
  };

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const data = await getPaginationRef();
      const param = await validate();
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      if (fromSearch.value) {
        param[userType.value] = fromSearch.value;
      }
      param['id'] = hist.state.id;
      param['state'] = state.value;
      param['expire'] = Object.keys(getDetailExchangeCode).length ? 1 : 2;
      await exportFile(exportExchangeCode, param, t('common.export_exchange_code'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }

  function selectFromSearch(val: string, str: string) {
    hist.state.userType = '';
    userType.value = val;
    fromSearch.value = str;
    reload();
  }

  function showBtns() {
    let values = getForm().getFieldsValue();
    return values?.state !== '1';
  }

  function changeBtn() {
    getForm().setFieldsValue({ state: '2' });
    if (!hist.state.time) {
      isTime.value = true;
      changeButtonDay(isTimeArr.value);
    }
  }

  function changeButtonDay(value) {
    isTimeArr.value = value;
    setTimeout(async () => {
      if (hist.state.time || isTime.value) {
        await getForm().setFieldsValue({ time: [value[0], value[1]] });
        await reload();
      }
    }, 1000);
  }

  function setRealName(val, id) {
    let sum = val.reduce((acc, cur) => +acc + +cur.valid_bet_amount, 0);
    return sum.toFixed(2);
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col) {
    &.action-btn-box > div {
      position: relative;
      width: auto !important;
      float: left;

      div {
        position: relative;
        float: left;

        button {
          position: relative;
          float: left;
        }
      }
    }
  }

  ::v-deep(.time-type-sty) {
    .ant-select-selector {
      display: inline-block;
      width: 180px;
      height: 40px;
      line-height: 40px;
    }

    .ant-picker-input > input:focus,
    .ant-picker-input > input-focused,
    .ant-picker,
    .ant-input,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:hover {
      border: 0 !important;
      box-shadow: none !important;
    }
  }

  .code-tooltip {
    min-width: 200px;

    .code-tooltip-header {
      display: flex;
      justify-content: center;
      height: 26px;
      border-bottom: 1px solid #eee;
    }

    span {
      display: inline-block;
      width: 50%;
      height: 26px;
      text-align: center;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 26px;

      div {
        width: 50%;
        height: 100%;
        text-align: center;
      }

      div:last-child {
        border-left: 1px solid #eee;
      }
    }
  }

  .ma-t {
    margin-top: -10px;
  }
</style>
<style lang="less">
  .ant-tooltip-inner {
    //padding: 0 !important;
  }

  .action-btn-box.ant-col-4 {
    flex: 0 1 auto !important;
  }
</style>
