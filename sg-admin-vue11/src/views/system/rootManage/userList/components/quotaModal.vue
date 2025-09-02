<template>
  <BasicModal
    :title="$t('table.system.system_root_quota')"
    width="55%"
    @register="registerQuota"
    :okText="$t('common.okText')"
    :showCancelBtn="false"
    @ok="submitOk"
  >
    <Form ref="formRef" :model="formState">
      <Tabs v-model:activeKey="activeKey">
        <TabPane v-for="item in currencyTreeList" :key="item.id" :forceRender="true">
          <template #tab>
            <span>
              <cdIconCurrency class="!w-5" :icon="item.name" />
              {{ item.name }}
            </span>
          </template>
          <Row>
            <Col :span="18">
              <FormItem
                :label="$t('table.system.system_root_addMony') + ':'"
                :labelCol="{ span: 7 }"
                :name="`addMoney_${item.id}`"
                :rules="[{ required: true }]"
              >
                <InputNumber
                  :min="0"
                  v-model:value="formState[`addMoney_${item.id}`]"
                  :disabled="item.apiMap.addMoneyLimit"
                  :placeholder="$t('common.inputText')"
                />
              </FormItem>
            </Col>
            <Col :span="5">
              <Checkbox
                class="!mt-2 !ml-4"
                :checked="item.apiMap.addMoneyLimit"
                v-model:value="item.apiMap.addMoneyLimit"
                @change="(e) => changeLimit(e, item, 'addMoneyLimit')"
                >{{ $t('table.discountActivity.discount_no_limit') }}</Checkbox
              >
            </Col>
          </Row>
          <Row>
            <Col :span="18">
              <FormItem
                :label="$t('table.system.system_root_single') + ':'"
                :labelCol="{ span: 7 }"
                :name="`singleTrans_${item.id}`"
                :rules="[{ required: true }]"
              >
                <InputNumber
                  :min="0"
                  v-model:value="formState[`singleTrans_${item.id}`]"
                  :disabled="item.apiMap.singleTransLimit"
                  :placeholder="$t('common.inputText')"
                />
              </FormItem>
            </Col>
            <Col :span="5">
              <Checkbox
                class="!mt-2 !ml-4"
                :checked="item.apiMap.singleTransLimit"
                v-model:value="item.apiMap.singleTransLimit"
                @change="(e) => changeLimit(e, item, 'singleTransLimit')"
                >{{ $t('table.discountActivity.discount_no_limit') }}</Checkbox
              >
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    Form,
    FormItem,
    InputNumber,
    Row,
    Col,
    Checkbox,
    Tabs,
    TabPane,
    message,
  } from 'ant-design-vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { UpdateAdminAccount_limit } from '/@/api/sys';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const { getCurrencyList } = useCurrencyStore();
  const emit = defineEmits(['successEmit']);
  const currencyTreeList = ref(<any>[]);
  const idsToFilter = ['706', '707', '708'];
  const values: any = {};
  // const source = getCurrencyList.filter((el) => idsToFilter.includes(el.id));
  const formState = reactive({});
  getCurrencyList.forEach((item) => {
    formState[`addMoney_${item.id}`] = 0;
    formState[`singleTrans_${item.id}`] = 0;
    const tab = {
      id: item.id,
      name: item.name,
      apiMap: {
        [`addMoney_${item.id}`]: 0,
        addMoneyLimit: true,
        // singleTrans: 0,
        [`singleTrans_${item.id}`]: 0,
        singleTransLimit: true,
      },
    };
    currencyTreeList.value.push(tab);
  });
  const activeKey = ref(currencyTreeList.value[0].key);

  const [registerQuota, { closeModal }] = useModalInner((data) => {
    values.id = data.id;
    currencyTreeList.value.forEach((el) => {
      const { funds_limit_state, single_limit_state, single_limit_map } = data.data;
      const maxQuota = data.data[el.name] ?? 0;
      const singleQuota = (single_limit_map && single_limit_map[el.id]) ?? 0;
      formState[`addMoney_${el.id}`] = maxQuota ?? '0';
      el.apiMap.addMoneyLimit =
        !!!funds_limit_state || funds_limit_state[el.id] == 0 ? true : false;
      formState[`singleTrans_${el.id}`] = singleQuota ?? '0';
      el.apiMap.singleTransLimit =
        !!!single_limit_state || single_limit_state[el.id] == 0 ? true : false;
    });
  });

  const formRef: any = ref(null);

  async function submitOk() {
    try {
      await formRef.value.validate();
    } catch (error) {
      message.warning(t('table.system.system_fill_in_form'));
      return;
    }

    try {
      let currency_id_list = currencyTreeList.value.reduce((acc, item) => {
        acc[item.name] = '' + formState[`addMoney_${item.id}`];
        return acc;
      }, {});

      let parms = {
        uid: values.id,
        ...currency_id_list,
        // BRL: '2200',
        single_limit_map: JSON.stringify(
          currencyTreeList.value.reduce((acc, item) => {
            acc[item.id] = '' + formState[`singleTrans_${item.id}`];
            return acc;
          }, {}),
        ),
        funds_limit_state: JSON.stringify(
          currencyTreeList.value.reduce((acc, item) => {
            acc[item.id] = item.apiMap.addMoneyLimit ? 0 : 1;
            return acc;
          }, {}),
        ),
        single_limit_state: JSON.stringify(
          currencyTreeList.value.reduce((acc, item) => {
            acc[item.id] = item.apiMap.singleTransLimit ? 0 : 1;
            return acc;
          }, {}),
        ),
      };
      const { status, data } = await UpdateAdminAccount_limit(parms);

      if (status) {
        emit('successEmit');
        message.success(data);
        closeModal();
      } else {
        emit('successEmit');
        message.error(data);
      }
    } catch (error) {
      // message.error('表单验证失败');
    }
  }

  const changeLimit = (e, item, type) => {
    item.apiMap[type] = e.target.checked;
    if (e.target.checked) {
      formState[`${type.replace('Limit', '')}_${item.id}`] = 0;
    }
  };
</script>
