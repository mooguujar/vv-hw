<template>
  <div>
    <BasicModal
      :showCancelBtn="false"
      :maskClosable="true"
      :destroyOnClose="true"
      :width="900"
      :okText="t('table.system.system_conform_save')"
      :title="setTitle"
      @register="registerModal"
      @ok="submitOk"
      @cancel="setinfo_formState"
    >
      <BasicForm :size="FORM_SIZE" @register="registerForm">
        <template #siteManage>
          <span class="cursor-pointer primary-color" @click="handlesite">{{
            t('business.common_edit')
          }}</span>
        </template>
        <template #addmoney>
          <div class="addmoneyBox">
            <div class="header">
              <Tabs v-model:activeKey="activeKey">
                <TabPane v-for="item in currencyTreeList" :key="item.id" :forceRender="true">
                  <template #tab>
                    <span>
                      <cdIconCurrency class="!w-5" :icon="item.name" />
                      {{ item.name }}
                    </span>
                  </template>
                  <Form ref="formRef" :model="formState">
                    <Row>
                      <Col :span="18">
                        <FormItem
                          :label="t('table.system.system_root_addMony')"
                          :labelCol="{ span: 7 }"
                          :rules="[{ required: true }]"
                          :name="`addMoney_${item.id}`"
                        >
                          <InputNumber
                            v-model:value="formState[`addMoney_${item.id}`]"
                            :disabled="item.apiMap.addMoneyLimit"
                            :min="0"
                            :placeholder="t('common.inputText')"
                          />
                        </FormItem>
                      </Col>
                      <Col :span="4">
                        <Checkbox
                          class="!mt-2 !ml-4"
                          :checked="item.apiMap.addMoneyLimit"
                          v-model:value="item.apiMap.addMoneyLimit"
                          @change="(e) => changeLimit(e, item, 'addMoneyLimit')"
                          >{{ t('table.discountActivity.discount_no_limit') }}</Checkbox
                        >
                      </Col>
                    </Row>
                    <Row>
                      <Col :span="18">
                        <FormItem
                          :label="t('table.system.system_root_single')"
                          :labelCol="{ span: 7 }"
                          :rules="[{ required: true }]"
                          :name="`singleTrans_${item.id}`"
                          ><InputNumber
                            :min="0"
                            v-model:value="formState[`singleTrans_${item.id}`]"
                            :disabled="item.apiMap.singleTransLimit"
                            :placeholder="t('common.inputText')"
                          />
                        </FormItem>
                      </Col>
                      <Col :span="4">
                        <Checkbox
                          class="!mt-2 !ml-4"
                          :checked="item.apiMap.singleTransLimit"
                          v-model:value="item.apiMap.singleTransLimit"
                          @change="(e) => changeLimit(e, item, 'singleTransLimit')"
                          >{{ t('table.discountActivity.discount_no_limit') }}</Checkbox
                        >
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </template>
        <template #seamo="{ model, field }">
          <div class="flex">
            <Input v-model:value="model[field]" disabled :size="FORM_SIZE">
              <template #suffix>
                <CopyOutlined class="btnClass" @click="handleCopy(model[field])" />
              </template>
            </Input>
            <Button type="primary" class="ml-2" size="large" @click="refresh">{{
              t('common.redo')
            }}</Button>
          </div>
        </template>
      </BasicForm>
    </BasicModal>
    <siteManage
      @emitList="emitListChange"
      @register="registerSite"
      :sites="getEditSite"
      :edit="true"
      @submitOk="setSiteList"
    />
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { insertForm } from './index.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import siteManage from './components/siteManage.vue';
  import { insertAdminList, limit_detail, updateAdminAccount } from '/@/api/sys/index';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useUserStore } from '/@/store/modules/user';
  import {
    message,
    Tabs,
    TabPane,
    Form,
    FormItem,
    InputNumber,
    Row,
    Col,
    Checkbox,
    Input,
    Button,
  } from 'ant-design-vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { CopyOutlined } from '@ant-design/icons-vue';
  const FORM_SIZE: any = useFormSetting().getFormSize;
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted } from 'vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  const { t } = useI18n();
  const openState = ref(false as any);
  const userStore = useUserStore();
  const { getCurrencyList } = useCurrencyStore();

  const currencyTreeList = ref(<any>[]);
  const formState = reactive({});
  const setinfo_formState = () => {
    currencyTreeList.value = [];
    getCurrencyList.forEach((item) => {
      formState[`addMoney_${item.id}`] = 0;
      formState[`singleTrans_${item.id}`] = 0;
      const tab = {
        id: item.id,
        name: item.name,
        apiMap: {
          addMoney: 0,
          addMoneyLimit: true,
          singleTrans: 0,
          singleTransLimit: true,
        },
      };
      currencyTreeList.value.push(tab);
    });
  };
  setinfo_formState();
  const defaultDdata = ref({});

  const [registerForm, { validate, setFieldsValue, resetFields }] = useForm({
    labelWidth: 200,
    showActionButtonGroup: false,
    schemas: insertForm,
    baseColProps: { span: 24 },
  });
  const siteList = ref(<any>[]);
  const formRef: any = ref(null);
  //const seamoValue = ref<any>();
  const siteListValue = ref([] as any);
  const siteListDeflut = ref([] as any);
  const getEditSite = ref([] as any);
  const activeKey = ref(currencyTreeList.value[0].key);
  const setTitle = ref('' as any);
  const listSite = ref([] as any);
  const editId = ref('' as any);
  const emit = defineEmits(['register', 'successEmit']);
  const [registerSite, { openModal }] = useModal();
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const [registerModal, { closeModal }] = useModalInner((data) => {
    const resultArray = [];
    for (const key in data.sites) {
      if (data.sites.hasOwnProperty(key)) {
        const value = data.sites[key];
        resultArray.push(value as never);
      }
    }
    siteList.value = userStore.siteList;
    const arrList = [];
    siteListDeflut.value = arrList;
    siteListValue.value = data.id ? resultArray : arrList;
    resetFields();
    editId.value = data.id;
    setTitle.value = t('modalForm.system.system_add_username');
    getEditSite.value = [];
    if (data.id) {
      defaultDdata.value = data;
      getEditSite.value = data.sites;
      setTitle.value = t('modalForm.system.system_edit_username');
      data.group_id = data.group_id.toString();
      const { password, ...arg } = data;
      setFieldsValue({ ...arg, group_id: data.group_id > 10 ? data.group_id : null });

      limit_detail({ uid: data.id }).then(({ data, status }) => {
        if (status) {
          data = data ?? {};
          currencyTreeList.value.forEach((el) => {
            const { funds_limit_state, single_limit_state, single_limit_map } = data;
            const maxQuota = data[el.name] ?? 0;
            const singleQuota = (single_limit_map && single_limit_map[el.id]) ?? 0;
            formState[`addMoney_${el.id}`] = maxQuota ?? '0';
            el.apiMap.addMoneyLimit =
              !!!funds_limit_state || funds_limit_state[el.id] == 0 ? true : false;
            formState[`singleTrans_${el.id}`] = singleQuota ?? '0';
            el.apiMap.singleTransLimit =
              !!!single_limit_state || single_limit_state[el.id] == 0 ? true : false;
          });
        }
      });
    } else {
      defaultDdata.value = {};
      const secret = window.otplib.authenticator.generateSecret(40);
      setFieldsValue({ seamo: secret });
    }
  });
  function handlesite() {
    openState.value = true;
    if (!!!defaultDdata.value.id) openModal(true, { type: 'add', data: {} });
    else openModal(true, { type: 'edite', data: defaultDdata.value });
  }

  function refresh() {
    const secret = window.otplib.authenticator.generateSecret(40);
    setFieldsValue({ seamo: secret });
    return Promise.reject();
  }

  function setSiteList() {
    siteList.value = ['1'];
  }

  function handleCopy(value) {
    if (!value) {
      message.warning(t('business.common_copy_tip'));
      return;
    }
    clearClipboard();
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      message.success(t('business.common_copy_suceess'));
    }
  }

  function emitListChange(v) {
    siteListValue.value = v;
    getEditSite.value = v;
  }
  async function submitOk() {
    for (const item of currencyTreeList.value) {
      const addMoney = formState[`addMoney_${item.id}`];
      const singleTrans = formState[`singleTrans_${item.id}`];

      if (
        !item.apiMap.addMoneyLimit &&
        (addMoney === undefined || addMoney === null || addMoney === '')
      ) {
        message.warning(
          ` ${t('common.inputText')} ${item.name} ${t('table.system.system_root_addMony')}`,
        );
        return;
      }
      if (
        !item.apiMap.singleTransLimit &&
        (singleTrans === undefined || singleTrans === null || singleTrans === '')
      ) {
        message.warning(
          ` ${t('common.inputText')} ${item.name} ${t('table.system.system_root_single')} `,
        );
        return;
      }
    }

    const values = await validate();
    if (siteListValue.value.length == 0) {
      message.error(t('table.system.system_management_site_not_selected'));
      return;
    }
    const uniqueArr = [...new Set(siteListValue.value)];
    let currency_id_list = currencyTreeList.value.reduce((acc, item) => {
      acc[item.name] = '' + formState[`addMoney_${item.id}`];
      return acc;
    }, {});

    let quota = {
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

    let _data = {
      quota: quota,
      username: values?.username,
      nickname: values?.nickname,
      password: values?.password, //密码
      group_id: values?.group_id, //用户组id
      sites: uniqueArr,
      seamo: values?.seamo, //动态密码给固定值
      remark: values?.remark,
    };
    editId.value ? (_data['id'] = editId.value) : _data;
    if (editId.value) {
      if (_data.password) {
        const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

        if (reg.test(_data.password)) {
          message.error(t('table.system.system_including_cn'));
          return;
        }

        const reg2 = new RegExp('^[a-zA-Z0-9]{6,20}$', 'g');

        if (!reg2.test(_data.password)) {
          message.error(t('table.system.system_login_tips'));
          return;
        }
      } else {
        delete _data.password;
      }
    }

    const { status, data } = editId.value
      ? await updateAdminAccount(_data)
      : await insertAdminList(_data);
    if (status) {
      emit('successEmit');
      message.success(data);
      closeModal();
    } else {
      emit('successEmit');
      message.error(data);
    }
  }
  onMounted(() => {
    siteListValue.value = siteListDeflut.value;
  });

  const changeLimit = (e, item, type) => {
    item.apiMap[type] = e.target.checked;
    if (e.target.checked) {
      formState[`${type.replace('Limit', '')}_${item.id}`] = 0;
    }
  };
</script>

<style lang="less">
  .addmoneyBox {
    width: 100%;
    padding: 0 5px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
  }
</style>
