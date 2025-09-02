<template>
  <div>
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-profitListMonitor>
        <Button
          type="primary"
          @click="handleDetails()"
          class="t-form-label-com-btn"
          style="margin-right: 10px"
          >{{ $t('table.risk.report_monitor_data') }}
        </Button>
      </template>
      <template #form-usernameSlot>
        <FormItemRest>
          <InputGroup compact style="display: flex; width: 380px" class="t-form-label-com">
            <Select :dropdownMatchSelectWidth="false" v-model:value="currentType" class="br-none">
              <SelectOption value="content">{{ $t('table.risk.report_link_info') }}</SelectOption>
              <SelectOption value="updated_name"
                >{{ $t('table.risk.report_operate_people') }}
              </SelectOption>
              <SelectOption value="username"
                >{{ $t('business.common_member_account') }}
              </SelectOption>
            </Select>
            <Input
              class="mr-5"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #people="{ record }">
        <div
          class="primary-color cursor"
          v-if="isHasAuth('60605')"
          @click="associatedInfoFun(record)"
          >{{ record.num }}
        </div>
        <div v-else>{{ record.num }}</div>
      </template>
      <template #action="{ record }">
        <span
          class="p-3 primary-color cursor"
          @click="associatedInfoFun(record)"
          v-show="record.limit_type != 3"
          v-if="isHasAuth('60605')"
          >{{ $t('business.common_deal_with') }}</span
        >
        <span class="p-3 primary-color cursor" v-if="isHasAuth('60602')" @click="ignoreFun(record)"
          >{{
            record.limit_type == 3
              ? $t('table.risk.report_cancel_ignored')
              : $t('table.risk.report_set_ignored')
          }}
        </span>
      </template>
    </BasicTable>
    <ParameterMonitoringModal @register="registerMonitoringModal" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm } from './index.data';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    DatePicker,
    message,
    FormItemRest,
  } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import { useModal } from '/@/components/Modal';
  import ParameterMonitoringModal from '../../../common/components/parameterMonitoringModal.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getAssociateList, updatAassociateList } from '/@/api/risk';
  import { openConfirm } from '/@/utils/confirm';
  import dayjs from 'dayjs';
  import {
    setDateParmas,
    setStartformatDate,
    setEndformatDate,
    updateButtonDay,
  } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const route = useRoute();
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });

  const $router = useRouter();
  const currentType = ref('content' as string);
  const fromSearch = ref(route.query.rowContent ?? '');
  const timer = ref(route.query.time * 1000);

  const [registerMonitoringModal, { openModal }] = useModal();
  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: getAssociateList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      if (timer.value) {
        params.time = [timer.value, timer.value];
        setDateParmas(params);
      }
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      if (timer.value) {
        getForm().setFieldsValue({ time: [params.start_time, params.end_time] });
      }

      delete params.time;
      params[currentType.value] = fromSearch.value;
      return params;
    },
    afterFetch: () => {
      timer.value = null;
    },
  });

  nextTick(async () => {
    let time_ = await updateButtonDay('days');
    await getForm().setFieldsValue({ time: time_ });
    reload();
  });

  function handleDetails() {
    openModal(true, { risk_code: 'linked_records' });
  }

  // 详情跳转
  function associatedInfoFun(record) {
    $router.push({
      name: 'AssociatedInfo',
      state: {
        id: record.id,
      },
    });
  }

  function ignoreFun(record) {
    let confirmMessage = t('modalForm.risk.risk_ignore_tip'); //您确定要忽略这条记录吗？
    let limit_type = 3;
    if (record.limit_type == 3) {
      confirmMessage = t('modalForm.risk.risk_cancel_ignore_tip'); //您确定要取消忽略这条记录吗？
      limit_type = 2;
    }
    //警告提示
    openConfirm(t('common.warning'), confirmMessage, async () => {
      try {
        const { status, data } = await updatAassociateList({ id: record.id, limit_type });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    });
  }

  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
  };

  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };
</script>
