<template>
  <div class="AccountChanges p-5px pl-20px">
    <!-- <Title :name="$t('table.member.member_account_chnages')" /> -->
    <BasicTable
      @register="registerTable"
      class="!p-0"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-grupList
        ><DateButtonGroup
          :isSelect="isSelect"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          isEndToday
          @change-button-day="changeButtonDay"
      /></template>
      <template #form-business_type="{ model, field }">
        <Select
          allowClear
          v-model:value="model[field]"
          default-value=""
          :options="[{ label: $t('business.common_all'), value: '' }].concat(businessTypeTreeList)"
          :placeholder="$t('common.chooseText')"
          @change="handleChange"
        />
      </template>
      <template #form-change_type="{ model, field }">
        <Select
          v-model:value="model[field]"
          allowClear
          default-value=""
          :dropdownMatchSelectWidth="false"
          :options="changetypeOptions"
          :placeholder="$t('common.chooseText')"
        />
      </template>
      <template #form-currency="{ model, field }">
        <Select
          v-model:value="model[field]"
          :options="getCurrencyList"
          :placeholder="$t('common.chooseText')"
        />
      </template>
      <template #remark="{ record }">
        <div>
          <!-- <p>{{ record.platform_id }}</p> -->
          {{ record.remark }}
        </div>
      </template>
      <template #form-custom>
        <InputGroup compact style="display: flex">
          <p class="text-center w-93px leading-38px">
            {{ $t('business.common_member_account') + ':' }}
          </p>
          <Input
            class="pay-input mr-2.5"
            allowClear
            :placeholder="`${$t('table.member.member_inquiry_input')}`"
            v-model:value="fromSearch"
            @blur="fromSearch = $event.target.value.trim()"
          />
        </InputGroup>
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts" name="AccountChangesNocash">
  import { ref, nextTick, onMounted, onBeforeMount } from 'vue';
  import { Input, Select, InputGroup } from 'ant-design-vue';

  import { BasicTable, useTable } from '/@/components/Table';
  import { accountColumns, accountSchemas, dateGroupButtonList } from './details.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { getBalanceTransaction_copy } from '/@/api/member/index';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useLocale } from '/@/locales/useLocale';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(285).value);
  const { initBusinessType, businessTypeTreeList, businessTypeTreeListAll } = useTreeListStore();
  const fromSearch = ref('');
  const changetypeOptions = ref([] as any);
  const getCurrencyList = ref([{ label: t('business.common_all'), value: '' }] as any);
  const columns_ = accountColumns.filter((item) => item.dataIndex != 'business_type_name');
  const [registerTable, { getForm, getRawDataSource, reload }] = useTable({
    api: getBalanceTransaction_copy,
    canColDrag: true,
    columns: columns_,
    useSearchForm: true,
    bordered: true,
    formConfig: {
      schemas: accountSchemas,
      showResetButton: false,
      showAdvancedButton: false,
      // showActionButtonGroup:false,
      actionColOptions: {
        class: 't-form-col t-form-label-com w-150px',
        // xxl: 4,
        // xl: 5,
        // lg: 5,
      },
    },
    afterFetch: () => {
      const getCurrency = getRawDataSource();
      const list = getCurrency.n.map((item) => {
        return {
          label: currentyOptions[item],
          value: String(item),
        };
      });
      getCurrencyList.value = [{ label: t('business.common_all'), value: '' }, ...list];
    },
    showIndexColumn: false,
    beforeFetch: (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      if (param['platform_id'] == '0') param['platform_id'] = '';
      delete param['time'];
      param['business_type'] = '3000';
      param['game_type'] = '';
    },
  });
  const unixRang = ref<Array<number>>([]);
  const isSelect = ref('days' as any);
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  onBeforeMount(async () => {
    await initBusinessType().then(() => {
      handleChange('3000');
    });
  });
  async function handleChange(e) {
    const { getLocale } = useLocale();
    const selectLang = getLocale.value || 'zh_CN';
    let typeArray = [];
    if (e === '837') {
      typeArray = businessTypeTreeListAll.filter((item) => {
        return item.pid === e && item.attr === '3';
      });
    } else {
      typeArray = businessTypeTreeListAll.filter((item) => {
        return item.pid === e && item.attr === '1';
      });
    }
    const newTypeArray = typeArray.map((item: any) => {
      if (typeof item.name === 'string') {
        item.name = JSON.parse(item.name); // 解析字符串
      }
      return { label: item.name[selectLang], value: item.id };
    });
    newTypeArray.unshift({ label: t('business.common_all'), value: '' });
    await getForm().setFieldsValue({ cash_type: '' });
    changetypeOptions.value = newTypeArray;
  }

  function removeSearchBtnRight() {
    for (var i = 0; i < document.getElementsByClassName('ant-btn').length; i++) {
      var isSearchBtn = document
        .getElementsByClassName('ant-btn')
        [i].parentNode.classList.contains('ant-form-item-control-input-content');
      if (isSearchBtn) {
        document.getElementsByClassName('ant-btn')[i].parentNode.style.textAlign = 'left';
      }
    }
  }
  onMounted(() => {
    //调整搜寻按钮前面因为text-align:right产生的空位
    removeSearchBtnRight();
  });
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding: 10px 0 0 !important;
  }
</style>
