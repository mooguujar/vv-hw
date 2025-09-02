<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <BasicTable @register="registerTable" class="!p-0">
      <template #form-created>
        <div class="mr-2.5">
          <!-- <a-button
            type="primary"
            :size="'large'"
            preIcon="ant-design:left-outlined"
            class="ml-2.5 mb-2.5"
            @click="handleBack"
          >
            {{ t('common.back') }}
          </a-button> -->
          <BasicButton type="primary" :iconSize="20" @click="handleBack" preIcon="RectBack:svg">
            {{ t('common.back') }}
          </BasicButton>
        </div>
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="username">{{
              $t('table.promotion.promotion_agency_account')
            }}</SelectOption>
            <SelectOption value="channel_name">{{
              $t('table.promotion.promotion_tunnel_name')
            }}</SelectOption>
            <SelectOption value="channel_id">{{
              $t('table.promotion.promotion_tunnel_ID')
            }}</SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #action="{ record }">
        <span>{{ record.channel_name }} </span>
      </template>
      <template #reg_count="{ record }">
        <span class="primary-color">{{ record.reg_count }} </span>
      </template>
      <template #first_deposit_count="{ record }">
        <span class="primary-color"
          >{{ record.first_deposit_amount }} / {{ record.first_deposit_count
          }}{{ t('component.unit.people') }}
        </span>
      </template>
      <template #first_deposit_count_by_reg="{ record }">
        <span class="primary-color"
          >{{ record.first_deposit_amount_by_reg }} / {{ record.first_deposit_count_by_reg
          }}{{ t('component.unit.people') }}
        </span>
      </template>
      <template #actionnew="{ record }">
        <span class="px-3 primary-color cursor" @click="openView(record)">{{
          $t('common.view')
        }}</span>
      </template>
    </BasicTable>
    <RetainModal @register="addRetainModal" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { getChannelReportDate } from '@/api/promotion';
  import { PageWrapper } from '/@/components/Page';
  import { setDateParmas, toTimezone } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks/web/useI18n';
  import { columns, schemas } from './index.data';
  import { InputGroup, Select, SelectOption, Input, FormItemRest } from 'ant-design-vue';
  import RetainModal from '../../common/components/retainModal.vue';
  import { useModal } from '/@/components/Modal';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  const props = defineProps({
    updatedTempParams: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['back']);

  const { t } = useI18n();
  const fromSearch = ref('' as string);
  const currentType = ref('username');
  const tempParams = ref({} as object);

  async function getData(params) {
    tempParams.value = {
      page: params.page,
      page_size: params.page_size,
      start_time: props.updatedTempParams.start_time,
      end_time: props.updatedTempParams.end_time,
      username: props.updatedTempParams.username || '',
      channel_id: props.updatedTempParams.channel_id || '',
      channel_name: props.updatedTempParams.channel_name || '',
    };

    // 获取渠道统计
    const response = await getChannelReportDate(tempParams.value);

    const data = response.d;

    return data;
  }

  const [addRetainModal, { openModal }] = useModal();

  const [registerTable, { clearSelectedRowKeys }] = useTable({
    api: getChannelReportDate,
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
      setDateParmas(params);
      (params['start_time'] = props.updatedTempParams.start_time),
        (params['end_time'] = props.updatedTempParams.end_time),
        (params['username'] = props.updatedTempParams.username || ''),
        (params['channel_id'] = props.updatedTempParams.channel_id || ''),
        (params['channel_name'] = props.updatedTempParams.channel_name);

      if (fromSearch?.value && currentType?.value) {
        params[currentType.value] = fromSearch.value;
      }
      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });

  function handleBack() {
    emit('back');
  }

  function openView(data) {
    openModal(true, {
      channel_id: data.channel_id,
      time: toTimezone(data.time, 'YYYY-MM-DD'),
    });
  }
</script>
