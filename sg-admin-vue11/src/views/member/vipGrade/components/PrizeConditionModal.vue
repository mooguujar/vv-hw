<template>
  <BasicModal
    :title="$t('common.bonus_collection_conditions')"
    :okText="$t('table.system.system_conform_save')"
    @ok="okFun"
    :width="bonusConditionsModal"
    @register="RegisterPrizeMadel"
    :showCancelBtn="false"
    :footer="isControlValueSet() || disabled ? false : undefined"
  >
    <Form :layout="'horizontal'">
      <FormItem
        class="scope_config_modal"
        :labelCol="{ style: { width: formLabelWidth + 'px' } }"
        labelAlign="right"
        v-for="(item, index) in getListPrize"
        :key="index"
        :label="item.label"
      >
        <InputNumber
          :disabled="isControlValueSet() || disabled"
          :size="FORM_SIZE"
          :placeholder="$t('common.inputText')"
          v-model:value="item.value"
          :max="100"
          :min="0"
          :precision="2"
        >
          <template #addonAfter>
            <div :style="{ width: formAfterLabelWidth + 'px', textAlign: 'left' }">
              {{ item.afterLabel }}
            </div>
          </template>
        </InputNumber>
      </FormItem>
    </Form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updatePrizeConfig, getConfigMemberVip } from '@/api/member/index';
  import { message, FormItem, InputNumber, Form } from 'ant-design-vue';
  import { usePrizeConditonOptions } from '/@/views/common/commonSetting';
  import {
    useAutoFieldLabelWidth,
    setClassWidthNew,
  } from '/@/components/Form/src/hooks/useForm.js';
  import { isControlValueSet } from '/@/utils/domUtils';

  const props = defineProps({
    disabled: { type: Boolean, default: false },
  });
  const { disabled } = toRefs(props);
  const FORM_SIZE = useFormSetting().getFormSize;
  const getListPrize = ref([] as any);
  const bonusConditionsModal = setClassWidthNew({ zh_CN: 500, default: 650 });
  const formLabelWidth = computed(() => useAutoFieldLabelWidth(getListPrize.value));
  const formAfterLabelWidth = computed(() =>
    useAutoFieldLabelWidth(getListPrize.value, 'afterLabel', -20),
  );
  const [RegisterPrizeMadel, { closeModal }] = useModalInner(async () => {
    let getData = await getConfigMemberVip({ flag: 3 });
    getData.sort((a, b) => {
      if (a.ty !== b.ty) {
        return a.ty - b.ty;
      } else {
        return b.key.localeCompare(a.key);
      }
    });
    const { prizeConditon } = usePrizeConditonOptions();
    getListPrize.value = getData.map((item) => {
      let tempArray = prizeConditon.filter((list) => list.key === item.key && list.ty === item.ty);
      return {
        ...item,
        value: item.value,
        label: tempArray[0].label,
        afterLabel: tempArray[0].afterLabel,
      };
    });
  });
  async function okFun() {
    const params = getListPrize.value.map((item: any) => {
      return {
        key: item.key,
        value: isNaN(parseFloat(item.value)) ? '' : parseFloat(item.value).toString(),
        ty: item.ty,
      };
    });
    try {
      const { status, data } = await updatePrizeConfig(params);
      if (status) {
        message.success(data);
        closeModal();
      }
    } catch (error) {
      message.error(error);
    } finally {
    }
  }
</script>
<style scoped lang="less">
  .ant-form-item-label > label,
  .text-horizon-center {
    height: 40px;
    line-height: 40px;
  }
</style>
