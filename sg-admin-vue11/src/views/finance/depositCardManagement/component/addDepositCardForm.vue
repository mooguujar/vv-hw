<template>
  <BasicModal
    @ok="okFun"
    @cancel="resetMemberLevel = false"
    :title="modalTitle"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @register="registeraddDemond"
    :width="600"
  >
    <BasicForm @register="registeraddDemondForm" @field-value-change="fieldChang">
      <template #terminalSlot="{ model, field }">
        <FormItemRest>
          <Checkbox
            v-model:checked="openTerminalState.checkAll"
            :indeterminate="openTerminalState.indeterminate"
            @change="onCheckAllChange($event, model, field)"
          >
            {{ t('business.common_select_all') }}
          </Checkbox>
        </FormItemRest>
        <CheckboxGroup
          v-model:value="openTerminalState.checkedList"
          :options="openTerminalOptions"
          @change="onChangeOpenTerminal($event, model, field)"
        />
      </template>
      <template #selectMember="{ model, field }">
        <MemberLevel
          v-if="resetMemberLevel"
          :currentMemberLevel="model[field]"
          @set-current-member-level="setCurrentMemberLevel"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts" name="addDepositCardForm">
  import { computed, reactive, ref, watch } from 'vue';
  import MemberLevel from '/@/components/MemberLevel/index.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemasFun, min_amount } from './depositCardForm.data';
  import {
    message,
    Checkbox,
    CheckboxGroup,
    FormItemRest,
  } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { insertBankcard, updateBankcard } from '/@/api/finance';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { ClientMappings, OPEN_TERMINAL_OPTIONS } from '/@/views/common/commonSetting';
  import { filterArrayByObject, getClientValues, isVirtualCurrency } from '/@/utils/common';
  import { useMemberStore } from '/@/store/modules/member';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['diamondsuccess', 'register']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const rowKey = ref<any>('');
  const modalTitle = ref<any>('');
  const openTerminalOptions = OPEN_TERMINAL_OPTIONS;
  const clientMappings = ClientMappings;

  const resetMemberLevel = ref(false as any);
  const checkMemberValues = ref(false as any);

  const memberStore = useMemberStore();
  memberStore.getLevelList();

  const { getAllCurrencyList } = useCurrencyStore();

  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: OPEN_TERMINAL_OPTIONS || [],
  });

  const setCurrentMemberLevel = (e) => {
    setFieldsValue({ level: e });
    clearValidate('level');
  };
  const [
    registeraddDemondForm,
    { setFieldsValue, validate, resetFields, clearValidate, updateSchema, getFieldsValue },
  ] = useForm({
    showResetButton: false,
    showSubmitButton: false,
    schemas: schemasFun(),
    size: FORM_SIZE,
  });

  const [registeraddDemond, { setModalProps, closeModal }] = useModalInner(async (values) => {
    resetMemberLevel.value = true;
    rowKey.value = values.id;
    if (values.id) {
      resetFields();
      let copyValue = JSON.parse(JSON.stringify(values));
      copyValue.level = filterArrayByObject(
        copyValue.level.split(','),
        useMemberStore().levelSelect,
      );
      if (copyValue.level.length == optionsListMember.value.length) checkMemberValues.value = true;
      else checkMemberValues.value = false;
      copyValue.client_type = getClientValues(JSON.parse(copyValue.client_type));
      openTerminalState.checkedList = copyValue.client_type;
      copyValue.contract_type = `${copyValue.contract_type}/${copyValue.contract_type_name}`;
      copyValue.bank_data = `${copyValue.bank_const_id}/${copyValue.bank_id}`;
      min_amount.value = copyValue.min_amount;

      if (!isVirtualCurrency(copyValue.currency_id) && copyValue.currency_id != '702') {
        copyValue.bank_account2 = copyValue.bank_account;
      }

      if (copyValue.currency_id == '702') {
        copyValue.open_name2 = copyValue.open_name;
      }
      await setFieldsValue({ ...copyValue });
      modalTitle.value = t('routes.finance.edit_deposit_card'); //编辑入款卡
    } else {
      resetFields();
      checkMemberValues.value = false;
      openTerminalState.checkedList = OPEN_TERMINAL_OPTIONS;
      openTerminalState.checkAll = true;
      openTerminalState.indeterminate = false;
      modalTitle.value = t('modalForm.finance.finance_add_bank'); //添加入款卡
      const { currencyType, activeKey } = values;
      setFieldsValue({
        client_type: OPEN_TERMINAL_OPTIONS,
        currency_type: currencyType == 'Fiat' ? 1 : 2,
        currency_id: activeKey,
      });
      updateSchema({
        field: 'bank_data',
        componentProps: {
          options: [],
        },
      });
    }
    setModalProps({ confirmLoading: false });
  });

  // 全选开放终端
  function onCheckAllChange(e: any, model: any, field: any): void {
    Object.assign(openTerminalState, {
      checkedList: e.target.checked ? openTerminalOptions : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openTerminalOptions : [];
  }

  function onChangeOpenTerminal(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  function fieldChang(v, value) {
    if (v == 'currency_type') {
      resetFields();
      setFieldsValue({ currency_type: value, client_type: OPEN_TERMINAL_OPTIONS });
    }
  }
  watch(
    () => openTerminalState.checkedList,
    (val) => {
      openTerminalState.indeterminate = !!val.length && val.length < openTerminalOptions.length;
      openTerminalState.checkAll = val.length === openTerminalOptions.length;
      setFieldsValue({ client_type: openTerminalState.checkedList });
    },
  );
  watch(
    () => checkMemberValues.value,
    (v) => {
      if (!v) {
        setFieldsValue({ level: [] });
      }
    },
  );

  function convertToJSONString(inputArray) {
    const client = inputArray.map((type) => clientMappings[type]);
    const outputArray = client.map((id) => ({ id }));
    const jsonString = JSON.stringify(outputArray);
    return jsonString;
  }

  async function okFun() {
    try {
      setModalProps({ confirmLoading: true });
      const value = await validate();
      value.level = value.level.join(',');
      value.client_type = convertToJSONString(value.client_type);

      if (isVirtualCurrency(value.currency_id)) {
        const itemFind = getAllCurrencyList?.find((item) => {
          return item.id == value?.currency_id;
        });
        value.currency_name = itemFind.name;
        const contract_type = value.contract_type.split('/');
        value.contract_type = contract_type[0];
        value.contract_type_name = contract_type[1];
      } else {
        if (value.currency_id == '702') {
          value.open_name = value.open_name2;
        }

        const bank_data = value.bank_data.split('/');
        value.bank_id = bank_data[1];
        value.bank_const_id = Number(bank_data[0]);

        if (value.bank_account2) value.bank_account = value.bank_account2;
        delete value.bank_account2;
        delete value.bank_data;
      }

      const { status, data } = rowKey.value
        ? await updateBankcard({ ...value, id: rowKey.value })
        : await insertBankcard(value);

      if (status) {
        message.success(data);
        emit('diamondsuccess', value.currency_id);
        closeModal();
      } else {
        message.error(data);
      }
      setTimeout(() => {
        resetMemberLevel.value = false;
      }, 111);
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  const optionsListMember = computed(() => {
    const outputArray: { label: string; value: string }[] = [];
    for (const key in memberStore.levelSelect) {
      outputArray.push({ label: memberStore.levelSelect[key], value: key });
    }
    return outputArray;
  });
</script>
