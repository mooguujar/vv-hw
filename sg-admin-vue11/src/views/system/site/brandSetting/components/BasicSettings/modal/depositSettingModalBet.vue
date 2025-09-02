<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    @ok="handleSubmit"
    @cancel="cancelSubmit"
    :cancelText="$t('business.common_cancel')"
    :okText="$t('common.sure')"
    :showCancelBtn="!disableValue"
    :showOkBtn="!disableValue"
    :width="formCol * 520"
  >
    <Loading :loading="loading" v-if="loading" :absolute="false" />
    <Form v-else>
      <header>
        <Row v-for="item in formCol" :key="item">
          <Col :span="4">
            <span>{{ t('business.common_currency') }}</span>
          </Col>
          <Col :span="9" class="mr-45px">
            <span>
              {{
                activeKey === 'min_access'
                  ? t('modalForm.system.system_min_deposit')
                  : t('modalForm.system.min_bet_amount')
              }}</span
            >
          </Col>
          <Col :span="9">
            <span>{{
              activeKey === 'min_access'
                ? t('modalForm.system.system_min_withdrawal')
                : t('modalForm.system.max_bet_amount')
            }}</span>
          </Col>
        </Row>
      </header>
      <section>
        <FormItem v-for="(item, index) in listData" :key="index">
          <Row>
            <Col :span="4">
              <cdIconCurrency class="!w-5" :icon="item.label" />
              <span class="!align-middle m-l-2">{{ item.label }}：</span>
            </Col>
            <Col :span="9">
              <InputNumber
                :disabled="disableValue"
                :size="FORM_SIZE"
                :placeholder="
                  activeKey === 'min_access'
                    ? t('modalForm.system.system_min_deposit')
                    : t('modalForm.system.max_bet_tip')
                "
                v-model:value="item.value[0]"
                min="0"
                :stringMode="true"
              />
            </Col>
            <div class="mx-20px">~</div>
            <Col :span="9">
              <InputNumber
                :disabled="disableValue"
                :size="FORM_SIZE"
                :placeholder="
                  activeKey === 'min_access'
                    ? t('modalForm.system.system_min_withdrawal')
                    : t('modalForm.system.max_bet_amount_tip')
                "
                v-model:value="item.value[1]"
                :stringMode="true"
                min="0"
              />
            </Col>
          </Row>
        </FormItem>
      </section>
    </Form>
  </BasicModal>
</template>
<script lang="ts" setup name="AccessMoneySettingModalbet">
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getSchemaBase, schemaTable } from './accessMoneySettingModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import {
    getSiteBrandDetail,
    updateSiteBrand,
    getBrandDetail,
    updateMinigameBrand,
  } from '/@/api/sys';
  import { message, InputNumber, Form, FormItem, Row, Col } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { sortList } from '/@/utils/common.ts';

  const { currencyTreeList } = useTreeListStore();
  const FORM_SIZE = useFormSetting().getFormSize;
  const activeKey = ref('min_access');
  const getList = ref([] as any);
  const loading = ref(false as any);
  const emit = defineEmits(['update:ok', 'reloadUpdate']);
  const title = ref('' as string);
  const disableValue = ref(false as any);
  const { t } = useI18n();
  const props = defineProps({
    getInfoLimit: {
      type: Object,
      default: () => ({}),
    },
  });
  const listData = computed(() => {
    return sortList(getList.value);
  });
  const formCol = computed(() => {
    return listData.value?.length > 1 ? 2 : 1;
  });

  // const [registerForm, { resetFields, setFieldsValue, validate, clearValidate, getFieldsValue }] = useForm({
  //   labelWidth: 100,
  //   baseColProps: { span: 22 },
  //   showActionButtonGroup: false,
  //   schemas: schemaTable,
  //   actionColOptions: {
  //     span: 22,
  //   },
  //   size: FORM_SIZE,
  // });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await setModalProps({ confirmLoading: false });
    loading.value = true;
    const { type } = data;
    activeKey.value = type;
    if (type === 'bet_limit') {
      const { data, status } = await getBrandDetail({ tag: 'mini_game_limit' });
      if (status) {
        loading.value = false;
        disableValue.value = true;
        title.value = t('modalForm.system.bet_limit_amount'); //投注限额（仅对自研游戏限制）
        const newResult = {};
        for (const key in data) {
          const newKey = key.substring(1);
          newResult[newKey] = data[key];
        }
        getList.value = sortById(
          currencyTreeList.map((item) => {
            let itemData = newResult[item.id];
            if (itemData) {
              return {
                id: item.id,
                label: item.name,
                value: itemData ? itemData : ['1', '100'],
              };
            } else {
              return {
                id: item.id,
                label: item.name,
                value: ['1', '100'],
              };
            }
          }),
        );
      }
    } else {
      const { data, status } = await getBrandDetail({ tag: 'amount' });
      if (status) {
        disableValue.value = false;
        title.value = t('modalForm.system.system_settings_deposit');
        loading.value = false;
        const restructuredData = {};
        for (const key in data) {
          const newKey = key.substring(1);
          restructuredData[newKey] = data[key];
        }
        getList.value = sortById(
          currencyTreeList.map((item) => {
            let itemData = restructuredData[item.id];
            if (itemData) {
              return {
                id: item.id,
                label: item.name,
                value: [itemData.d || '1', itemData.w || '100'],
              };
            } else {
              return {
                id: item.id,
                label: item.name,
                value: ['1', '100'],
              };
            }
          }),
        );
      }
    }
  });
  function sortById(array) {
    return array.sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id);
    });
  }
  async function handleSubmit() {
    try {
      const result = {};
      if (activeKey.value === 'bet_limit') {
        //const result = {};
        getList.value.forEach((item) => {
          const key = 'c' + item.id;
          result[key] = item.value;
        });

        for (const key in result) {
          if (result.hasOwnProperty(key)) {
            if (result[key]['d'] == null) {
              return message.error(t('modalForm.system.min_bet_amount_tip')); //
            }
            if (result[key]['w'] == null) {
              return message.error(t('modalForm.system.max_bet_amount_tip0')); //请输入最高投注
            }
            if (Number(result[key]['d']) > Number(result[key]['w'])) {
              return message.error(t('modalForm.system.min_max_bet_tip')); //最低投注不能大于最高投注
            }
          }
        }
      } else {
        //const result = {};
        getList.value.forEach((item) => {
          const key = 'c' + item.id;
          result[key] = {
            d: item.value[0],
            w: item.value[1],
          };
        });
        for (const key in result) {
          if (result.hasOwnProperty(key)) {
            if (result[key]['d'] == null) {
              return message.error(t('common.enterMinimumDeposit'));
            }
            if (result[key]['w'] == null) {
              return message.error(t('common.enterMinimumWithdrawal'));
            }
            if (Number(result[key][0]) > Number(result[key][1])) {
              return message.error(t('common.minimumDepositCanNotGtMinimumWithdrawal'));
            }
          }
        }
      }
      const name = activeKey.value === 'bet_limit' ? 'minigame' : 'amount';
      const { data, status } = await updateSiteBrand({
        content: JSON.stringify(result),
        name: name,
      });
      if (status) {
        message.success(data);
        closeModal();
      } else {
        message.error(data);
      }
      //emit('sendParams', result,activeKey.value);
      //closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  function cancelSubmit() {
    emit('reloadUpdate');
  }
</script>
<style lang="less" scoped>
  header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, 480px));
    gap: 20px;
    margin-bottom: 10px;
    .ant-col-4 {
      text-align: right;
      padding-right: 20px;
    }
    .ant-col-9 {
      text-align: center;
      flex-grow: 1;
      flex-shrink: 80;
      flex: auto;
    }
  }
  section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, 480px));
    gap: 20px;
    .ant-row {
      flex-flow: nowrap;
      margin-bottom: 0;
      align-items: center;
    }
    .ant-col-9 {
      flex-grow: 1;
      flex-shrink: 80;
      flex: auto;
    }
    .ant-col-4 {
      text-align: right;
      white-space: nowrap;
    }
  }
</style>
