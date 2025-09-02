<template>
  <BasicModal
    :title="$t('table.member.member_points_config')"
    :okText="$t('table.system.system_conform_save')"
    :showCancelBtn="false"
    @ok="okFun"
    :width="500"
    @register="RegisterMadel"
    :footer="isControlValueSet() ? false : undefined"
  >
    <div class="p-l-2">
      <Form>
        <FormItem
          class="scope_config_modal"
          v-for="(item, index) in getListCurrency"
          :labelCol="{ span: 6 }"
          :key="index"
          :rules="{ required: true }"
        >
          <Row>
            <Col :span="4">
              <div class="p-t-2">
                <span style="color: #f00">* </span>
                <cdIconCurrency class="!w-5" :icon="currentyOptions[item.name]" />
                <span class="!align-middle m-l-1">{{ currentyOptions[item.name] }}</span>
              </div>
            </Col>
            <Col :span="9">
              <InputNumber
                :placeholder="$t('common.inputText')"
                v-model:value="item.value[0]"
                min="1"
                :stringMode="true"
                :disabled="isControlValueSet()"
                :addon-after="t('modalForm.member.member_coding')"
                :size="FORM_SIZE"
              />
            </Col>
            <div class="w-8 !text-center flex justify-center items-center">=</div>
            <Col :span="9">
              <InputNumber
                :placeholder="$t('modalForm.member.member_set_integral')"
                v-model:value="item.value[1]"
                :disabled="isControlValueSet()"
                :stringMode="true"
                :addon-after="t('modalForm.member.member_integral')"
                min="0"
                :size="FORM_SIZE"
              />
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateScoreConfig, getConfigMemberVip } from '@/api/member/index';
  import { message, FormItem, Row, Col, InputNumber, Form } from 'ant-design-vue';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const getListCurrency = ref([] as any);
  const [RegisterMadel, { closeModal }] = useModalInner(async () => {
    let getData = await getConfigMemberVip({ flag: 2 });
    getListCurrency.value = getData;
    getListCurrency.value = getData.map((item) => {
      return {
        name: String(item.key),
        value: item.value.split(','),
      };
    });
  });

  async function okFun() {
    const params = getListCurrency.value.map((item: any) => {
      return {
        key: item.name,
        value: item.value.toString(),
        ty: 2,
      };
    });
    try {
      for (const key in getListCurrency.value) {
        if (!getListCurrency.value[key].value[0] || !getListCurrency.value[key].value[1]) {
          message.error(t('modalForm.member.member_integral_tips'));
          return;
        }
      }
      const { status, data } = await updateScoreConfig(params);
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

<style>
  .scope_config_modal .ant-form-item-label > label {
    height: 100%;
  }
</style>
