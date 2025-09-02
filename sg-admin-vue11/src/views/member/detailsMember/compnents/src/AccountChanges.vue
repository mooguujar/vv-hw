<template>
  <div class="AccountChanges">
    <Title :name="$t('table.member.member_account_chnages')" />
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
          :dropdownMatchSelectWidth="false"
          :options="
            [{ label: $t('business.common_all'), value: '' }].concat(
              businessTypeTreeList.filter((item) => item.value != '3000'),
            )
          "
          :placeholder="$t('common.chooseText')"
          @change="handleChange"
        />
      </template>
      <template #form-change_type="{ model, field }">
        <Select
          v-model:value="model[field]"
          allowClear
          default-value=""
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
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import { Title } from '../../compnents/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { accountColumns, accountSchemas, dateGroupButtonList } from '../../details.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { getBalanceTransaction } from '/@/api/member/index';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { Select } from 'ant-design-vue';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useLocale } from '/@/locales/useLocale';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(415).value);
  const { initBusinessType, businessTypeTreeList, businessTypeTreeListAll } = useTreeListStore();
  const changetypeOptions = ref([] as any);
  const getCurrencyList = ref([{ label: t('business.common_all'), value: '' }] as any);
  const [registerTable, { getForm, getRawDataSource, reload }] = useTable({
    api: getBalanceTransaction,
    columns: accountColumns,
    useSearchForm: true,
    bordered: true,
    formConfig: {
      schemas: accountSchemas,
      showResetButton: false,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        xxl: 4,
        xl: 5,
        lg: 5,
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
      //param['wallet_type'] = 1;
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param['time'];
      param['username'] = history.state.username;
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
      //await getForm().setFieldsValue({ end_time: value[1] });
    });
  }
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
