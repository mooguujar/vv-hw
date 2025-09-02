<template>
  <div class="LayoutTable">
    <BasicTable @register="registerTable">
      <template #form-created>
        <div>
          <Button
            v-show="checkboxActive.length > 0"
            @click="batchShowConfirm({ ids: checkboxActive })"
            type="primary"
            danger
            class="mr-2"
            v-if="isHasAuth('70265')"
            >{{ $t('business.batch_delete') }}</Button
          >
          <Button
            @click="openAddIpModalFun()"
            class="!mr-2"
            v-if="isHasAuth('70261')"
            type="primary"
          >
            {{ $t('table.system.system_add_area') }}
          </Button>
        </div>
      </template>
      <template #form-currentType>
        <FormItemRest>
          <InputGroup class="!flex" compact>
            <Select style="width: 38%" v-model:value="currentType">
              <SelectOption :value="'content'">{{
                $t('table.risk.report_ip_address')
              }}</SelectOption>
              <SelectOption :value="'updated_name'">
                {{ $t('table.risk.report_operate_people') }}
              </SelectOption>
            </Select>
            <Input
              style="width: 59%"
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
      <template #action="{ record }">
        <span
          class="px-3 primary-color cursor"
          v-if="isHasAuth('70262')"
          @click="EditFun(record)"
          >{{ $t('business.common_edit') }}</span
        >
        <span class="text-red cursor px-3" v-if="isHasAuth('70265')" @click="showConfirm(record)"
          >{{ $t('common.delText') }}
        </span>
      </template>
    </BasicTable>
    <AddAreaModal @register="addAreaModal" @success="handleModalSuccess" />
  </div>
</template>

<script lang="ts" setup name="RegionalRestrictionsNocash">
  import { onMounted, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    DatePicker,
    FormItemRest,
    message,
  } from 'ant-design-vue';
  import { deleteAreaLimit, getAreaLimitList } from '/@/api/sys';
  import { useModal } from '/@/components/Modal';
  import dayjs from 'dayjs';
  import { openConfirm } from '/@/utils/confirm';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import AddAreaModal from './components/addAreaModal.vue';
  import { isHasAuth } from '/@/utils/authFunction';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });

  const { t } = useI18n();
  const fromSearch = ref('' as string);
  const checkboxActive = ref([] as any);
  const currentType = ref('content' as string);

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

  const [addAreaModal, { openModal }] = useModal();

  const [registerTable, { reload, clearSelectedRowKeys, setPagination, setProps }] = useTable({
    api: getAreaLimitList,
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    rowSelection: {
      onChange: (value, record) => {
        checkboxActive.value = record.map((item) => {
          return item.id;
        });
      },
    },
    beforeFetch: (params) => {
      setDateParmas(params);
      params[currentType.value] = fromSearch.value;
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;

      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });
  function openAddIpModalFun() {
    openModal(true, { category: 1, title: t('table.risk.report_new_ip') }); //新增IP
  }
  function EditFun(record) {
    openModal(true, { category: 1, title: t('table.risk.report_black_ip_edit'), ...record }); //编辑IP黑名单
  }

  function showConfirm(params) {
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.system.system_remove_area'),
      async () => {
        try {
          const { status, data } = await deleteAreaLimit({ id: params.id });
          if (status) {
            message.success(data);
            reload();
          } else message.error(data);
        } catch (e) {
          console.loerrorg(e);
        }
      },
      '',
    );
  }

  function batchShowConfirm(params) {
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.system.system_remove_area'),
      async () => {
        try {
          const { status, data } = await deleteAreaLimit({ id: params.ids.join(',') });
          if (status) {
            message.success(data);
            setPagination({ current: 1 });
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
      '',
    );
  }
  onMounted(() => {
    if (!isHasAuth('70265')) setProps({ rowSelection: false });
  });

  function handleModalSuccess() {
    reload();
  }
</script>
<style>
  #regionCountry_wrap_log .ant-select-dropdown {
    width: 100px !important;
  }

  #regionCountry_wrap_log .ant-select-dropdown .rc-virtual-list {
    width: 100%;
  }

  #regionCountry_wrap_log .ant-select-dropdown .rc-virtual-list .ant-select-item {
    overflow: hidden;
  }

  #regionCountry_wrap_log .ant-select-dropdown .rc-virtual-list .ant-select-item span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
