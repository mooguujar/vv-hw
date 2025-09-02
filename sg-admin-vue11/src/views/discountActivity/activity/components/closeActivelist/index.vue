<template>
  <div>
    <BasicTable @register="registerTable" class="!p-0" :scroll="{ y: scrollHeight }">
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
      <template #dataTimeSlot="{ record }">
        <div>
          <div>
            {{ record['start_at_tz'] }}
          </div>
          <div>
            {{ record['end_at_tz'] }}
          </div>
        </div>
      </template>
      <template #showDataTime="{ record }">
        <div>
          <div>{{ dayjs(record.display_start_at * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
          <div>{{ dayjs(record.display_end_at * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
      </template>
      <template #action="{ record }">
        <!-- <span class="primary-color cursor" @click="copyFun(record)">
          复制
        </span> -->
        <span class="mr-3 primary-color cursor" @click="recordHandle(record)" v-if="record.ty != 5">
          {{ $t('business.common_jl') }}
        </span>
        <span
          class="cursor"
          v-if="isHasAuth('40211')"
          style="color: red"
          @click="showConfirm(record)"
        >
          {{ $t('business.common_delete') }}
        </span>
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 40%" v-model:value="currentType" class="br-none">
            <SelectOption :value="'id'">ID</SelectOption>
            <SelectOption :value="'name'">
              {{ $t('table.discountActivity.discount_name') }}
            </SelectOption>
            <SelectOption :value="'updated_name'">
              {{ $t('table.risk.report_operate_people') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 60%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
    </BasicTable>
    <AddIpModal @register="addIpModal" @success="handleModalSuccess" />
    <recordList @register="recordTable" />
  </div>
</template>

<script lang="ts" setup>
  import { isHasAuth } from '@/utils/authFunction';
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { deletePromo, getPromoList } from '/@/api/activity';
  import AddIpModal from '../../common/components/addIpModal.vue';
  import { Select, SelectOption, Input, DatePicker, message, FormItemRest } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { openConfirm } from '/@/utils/confirm';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import recordList from '../recordList/index.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight410 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight410).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const [recordTable, { openModal: openModalRecod }] = useModal();

  function recordHandle(data) {
    openModalRecod(true, data);
  }
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);
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
    api: getPromoList,
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      params['flag'] = 2;
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
      t('v.discount.activity.deletePromo'),
      async () => {
        try {
          const { status, data } = await deletePromo({ pid: params.id });
          if (status) {
            message.success(data);
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
    );
  }
</script>
