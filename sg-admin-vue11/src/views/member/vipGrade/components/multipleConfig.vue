<template>
  <BasicModal
    :title="$t('table.member.member_config_multiple')"
    placement="right"
    width="560px"
    :helpMessage="`<div style='width: 200px'>${$t('table.member.member_defalt_tip')}</div>`"
    @register="registerMultiple"
    @ok="submitOK"
    :okText="$t('common.confirmSave')"
  >
    <BasicForm
      :size="FORM_SIZE"
      :schemas="schemas"
      @register="registerConfig"
      :label-width="labelMaxWidth"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getDetailVipConfig, updateVipConfig } from '/@/api/member/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { gameDictionary1 } from '../../common/const';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

  const { t } = useI18n();

  const schemas = ref([]);
  const FORM_SIZE = useFormSetting().getFormSize;
  const [registerMultiple, { closeModal }] = useModalInner(async (data) => {
    const dataList = await getDetailVipConfig();
    schemas.value = dataList.map((item) => {
      return {
        field: 't' + item.game_type + 'rate',
        component: 'InputNumber',
        label: gameDictionary1[item.game_type],
        required: true,
        value: item.rate,
        game_type: item.game_type,
        componentProps: {
          min: 0,
          precision: 2,
          stringMode: true,
          placeholder: t('table.member.member_setting_walter'),
        },
      };
    });
    const resultObject = {};
    schemas.value.forEach((item: any) => {
      resultObject[item.field] = item.value;
    });
    setFieldsValue(resultObject);
    useAutoLabelWidth(schemas.value);
  });
  const [registerConfig, { setFieldsValue, validate }] = useForm({
    //schemas: schemas.value,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  async function submitOK() {
    const values = await validate();
    const paramsValues = schemas.value.map((item: any, index: any) => {
      return {
        game_type: item.game_type,
        rate: values[`t${item.game_type}rate`],
      };
    });
    const { status, data } = await updateVipConfig(paramsValues);
    if (status) {
      closeModal();
      message.success(data);
    } else {
      message.error(data);
    }
  }
  const labelMaxWidth = ref(120);
</script>
