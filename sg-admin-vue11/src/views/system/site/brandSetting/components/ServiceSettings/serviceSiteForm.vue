<template>
  <div class="serviceSiteFormBox">
    <BasicForm @register="registerRegister" @submit="handleSubmit">
      <template #basicInfo>
        <div class="display-flex"
          ><div class="mr-2 title-block"></div
          ><h1>{{ $t('modalForm.system.system_service_configuration') }}</h1></div
        >
        <ServiceTable ref="tableRef" :dataList="dataList" />
      </template>
    </BasicForm>
    <div class="submit-btn text-center">
      <a-button
        type="primary"
        size="large"
        :disabled="isControlValueSet()"
        @click="handleSubmit"
        class="t-form-label-com mt-30px"
      >
        {{ $t('common.saveText') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive, ref, watch, onMounted, nextTick } from 'vue';
  import { registerSchema } from './base.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';
  import { message } from 'ant-design-vue';
  import ServiceTable from './serviceTable.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const emit = defineEmits(['update:ok']);
  const userStore = useUserStore();

  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });
  const dataList = ref([]);
  const FORM_SIZE = useFormSetting().getFormSize;
  const tableRef = ref<{ getDataSource: () => any } | null>(null);

  const [registerRegister, { validate, setFieldsValue }] = useForm({
    schemas: registerSchema(),
    actionColOptions: { span: 14 },
    size: FORM_SIZE,
    showResetButton: false,
    showActionButtonGroup: false,
  });

  const handleSubmit = async () => {
    //const value = await validate();

    const params = {
      name: 'kf',
    };

    if (tableRef.value.getDataSource()) {
      params['content'] = JSON.stringify(
        tableRef.value.getDataSource().map(({ url, id, remark, nativeKF, state }) => ({
          url,
          id,
          remark,
          nativeKF,
          state: state,
        })),
      );
    } else {
      params['customer'] = JSON.stringify([]);
    }
    const dataList = tableRef.value.getDataSource();
    let hasError = false; // 添加一个变量来跟踪错误状态
    dataList.forEach((item) => {
      if (!item.editValueRefs.url) {
        hasError = true; // 设置错误状态为true
        return message.error(t('table.system.custemor_link_tip'));
      }
      return;
    });
    if (!hasError) {
      const { status, data } = await updateSiteBrand(params);
      if (status) {
        message.success(data);
        // emit('update:ok');
      } else {
        message.error(data);
      }
    }
  };
  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    dataList.value = data;
    // setFormList(data);
  };
  onMounted(() => {
    GetSiteBrandDetail({ tag: 'kf' });
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  .serviceSiteFormBox {
    padding: 20px;
    padding-bottom: 0;
    border: 1px solid #e1e1e1 !important;
    background-color: #fff;

    h1 {
      margin: 0 !important;
      font-size: 18px !important;
      font-weight: 600;
      line-height: 18px !important;
    }

    ::v-deep(.ant-row) {
      .ant-row {
        margin-bottom: 0 !important;
      }

      .ant-form-item {
        .ant-form-item-label {
          margin-bottom: 20px;
        }
      }
    }

    .title-block {
      width: 6px !important;
      height: 15px !important;
      margin-top: 2px;
      background-color: #1475e1 !important;
    }

    .submit-btn {
      width: 100%;
      margin: auto;
      float: left;

      button {
        min-width: 240px;
      }
    }
  }
  ::v-deep(.cell-content) {
    max-width: initial !important;
  }
</style>
