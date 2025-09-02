<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-newAdd>
        <Button
          v-if="isHasAuth('30303')"
          type="primary"
          @click="() => handleOpenNewAdd({ id: '111' })"
          >{{ $t('table.system.system_insert_button') }}</Button
        >
      </template>
      <template #form-modelNameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="name">
              {{ t('table.google.report_columns_model_name') }}
            </SelectOption>
            <SelectOption value="app_name">
              {{ t('table.google.report_columns_APP_name') }}
            </SelectOption>
            <SelectOption value="updated_name">
              {{ t('table.google.report_columns_APP_operator') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            :allowClear="false"
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #noticePicture="{ record }">
        <span
          class="text-[#1475e1] cursor-pointer"
          @click="() => openCarousel(JSON.parse(record.promo_icon))"
          >{{ calcAppNoticeLength(JSON.parse(record.promo_icon)).length }}</span
        >
      </template>
      <template #action="{ record }">
        <span
          v-if="isHasAuth('30302')"
          class="mr-4 cursor-pointer text-[#1475e1]"
          @click="updateModal(record)"
          >{{ t('common.editorText') }}</span
        >
        <span
          v-if="isHasAuth('30304')"
          class="cursor-pointer text-red"
          @click="showConfirm(record)"
          >{{ t('common.delText') }}</span
        >
      </template>
    </BasicTable>
    <newAddModel @register="registerNewAddModal" @active-success="() => reload()" />
    <BaseCarousel
      v-if="showCarousel"
      v-model:isShow="showCarousel"
      v-model:carouselList="carouselList"
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="googleManager">
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema } from './index.data';
  import { Select, Input, SelectOption, Button, message } from 'ant-design-vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import newAddModel from './components/newAddModel.vue';
  import BaseCarousel from '/@/components-cd/carousel/BaseCarousel.vue';
  import { openConfirm } from '/@/utils/confirm';
  import { postChannelTemplateList, getChannelTemplateDelete } from '/@/api/promotion';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(340).value);

  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);
  const showCarousel = ref(false);
  const carouselList = ref<string[]>([]);

  const [registerNewAddModal, { openModal: OpenNewAddModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    api: async (params) => {
      const { data } = await postChannelTemplateList(params);
      return data;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
      },
      customClassForm: true,
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      showAdvancedButton: false, //是否收起
      showResetButton: false, //导出按钮隐藏
    },
    beforeFetch: (params) => {
      processingParams(params);
    },
  });
  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    if (fromSearch.value) params[currentType.value] = fromSearch.value;
    return params;
  }
  function handleOpenNewAdd(data) {
    OpenNewAddModal(true, data);
  }
  function openCarousel(data) {
    carouselList.value = data;
    showCarousel.value = true;
  }
  function updateModal(data) {
    OpenNewAddModal(true, data);
  }
  function showConfirm(record) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('table.google.report_columns_APP_delete_msg'),
      () => {
        handleDelete(record.id);
      },
      'confirmModal',
    );
  }
  function calcAppNoticeLength(list) {
    return list.filter((url) => url != 1);
  }
  async function handleDelete(id) {
    const { data, status } = await getChannelTemplateDelete({ id: id });
    if (status) {
      message.success(t('table.google.report_columns_APP_delete_success'));
      reload();
    } else {
      message.error(data);
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }

  .currentListGroup {
    ::v-deep(.ant-radio-button-wrapper:first-child) {
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      border-left-width: 1px;
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px;
      border-left-width: 1px;
      text-align: center;
    }
  }
</style>
