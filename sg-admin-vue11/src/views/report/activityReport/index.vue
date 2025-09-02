<template>
  <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
    <BasicTable
      @register="registerTable"
      class="discount__report__class"
      :columns="calcColumnsTitle"
      :scroll="{ x: true, y: scrollHeight }"
    >
      <template #form-dateGroup>
        <div class="mr-2">
          <DateButtonGroup
            :isSelect="isSelect"
            @change-button-day="changeButtonDay"
            :dateGroupButtonList="dateGroupButtonList"
          />
        </div>
      </template>
      <template #form-functionButton>
        <Button class="mr-2" type="primary" @click="getForm().submit()">{{
          t('common.queryText')
        }}</Button>
        <Button
          class="discount__report__class--export"
          v-if="isHasAuth('51001')"
          @click="handleExportTableList"
          >{{ t('business.common_export') }}</Button
        >
      </template>
      <template #form-iconGroup>
        <cdButtonCurrency
          :btn-list="currentList"
          :innerClass="['h-14', '!mr-0', '!my-0']"
          :showwhitebg="true"
          v-model="currency_id"
          @change-button-currency="changeCurrencyId"
        />
      </template>
      <template #form-titleGroup>
        <div class="flex mt-4 whitespace-nowrap">
          <!-- 原先有个px-5，先去掉 -->
          <div
            v-for="(item, index) in btnList"
            :key="index"
            class="flex flex-col justify-between px-2 py-2 mr-2 text-center bg-white rounded shrink-0 min-w-24 h-13"
            @click="chooseCurrentBlock(index)"
            :class="[
              selected.includes(index) ? 'title__selected' : '',
              loading ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
          >
            <div class="text-xs leading-4">{{ item?.amount }}</div>
            <div class="text-xs leading-4">{{ item?.Name }}</div>
          </div>
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="ActivityReportNocash">
  import { ref, h, reactive, computed, watch, onMounted } from 'vue';
  import { message, Button } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  // import { Button } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import { searchForm, dateGroupButtonList } from './index.data';
  import { useRouter, useRoute } from 'vue-router';

  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';

  import { fetchReportActivity, exportReportActivityExport } from '/@/api/select';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { DateButtonGroup } from '/@/components/DateButtonGroup';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import dayjs from 'dayjs';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(500).value);
  const router = useRouter();
  const route = useRoute();

  const { exportFile } = useExportFile();
  const { currencyTreeList } = useTreeListStore();

  const isSelect = ref('month' as string);
  const currentList = ref([] as any);
  const currency_id = ref('');
  const loading = ref(false);
  const btnList = ref([] as any);
  const timeList = reactive({
    start_time: '',
    end_time: '',
  });
  const isQueryDate = ref(false);
  const isChange = ref(false);
  // new Set管理状态
  const setSelected = new Set();
  const selected = ref([] as any);
  const notChangeState = ref([]);
  const temporaryStorage = ref([]);

  const [registerTable, { reload, getForm }] = useTable({
    api: initEveryList,

    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      actionColOptions: {
        class: 'inquireButtonBox t-form-label-com',
      },
      showActionButtonGroup: false,
    },
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    showTableSetting: false,
    pagination: false,
    immediate: false,

    beforeFetch: (param) => {
      temporaryStorage.value = btnList.value;
      loading.value = true;
      processingParams(param);
    },
    afterFetch: () => {
      defaultChooseFive(btnList.value);
      loading.value = false;
    },
  });
  const calcColumnsTitle = computed(() => {
    let columns = selected.value.map((item) => {
      return {
        title: btnList.value[item]?.Name,
        className: 'ant__table__father__border_class',

        children: [
          {
            title: t('table.report.report_amount'),
            dataIndex: `amt_${item + 1}`,
            minWidth: 115,
            className: 'ant__table__children__border_class',

            customRender: ({ record }) => {
              return h(
                'div',
                {
                  onClick: () => turnDiscountReportDetail(record, item + 1, 'amt'),
                  class:
                    Number(record[`amt_${item + 1}`]) > 0 ? 'color-[#1475E1] cursor-pointer' : '',
                },
                record[`amt_${item + 1}`],
              );
            },
          },
          {
            title: t('table.report.report_num'), //会员账号
            dataIndex: `cnt_${item + 1}`,
            minWidth: 115,
            // className: 'ant__table__children__border_class',
            customRender: ({ record }) => {
              return h(
                'div',
                {
                  onClick: () => turnDiscountReportDetail(record, item + 1, 'cnt'),
                  class:
                    Number(record[`cnt_${item + 1}`]) > 0 ? 'color-[#1475E1] cursor-pointer' : '',
                },
                record[`cnt_${item + 1}`],
              );
            },
          },
        ],
      };
    });

    const allColumns = [
      {
        title: columns.length < 1 ? t('routes.basic.errorNoData') : t('business.common_count_date'),
        dataIndex: 'day_0',
        width: 180,
        className: 'ant__table__children__border_class',
        customRender: ({ record }) => {
          return dayjs(record.day_0 * 1000).format('YYYY-MM-DD');
        },
      },
      ...columns,
    ];

    return allColumns;
  });

  // 接口相关逻辑，存在即合理，都是些边界判断，包括初始化，不放在开头的原因就是会闪，只能请求后去处理了
  async function initEveryList(data) {
    const { setFieldsValue } = getForm();
    const { n, title, list } = await fetchReportActivity(data);
    if (!isChange.value) {
      notChangeState.value = selected.value;
    }

    if (list) {
      // 初始化一波数据
      setSelected.clear();
      selected.value = [];
      setFieldsValue({ iconGroup: 1 });
      // 币种
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
        ...currencyTreeList.filter((item) => n.includes(item.id)),
      ];
      // 列表题按钮
      btnList.value = title.slice(1);
    } else {
      currentList.value = [];
      btnList.value = [];
      setSelected.clear();
      selected.value = [];
      setFieldsValue({ iconGroup: 2 });
    }
    return list;
  }

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const params = await validate();
      processingParams(params);
      await exportFile(exportReportActivityExport, params, t('routes.report.activityReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }

  function processingParams(param) {
    setDateParmaTime(param);
    setDateParmas(param);
    param['currency_id'] = currency_id.value;
    timeList.start_time = param.start_time;
    timeList.end_time = param.end_time;
    delete param.iconGroup;
    return param;
  }

  function changeButtonDay(value) {
    const { searchTime } = history.state;
    if (!route.query.start && !isQueryDate.value && !searchTime) {
      isQueryDate.value = true;
    } else if (!isQueryDate.value) {
      return;
    }
    setTimeout(() => {
      getForm().setFieldsValue({ time: value });
      reload();
    });
  }
  function changeCurrencyId(v) {
    currency_id.value = v;
    reload();
  }
  function chooseCurrentBlock(value) {
    if (loading.value) return;

    if (value > 0) {
      if (setSelected.has(value) && setSelected.size < 6) {
        message.warn(t('business.common_tiss_1'));
        return;
      }

      if (setSelected.has(value)) {
        setSelected.delete(value);
      } else {
        setSelected.add(value);
      }
      selected.value = [...setSelected];
      selected.value = selected.value.sort((a, b) => a - b);
    } else {
      message.warn(t('business.common_tiss_2'));
    }
  }

  function turnDiscountReportDetail(rowData, index, type) {
    if (Number(rowData[`${type}_${index}`]) > 0) {
      // 优惠总额那一列才展示，其他列不展示
      const showType = index == 1 ? true : false;

      router.push({
        name: 'ActivityReportSecond',
        state: {
          time: rowData.day_0,
          currency_id: currency_id.value,
          cash_type: rowData[`csh_${index}`] == 813 ? '' : rowData[`csh_${index}`],
          isAll: showType,
        },
      });
    } else {
      return;
    }
  }
  function defaultChooseFive(list) {
    if (
      isChange.value ||
      (!isChange.value && temporaryStorage.value.length != btnList.value.length)
    ) {
      //
      if (list.length < 1) {
        return;
      }
      if (list.length < 5) {
        for (let i = 0; i < list.length; i++) {
          selected.value = [...setSelected.add(i)];
        }
      } else {
        for (let i = 0; i < 5; i++) {
          selected.value = [...setSelected.add(i)];
        }
      }
      //
      isChange.value = false;
    } else {
      notChangeState.value.forEach((item) => {
        selected.value = [...setSelected.add(item)];
      });
    }
  }
  watch(
    [currency_id, timeList],
    () => {
      isChange.value = true;
    },
    { deep: true },
  );
  onMounted(async () => {
    setTimeout(() => {
      if (route.query.start) {
        isQueryDate.value = true;
        const time = [
          dayjs(dayjs.unix(route.query.start as any).format('YYYY-MM-DD HH:mm:ss')),
          dayjs(dayjs.unix(route.query.end as any).format('YYYY-MM-DD HH:mm:ss')),
        ];
        getForm().setFieldsValue({ time: time });
        reload();
      }
    }, 500);
  });
</script>
<style scoped lang="scss">
  // .discount__report__class {
  //   ::v-deep(.ant-table-wrapper) {
  //     padding-top: 10px;
  //   }
  // }
  .discount__report__class {
    .title__selected {
      background-color: #0960bd !important;
      color: white;
    }

    &--export {
      background-color: #ff9800;
      color: white;
    }

    &--export:hover {
      border-color: #ff9800;
      opacity: 0.8;
      background-color: #ff9800;
      color: white;
    }

    &--export:focus {
      border-color: #ff9800;
      opacity: 0.8;
      background-color: #ff9800;
      color: white;
    }

    ::v-deep(.ant-table.ant-table-bordered > .ant-table-container > .ant-table-header) {
      padding-right: 10px;
      background-color: #f3f3f3;
    }
  }
</style>
