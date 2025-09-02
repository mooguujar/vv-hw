<template>
  <BasicTable
    @register="registerTable"
    class="summy"
    :class="[currentList.length < 3 ? 'hid-btn' : '']"
    :scroll="{ y: scrollHeight }"
  >
    <template #form-usernameSlot>
      <a-input-group style="display: flex; width: 350px">
        <Select :dropdownMatchSelectWidth="false" v-model:value="userType">
          <!--兑换码-->
          <SelectOption value="code">
            {{ $t('common.redeemCode') }}
          </SelectOption>
          <!--领取会员-->
          <SelectOption value="username">
            {{ $t('common.get_membership') }}
          </SelectOption>
          <!--操作人员-->
          <SelectOption value="updated_name">
            {{ $t('table.risk.report_operate_people') }}
          </SelectOption>
        </Select>
        <Input
          class="mr-5"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>
    <template #form-commissionSummary>
      <DateButtonGroup
        :isSelect="isSelect"
        isEndToday
        @change="changeBtn"
        :dateGroupButtonList="dateGroupButtonList"
        @change-button-day="changeButtonDay"
      />
    </template>
    <template #tableTitle>
      <div class="w-full">
        <cdButtonCurrency
          :btn-list="currentList"
          @change-button-currency="changeClick"
          v-model="currency_id"
        />
      </div>
    </template>
    <template #currency_id="{ record }">
      <div v-if="record.currency_id">
        {{ record.currency_id }}
        <cdIconCurrency :icon="record.currency_id" class="w-20px ml-5px" />
      </div>
    </template>
    <template #code="{ record }">
      <Button @click="linkDetails(record, '', '')" type="link" v-if="getCode(1, record.code)">
        {{ getCode(1, record.code) }}
      </Button>
      <span v-else>{{ getCode(1, record.code) }}</span>
    </template>
    <template #codeNum="{ record }">
      <Button @click="linkDetails(record, '2', '')" type="link" v-if="getCode(2, record.code)">
        {{ getCode(2, record.code) }}
      </Button>
      <span v-else>{{ getCode(2, record.code) }}</span>
    </template>
    <template #codeExpiredNum="{ record }">
      <Button
        @click="linkDetails(record, '1', '')"
        type="link"
        v-if="getCode(1, record.code) - getCode(2, record.code)"
      >
        {{ getCode(1, record.code) - getCode(2, record.code) }}
      </Button>
      <span v-else>0</span>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup name="codeExpired">
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { Button, Input, Select, SelectOption } from 'ant-design-vue';
  import { getExchangeCodeList, getExchangeCurrency } from '@/api/activity';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { currentyOptions } from '@/settings/commonSetting';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  // const props = defineProps({
  //   currencyList: {
  //     type: Array,
  //     default: () => [],
  //   },
  // });

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(500).value);
  dateGroupButtonList[0].label = t('table.member.member_today'); //今日
  dateGroupButtonList[1].label = t('modalForm.common.yesterday'); //昨日
  dateGroupButtonList[2].label = t('table.member.member_week'); //本周
  dateGroupButtonList[3].label = t('table.member.member_month'); //本月
  const userType = ref('code' as string);
  const fromSearch = ref('' as any);
  const ifData = ref(true as boolean);
  const numFrequency = ref(0 as number); // 进入页面会多次请求接口
  const currency_id = ref('' as string);
  const isSelect = ref('' as string);
  const dataCurrency = ref([] as any);
  const router = useRouter();
  const { currencyTreeList } = useTreeListStore();

  // 跳转二级页面
  const { setDetailCodeExchange, setOnePageList, getOnePageList } = useUserStore();
  const currentList = ref([{ name: t('business.common_all'), value: '', lable: 'ALL' }] as any);
  const [registerTable, { reload, getForm, getColumns, getRawDataSource }] = useTable({
    // api: getExchangeCodeList,
    api: async (params) => {
      const { page, page_size, currency_id, ...paramsCopy } = params;
      let res = await getExchangeCurrency(paramsCopy);
      if (!Array.isArray(res)) {
        res = []; // 或者取决于业务逻辑，设置为其他默认值
      }
      // res = currencyTreeList.filter((item) => res.includes(item.name));
      if (res && res.length > 0) {
        const list = res?.map((item) => {
          return {
            name: item,
            value: item,
            label: item,
          };
        });
        currentList.value = [{ name: t('business.common_all'), value: '', lable: 'ALL' }, ...list];
      } else {
        currentList.value = [];
      }
      if (go1.value) {
        params.page = 1;
        go1.value = false;
      }
      const data = await getExchangeCodeList(params);
      return data;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      schemas: searchForm,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com action-btn-box',
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
    },
    beforeFetch: (param) => {
      if ((userType.value === 'code' || userType.value === 'username') && fromSearch.value) {
        let obj = {
          id: param.id,
          userType: userType.value,
          fromSearch: fromSearch.value,
        };
        setDetailCodeExchange({ state: { ...obj, num: '', time: '' } });
        setParamas();
        // router.push({ name: 'CodeDetails', state: { ...obj, num: '', time: '' } });
      }

      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }

      /**
       * 二级页面回一级页面数据回填；
       * */
      if (getOnePageList?.hid && ifData.value) {
        ifData.value = false;
        param.start_time = getOnePageList.ti[0];
        param.end_time = getOnePageList.ti[1];
        getForm().setFieldsValue({ time: [param.start_time, param.end_time] });
        isSelect.value = getOnePageList.sta;
        if (getOnePageList?.uname) {
          userType.value = 'updated_name';
          fromSearch.value = getOnePageList.uname;
        }
      }

      delete param.time;
      param['currency_id'] = currency_id.value ? currency_id.value : '';
      if (fromSearch.value) {
        param[userType.value] = fromSearch.value;
      }
      return param;
    },
    afterFetch: async () => {
      const data = await getRawDataSource();
      dataCurrency.value = data.d;
      // currentList.value = [
      //   { name: t('business.common_all'), value: '', lable: 'ALL' },
      //   ...props.currencyList,
      // ].concat(currencyTreeList.filter((item) => dataCurrency.value.includes(item.id)));
    },
  });
  const go1 = ref(false as boolean); // 回到第一页
  function changeClick(v) {
    go1.value = true;
    reload();
    currency_id.value = v;
  }

  const isTimeArr = ref([]);

  function changeBtn(e) {
    isSelect.value = e.target.value;
    getForm().setFieldsValue({ time: [isTimeArr.value[0], isTimeArr.value[1]] });
    reload();
  }

  function changeButtonDay(value) {
    isTimeArr.value = value;
    if (ifData.value) {
      getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    }
  }

  function linkDetails(record, num, time) {
    setDetailCodeExchange({ state: { id: record.id, num, time } });
    // 从表格来
    setParamas('y');
    // router.push({ name: 'CodeDetails', state: { id: record.id, num, time } });
  }

  function setParamas(str: string) {
    let values = getForm().getFieldsValue();
    let obj = { sta: isSelect.value, ti: values.time, fromTableBtn: str || '' };
    if (userType.value === 'updated_name') {
      obj.uname = fromSearch.value;
    }
    setOnePageList(obj);
  }

  // 操作按钮显示逻辑
  function getCode(v: number, code: string) {
    let num = 0;
    switch (v) {
      case 1:
        num = Object.keys(JSON.parse(code)).length;
        break;
      case 2:
        num = Object.values(JSON.parse(code)).filter(Boolean).length;
        break;
    }
    return num;
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

  .hid-btn {
    ::v-deep(.ant-table-title) {
      display: none !important;
    }
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }
</style>
