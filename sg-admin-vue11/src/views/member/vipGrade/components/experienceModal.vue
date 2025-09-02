<template>
  <BasicModal
    @register="registerModal2"
    :title="$t('table.member.member_exprice_rate')"
    @ok="okFun"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
  >
    <BasicForm @register="registerForm" :label-width="labelMaxWidth">
      <template #[item.name] v-for="(item, index) in schemasForm" :key="index">
        <Row>
          <InputGroup class="!flex">
            <Col :span="10">
              <InputNumber
                v-model:value="item.fieldValue[1]"
                :placeholder="$t('business.banner_tip')"
                Compact
                min="0"
                :controls="false"
                :stringMode="true"
              />
            </Col>
            <Col :span="2" class="!text-center line">=</Col>
            <Col :span="15">
              <InputNumber
                :controls="false"
                Compact
                min="0"
                v-model:value="item.fieldValue[0]"
                :placeholder="$t('table.member.member_exrience_')"
                :addon-after="$t('table.member.member_exprience_tip')"
                :stringMode="true"
              />
            </Col>
          </InputGroup>
        </Row>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { InputGroup, InputNumber, Row, Col } from 'ant-design-vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { getMemberVipCurrency, setMemberCurrency } from '/@/api/member/index';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { getCurrencyList } = useCurrencyStore();
  const schemasForm = ref<any>([]);
  const getData = ref<any>([]);
  const resetArray = ref([] as any);
  const [registerForm, { validate }] = useForm({
    schemas: schemasForm.value,
    showActionButtonGroup: false,
    // labelWidth: 100,
  });
  defineEmits(['register']);
  const [registerModal2, { closeModal }] = useModalInner(async (data) => {
    getData.value = await getMemberVipCurrency();
    const newList = schemasForm?.value.map((item1: any) => {
      const correspondingItem2 = getData.value.find((item2) => item2.cid === item1.key);
      if (correspondingItem2) {
        return {
          ...item1,
          fieldValue: [correspondingItem2.score, correspondingItem2.amount],
        };
      }
      return item1;
    });
    schemasForm.value = newList;
  });
  function createAchieveListItem(item: any) {
    const fieldArray = ['', ''];
    return {
      field: item.name,
      name: item.name,
      fieldValue: fieldArray,
      key: item.id,
      component: 'Input',
      label: item.name,
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.resolve();
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
      colProps: { span: 20 },
      slot: item.name,
      componentProps: ({ formModel }) => {},
    };
  }
  getCurrencyList.forEach((item) => {
    schemasForm?.value?.push(createAchieveListItem(item));
  });
  function reorganizearray(value) {
    const arrList = value.map((item) => {
      return {
        cid: item.key,
        score: item.fieldValue[0],
        amount: item.fieldValue[1],
      };
    });
    resetArray.value = arrList;
  }
  async function okFun() {
    reorganizearray(schemasForm?.value);
    for (const item of resetArray.value) {
      if (
        !item.score ||
        item.score === 'null' ||
        item.amount === '0' ||
        !item.amount ||
        item.amount === 'null'
      ) {
        return message.error(t('table.member.member_check'));
      }
    }
    const { data, status } = await setMemberCurrency(resetArray.value);
    if (status) {
      message.success(data);
      closeModal();
    }
  }

  const labelMaxWidth = ref(120);
</script>
