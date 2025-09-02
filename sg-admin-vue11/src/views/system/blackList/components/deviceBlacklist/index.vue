<template>
  <div>
    <BasicTable @register="registerTable" class="!p-0 with-more-input">
      <template #form-created>
        <div class="mr-2">
          <Button
            v-show="checkboxActive.length > 0"
            @click="showConfirm({ id: checkboxActive.toString() })"
            type="primary"
            danger
            v-if="isHasAuth('60111')"
            class="mr-2"
            >{{ $t('business.batch_delete') }}</Button
          >
          <Button @click="openAddIpModalFun()" v-if="isHasAuth('60109')" type="primary">{{
            $t('table.risk.report_add_device')
          }}</Button>
        </div>
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption :value="'val'">
              {{ $t('table.member.member_device_no') }}
            </SelectOption>
            <SelectOption :value="'updated_name'">
              {{ $t('table.risk.report_operate_people') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
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
        <span class="px-3 primary-color cursor" v-if="isHasAuth('60110')" @click="EditFun(record)"
          >{{ $t('business.common_edit') }}
        </span>
        <span
          class="px-3 text-red cursor"
          v-if="isHasAuth('60111')"
          @click="showConfirm({ id: record.id })"
        >
          {{ $t('common.delText') }}
        </span>
      </template>
    </BasicTable>
    <AddIpModal @register="addIpModal" @success="handleModalSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import { getBlackList, deleteBlackList } from '/@/api/site';
  import AddIpModal from '../../common/components/addIpModal.vue';
  import { Select, SelectOption, Input, DatePicker, message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { openConfirm } from '/@/utils/confirm';
  import dayjs from 'dayjs';
  import { setStartformatDate, setEndformatDate } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';

  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const checkboxActive = ref([] as any);
  const fromSearch = ref('' as string);
  const currentType = ref('val' as string);
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
  const [addIpModal, { openModal }] = useModal();
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: getBlackList,
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
    rowSelection: isHasAuth('60111')
      ? {
          onChange: (value, record) => {
            checkboxActive.value = record.map((item) => {
              return item.id;
            });
          },
        }
      : undefined,
    beforeFetch: (params) => {
      //setDateParmas(params);
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      params[currentType.value] = fromSearch.value;
      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });
  function handleModalSuccess() {
    reload();
  }
  function openAddIpModalFun() {
    openModal(true, { category: 2, title: t('table.risk.report_add_device') }); //新增设备
  }
  function EditFun(record) {
    //编辑设备黑名单
    openModal(true, { category: 2, title: t('table.risk.report_device_black_edit'), ...record });
  }
  function showConfirm(params) {
    //操作确认,您确定删除该设备号吗？
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.risk.report_deviceno_remove_tip'),
      async () => {
        try {
          const { status, data } = await deleteBlackList(params);
          if (status) {
            message.success(data);
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
      '',
    );
  }
</script>
