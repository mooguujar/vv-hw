<template>
  <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable2">
    <DateButtonGroup
      class="absolute h-0"
      :isSelect="'days'"
      @change-button-day="changeButtonDay"
      :dateGroupButtonList="[]"
    />
    <BasicTable
      @register="registerTable"
      @columns-change="handleColumnChange"
      class="!pt-0"
      :scroll="{ y: scrollHeight }"
    >
      <template #form-businessTypeModal="{ model, field }">
        <a-input
          v-if="businessTypesPicked.length"
          value=""
          :placeholder="`${t('search.finance.finance_commission_chosen')}${
            businessTypesValues.length
          }${t('search.finance.finance_commission_chosen_lenth')}`"
          readonly
          class="cursor"
          @click="handleTypeModal(model)"
        />
        <a-input
          v-else
          v-model:value="model[field]"
          :placeholder="t('search.finance.finance_commission_choose_text')"
          readonly
          class="cursor"
          @click="handleTypeModal(model)"
        />
      </template>

      <template #form-startDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <!-- <template #headerTop>
        <div class="mb-2 md:flex radius">
          <template v-for="(item, index) in cardList" :key="item.title">
            <Card
              size="small"
              class="md:w-1/10 w-full !md:mt-0 card-box text-white"
              :style="{
                'background-image': `url('${item.bgImage}')`,
                'background-size': '100% 100%',
              }"
              :class="{ '!md:mr-2': index + 1 < cardList.length, '!mt-4': index > 0 }"
            >
              <div class="flex items-center justify-center px-4 py-4 pb-0">
                <span>{{ item.title }}</span>
              </div>

              <div class="flex items-center justify-center px-4 py-4 pt-2" style="height: 30px">
                <span class="text-center">
                  <div> {{ item.value }}</div>
                </span>
              </div>
            </Card>
          </template>
        </div>
      </template> -->
    </BasicTable>
    <BusinessTypeModal
      @register="typesModal"
      @comfirm-business-types-picked="comfirmBusinessTypesPicked"
    />
  </PageWrapper>
</template>

<script lang="ts">
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';

  import { defineComponent, ref, onMounted, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './depositSummary.data';
  import { useModal } from '/@/components/Modal';
  import { exportcoinTransactionList, getTransactionLisnew } from '/@/api/finance';
  import { PageWrapper } from '/@/components/Page';
  import BusinessTypeModal from './BusinessTypeModal.vue';

  import { DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';

  import image2 from '@/assets/images/s2.webp';
  import image3 from '@/assets/images/s3.webp';
  import image6 from '@/assets/images/s6.webp';
  import image7 from '@/assets/images/s7.webp';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight350 } from '../../common/component';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  export default defineComponent({
    name: 'DepositSummaryNocash',
    components: {
      BasicTable,
      DateButtonGroup,
      BusinessTypeModal,
      PageWrapper,
      [DatePicker.name]: DatePicker,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(tabHeight350).value);
      const [typesModal, { openModal }] = useModal();
      const businessTypesPicked = ref<string[]>([]);
      const businessTypesValues = ref<string[]>([]);
      const cardList = ref<any>([]);
      const { t } = useI18n();

      const { exportFile } = useExportFile();

      const getDepositSummaryData = async (tableParams): Promise<any> => {
        try {
          const depositAmount = 0;
          const withdrawalAmount = 0;
          const commissionAmount = 0;
          const discountAmount = 0;
          const list = [
            {
              title: t('common.translate.word66'),
              value: depositAmount,
              // bgColor: '180deg, #F9C373 0%, #E57D05 100%',
              bgImage: image2,
            },
            {
              title: t('common.translate.word67'),
              value: withdrawalAmount,
              // bgColor: '180deg, #94BCEF 0%, #0C61CE 100%',
              bgImage: image3,
            },
            {
              title: t('common.translate.word68'),
              value: commissionAmount,
              // bgColor: '180deg, #89F38C 0%, #16B61B 100%',
              bgImage: image6,
            },
            {
              title: t('common.translate.word69'),
              value: discountAmount,
              // bgColor: '180deg, #91F3F8 0%, #05B9BF 100%',
              bgImage: image7,
            },
          ];
          cardList.value = [];
          list.forEach((item) => {
            cardList.value.push(item);
          });
          const response = await getTransactionLisnew({ ...tableParams, dw: 1 });
          return response;
        } catch (error) {
          console.error(error);
        }
      };
      const customSelectColums = ref<any[]>([]);
      onMounted(() => {
        customSelectColums.value = getColumns().map((item) => item.dataIndex);
      });
      const [registerTable, { getForm, getColumns, reload }] = useTable({
        // title: '存取总汇列表',
        api: getDepositSummaryData,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          showResetButton: isHasAuth('70880'),
          actionColOptions: {
            class: 't-form-col t-form-label-com inquireButtonBox',
          },
          submitButtonOptions: {
            text: t('common.queryText'),
          },
          resetButtonOptions: {
            text: t('common.export'),
          },
          resetFunc: handleExportTableList,
        },
        beforeFetch: (params) => {
          setDateParmaTime(params);
          // setDateParmas(params);
          return params;
        },
        useSearchForm: true,
        // showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
      });
      async function changeButtonDay(value) {
        setTimeout(async () => {
          await getForm().setFieldsValue({
            time: [
              dayjs(value[0]).subtract(2, 'day').startOf('day').toDate(),
              dayjs(value[0]).endOf('day').toDate(),
            ],
          });
          reload();
        }, 11);
      }

      async function handleExportTableList(): Promise<void> {
        try {
          const { validate } = getForm();
          const param = await validate();
          setDateParmaTime(param);
          setDateParmas(param);
          param.dw = 1;
          await exportFile(exportcoinTransactionList, param, t('routes.finance.deposit_summary'));
        } catch (e) {
          console.error(e);
        }
        // 避免汇出后自动查询
        return Promise.reject();
      }

      const handleTypeModal = (modal): void => {
        const { type } = modal;
        openModal(true, { type });
      };

      const comfirmBusinessTypesPicked = (list: string[]) => {
        businessTypesPicked.value = Object.keys(list);
        businessTypesValues.value = Object.values(list).flatMap((row) => row);
        const { setFieldsValue } = getForm();
        if (businessTypesPicked.value.length) {
          setFieldsValue({ business_type: Object.keys(list).join(',') });
        } else {
          setFieldsValue({ business_type: '' });
        }
        setFieldsValue({
          cash_type: Object.values(list)
            .map((values) => values.join(','))
            .join(','),
        });
      };

      const model = ref<FormModel>({
        start_time: dayjs().subtract(2, 'day').startOf('day').toDate(),
        end_time: dayjs().endOf('day').toDate(),
      });

      const disabledStartDate = (date) => {
        if (model.value.end_time) {
          return date.valueOf() > model.value.end_time.valueOf();
        } else {
          return date.valueOf() > dayjs().endOf('day');
        }
      };

      const disabledEndDate = (date) => {
        if (model.value.start_time) {
          return (
            date.valueOf() < model.value.start_time.valueOf() ||
            date.valueOf() > dayjs().endOf('day')
          );
        } else {
          return date.valueOf() > dayjs().endOf('day');
        }
      };

      const onStartDateChange = (value) => {
        model.value.start_time = value;
      };

      const onEndDateChange = (value) => {
        model.value.end_time = value;
      };

      const handleColumnChange = (valArray) => {
        nextTick(() => {
          if (valArray && valArray.length) {
            valArray = valArray.map((item) => {
              if (item.visible) {
                return item.dataIndex;
              }
            });
            customSelectColums.value = valArray;
          }
        });
      };

      return {
        changeButtonDay,
        cardList,
        handleColumnChange,
        registerTable,
        searchFormSchema,
        typesModal,
        handleTypeModal,
        comfirmBusinessTypesPicked,
        businessTypesPicked,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        businessTypesValues,
        t,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }

  ::v-deep(.ant-table-wrapper) {
    margin-left: 10px;
  }
</style>
