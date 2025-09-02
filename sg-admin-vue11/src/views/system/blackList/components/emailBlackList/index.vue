<template>
  <div>
    <BasicTable @register="registerTable" class="!p-0 with-more-input">
      <template #form-created>
        <div class="mr-2">
          <Button
            v-show="checkboxActive.length > 0"
            @click="showConfirm(checkboxActive)"
            type="primary"
            danger
            class="mr-2"
            v-if="isHasAuth('60111')"
            >{{ $t('business.batch_delete') }}</Button
          >
          <Button @click="openAddIpModalFun()" v-if="isHasAuth('60109')" type="primary">{{
            $t('table.risk.report_add_email')
          }}</Button>
        </div>
      </template>
      <template #form-username>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption :value="'val'">
              {{ $t('business.common_email_account') }}
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
        <span
          class="px-3 primary-color cursor"
          v-if="isHasAuth('60110')"
          @click="EditFun(record)"
          >{{ $t('business.common_edit') }}</span
        >
        <span
          class="px-3 text-red cursor"
          v-if="isHasAuth('60111')"
          @click="showConfirm(record.id)"
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
  import { Select, SelectOption, Input, Button, DatePicker, message } from 'ant-design-vue';
  import { getBlackList, deleteBlackList } from '/@/api/site';
  import AddIpModal from '../../common/components/addIpModal.vue';
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  import { openConfirm } from '/@/utils/confirm';
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
  const fromSearch = ref('' as string);
  const checkboxActive = ref([] as any);
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
    rowSelection: isHasAuth('60111')
      ? {
          onChange: (value, record) => {
            checkboxActive.value = record.map((item) => {
              return item.id;
            });
          },
        }
      : undefined,
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });
  function openAddIpModalFun() {
    openModal(true, { category: 3, title: t('table.risk.report_add_email') }); //新增邮箱
  }
  function handleModalSuccess() {
    reload();
  }
  function EditFun(record) {
    openModal(true, { category: 3, title: t('table.risk.report_email_black_edit'), ...record }); //编辑邮箱黑名单
  }
  function showConfirm(params) {
    //操作确认 您确定删除该邮箱账号吗？
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.risk.report_email_remove_tip'),
      async () => {
        try {
          const { status, data } = await deleteBlackList({ id: params.toString() });
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
