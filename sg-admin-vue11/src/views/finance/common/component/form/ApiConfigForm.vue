<template>
  <BasicForm @register="registerForm" class="payment-configuration">
    <template #level_ids="{ model, field }">
      <MemberLevel
        class="w-100%"
        v-if="showMemberLevel"
        :currentMemberLevel="currentMemberLevel"
        :disabled_select="disabled_select"
        @set-current-member-level="setCurrentMemberLevel"
      />
    </template>
    <template #config>
      <div>
        <div class="mb-5 -mt-2">
          <cdButtonCurrency :btn-list="currencyList" v-model="activeKey" />
        </div>
        <div style="position: relative" v-if="currencyList.length">
          <span :style="{ position: 'absolute', top: '8px', left: labelWidth, color: '#444' }">{{
            t('table.report.report_device_port') + ': '
          }}</span>
          <template v-for="item in currencyList" :key="item.key">
            <div v-if="item.id == activeKey">
              <FormItemRest>
                <div class="t-form-label-com" style="position: relative">
                  <RadioGroup v-model:value="clientActiveKey" button-style="solid">
                    <template v-for="sItem in item.clientList" :key="sItem.value">
                      <RadioButton :value="sItem.value" @click="handleClickButton(sItem)">
                        {{ sItem.label }}
                      </RadioButton>
                    </template>
                  </RadioGroup>
                </div>
                <div class="radio-list mt-20px">
                  <Tabs v-model:activeKey="clientActiveKey">
                    <Tab-pane
                      v-for="sItem in item.clientList"
                      :key="sItem.value"
                      :tab="sItem.label"
                    >
                      <draggable
                        v-if="sItem.configList"
                        tag="div"
                        class="config-group"
                        handle=".move-icon"
                        item-key="id"
                        sort="true"
                        :forceFallback="true"
                        :animation="200"
                        :list="sItem.configList"
                        ghost-class="ghost"
                      >
                        <template #item="{ element }">
                          <div class="flex items-center mt-2">
                            <div
                              class="mr-2"
                              :class="[element.currency_id === '702' ? 'w-22' : 'w-32']"
                            >
                              <label>{{ element.label }}</label>
                            </div>
                            <div class="flex flex-wrap items-center flex-1">
                              <DragSelectGroup
                                class="flex flex-wrap mr-2"
                                :item-key="element.id"
                                :draggableList="element.draggableList"
                                :editor="'select'"
                                :selectWidth="160"
                                @update:value="(record) => handleChange(element, record)"
                                @change="(e) => handleDragEnd(e, element)"
                                @click:add="handleAddDraggableList(element)"
                                @click:del="(dIndex) => handleDelDraggableList(element, dIndex)"
                              />
                            </div>
                          </div>
                        </template>
                      </draggable>
                      <div v-else class="mr-250"> <a-empty description="" /></div>
                    </Tab-pane>
                  </Tabs>
                </div>
              </FormItemRest>
            </div>
          </template>
        </div>
      </div>
    </template>
  </BasicForm>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import {
    Tabs,
    TabPane,
    FormItemRest,
    RadioGroup,
    RadioButton,
    message,
    Empty,
  } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import draggable from 'vuedraggable';
  import { DragSelectGroup } from '/@/components/DragSelectGroup';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { clientList } from '/@/views/common/commonSetting';
  import { UPDATE_METHOD_MODE } from '@/views/finance/common/const';
  import {
    detailSetting,
    getAllCurrencyList,
    getAllMethodList,
    insertSetting,
    PaymentSettingLevel,
    updateSetting,
  } from '/@/api/finance';
  import { useMemberStore } from '/@/store/modules/member';
  import { buildUUID } from '/@/utils/uuid';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import MemberLevel from '/@/components/MemberLevel/index.vue';
  import { useLocaleStoreWithOut } from '@/store/modules/locale';

  const showMemberLevel = ref(true);
  showMemberLevel.value = true;

  const { getCurrencyList } = useCurrencyStore();

  const memberStore = useMemberStore();
  // 获取层级下拉
  memberStore.getLevelList();

  const AEmpty = Empty;
  const currentLanguage = useLocaleStoreWithOut();
  // const labelWidth = computed(() => {
  //   return currentLanguage.getLocale == 'en_US' ? '-86px' : '-64px';
  // });

  const labelWidth = computed(() => {
    const widths = {
      en_US: '-86px',
      zh_CN: '-64px',
      pt_BR: '-146px',
      vi_VN: '-98px',
      default: '-64px', // 可以设置一个默认值
    };

    const lang = currentLanguage.getLocale;
    return widths[lang] || widths.default;
  });
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    editMode: {
      type: String,
      default: UPDATE_METHOD_MODE.ADD,
    },
    paymentPlatformData: {
      type: Object,
      default: () => null,
    },
  });
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const activeKey = ref();
  const clientActiveKey = ref(24);

  let allCurrencyList = ref<any>({});
  let allMethodList = ref<any>({});
  let allDetailList = ref<any>({});

  let currencyList = ref<any>([]);

  const FORM_SIZE = useFormSetting().getFormSize;

  const currentMemberLevel = ref([]);

  async function fetchData() {
    try {
      allCurrencyList.value = await getAllCurrencyList({ withdraw: 1, company: 1 });

      allMethodList.value = await getAllMethodList();

      if (route.params.modalType === 'editor' || route.params.modalType === 'copy') {
        const res = await detailSetting({ id: route.params.id });
        res.level = res.level.map(parseFloat);
        setFieldsValue({ ...res });
        currentMemberLevel.value = res.level;
        getApiSelectComponentProps(res.level, []);
        allDetailList.value = res;
      }

      currencyList.value = setCurrencyList();
      currencyList.value = currencyList.value.filter((item) =>
        item.clientList.some((client) => client.configList !== undefined),
      );
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  }

  async function getApiSelectComponentProps(additionalValues, editor?) {
    let PaymentSettingLevel_response = await PaymentSettingLevel();
    let numberArray = [];
    numberArray = PaymentSettingLevel_response
      ? PaymentSettingLevel_response.map(parseFloat).concat(additionalValues)
      : [...additionalValues];

    const outputArray = Object.entries(memberStore.levelSelect).map(([key, label]) => ({
      label,
      value: Number(key),
      disabled: !numberArray.includes(Number(key)),
    }));

    disabled_select.value = outputArray;
  }

  const disabled_select = ref<any>([]);
  if (route.params.modalType != 'editor' && route.params.modalType != 'copy') {
    getApiSelectComponentProps([]);
  }

  function getWithdrawForm() {
    return [
      {
        field: 'level',
        label: t('modalForm.finance.finance_application_level') + ':',
        rules: [
          {
            type: 'array',
          },
          {
            required: true,
            validator: async (rule, value) => {
              if (value && value.length > 0) {
                clearValidate();
                return Promise.resolve();
              } else {
                return Promise.reject(t('modalForm.finance.finance_choose_application_level'));
              }
            },
            trigger: 'change',
          },
        ],
        component: 'Input',
        componentProps: {
          maxlength: 12,
          autoComplete: 'off',
          getPopupContainer: () => document.body,
          placeholder: t('modalForm.discountActivity.member_tip0'), //请输入
        },
        slot: 'level_ids',
        colProps: {
          span: 12,
        },
      },
      {
        field: 'config',
        label: t('modalForm.finance.finance_pay_application') + ':',
        component: 'Input',
        slot: 'config',
        colProps: {
          span: 24,
        },
      },
    ];
  }

  fetchData().then(() => {
    activeKey.value = currencyList.value[0].id;
  });

  function setCurrencyList() {
    return getCurrencyList.map((item) => {
      return {
        ...item,
        clientList: setClientList(allCurrencyList.value[item.id], item.id),
      };
    });
  }

  function setClientList(data, id) {
    const client = clientList.map((item) => {
      return {
        ...item,
        configList:
          route.params.modalType == 'add'
            ? setConfigList(item.value, data)
            : setDetailList(item.value, data, id),
      };
    });
    return client;
  }

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj; // 如果是基本数据类型或 null，则直接返回
    }

    if (Array.isArray(obj)) {
      const clonedArray = [];
      for (let i = 0; i < obj.length; i++) {
        clonedArray[i] = deepClone(obj[i]);
      }
      return clonedArray;
    }

    // 如果是对象类型
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  function setConfigList(key, data) {
    function processItem(item) {
      item.label = item.name;
      let selectOptions = allMethodList.value[item.id];
      if (selectOptions) {
        selectOptions.forEach((option) => {
          option.label = option.name;
          option.value = `${option.id}%${option.name}`;
        });
      }
      item.draggableList = ref([
        {
          id: buildUUID(),
          value: ref(null),
          selectOptions: selectOptions || [],
          placeholder: `${t('modalForm.finance.finance_traffic_channel')}1`,
        },
      ]);
    }

    let configList = ref([]);

    if (data) {
      data.forEach((item) => {
        processItem(item);
      });
    }

    switch (key) {
      case 24:
      case 25:
      case 26:
      case 27:
        configList = ref(deepClone(data));
        break;
    }

    return configList.value;
  }

  function setDetailList(key, data, id) {
    let configList = [];

    if (data) {
      data.forEach((item) => {
        item.label = item.name;
        item.draggableList = [];

        const selectOptions = allMethodList.value[item.id] || [];

        selectOptions.forEach((option) => {
          option.label = option.name;
          option.value = `${option.id}%${option.name}`;
          option.disabled = false; // 首先将所有选项的 disabled 属性重置为 false
        });

        const relevantDetails = Array.isArray(allDetailList.value.setting[key])
          ? allDetailList.value.setting[key].filter(
              (el) => el.method_id == item.id && el.currency_id == id,
            )
          : [];

        selectOptions.forEach((option) => {
          // 根据 relevantDetails 匹配来设置 option.disabled
          const isMatching = relevantDetails.some(
            (el) => option.value === `${el.company_id}%${el.company_name}`,
          );
          option.disabled = isMatching;
        });

        if (relevantDetails.length > 0) {
          const list = relevantDetails.map((el) => ({
            value: `${el.company_id}%${el.company_name}`,
            selectOptions: ref([...selectOptions]), // 使用扩展运算符来复制数组
          }));

          item.draggableList = ref(list);
        }
        dealWithselectIds(item);
      });
    }

    switch (key) {
      case 24:
      case 25:
      case 26:
      case 27:
        configList = deepClone(data);
        break;
    }

    return configList;
  }

  function handleAddDraggableList(item) {
    if (item.draggableList && item.draggableList.length > 0) {
      const obj = item.draggableList[item.draggableList.length - 1];
      let copyObj = JSON.parse(JSON.stringify(obj));
      copyObj.value = null;
      item.draggableList.push({
        ...copyObj,
        id: buildUUID(),
        placeholder: `${t('modalForm.finance.finance_traffic_channel')}${
          item.draggableList.length + 1
        }`,
      });
    } else {
      let selectOptions = allMethodList.value[item.id];
      if (selectOptions) {
        selectOptions.forEach((option) => {
          option.label = option.name;
          option.value = `${option.id}%${option.name}`;
          option.sqIndex = null;
          option.disabled = false;
        });
      }
      item.draggableList = ref([
        {
          id: buildUUID(),
          value: null,
          selectOptions: selectOptions,
          placeholder: `${t('modalForm.finance.finance_traffic_channel')}1`,
        },
      ]);
    }
  }

  function handleDelDraggableList(item, index) {
    item.draggableList.splice(index, 1);
    dealWithselectIds(item);
    handleListPlaceholder(item);
  }

  function handleListPlaceholder(item) {
    item.draggableList = item.draggableList.map((el, index) => ({
      ...el,
      placeholder: `${t('modalForm.finance.finance_traffic_channel')}${index + 1}`,
    }));
  }

  function handleChange(item, record) {
    const { index, value } = record;
    item.draggableList[index].value = value;
    dealWithselectIds(item);
  }

  function dealWithselectIds(item) {
    const selectIds = item.draggableList
      .filter((item) => item.value !== '')
      .map((item) => item.value);

    item.draggableList.forEach((el, index) => {
      el.selectOptions &&
        el.selectOptions.forEach((kl) => {
          if (selectIds.includes(kl.value)) {
            kl.disabled = true;
          } else {
            kl.disabled = false;
            kl.sqIndex = null;
          }
          if (el.value == kl.value) {
            item.draggableList.forEach((ll) => {
              ll.selectOptions.forEach((option) => {
                if (option.id == kl.id) option.sqIndex = index + 1;
              });
            });
          }
        });
    });
  }

  function handleDragEnd(value, item) {
    handleListPlaceholder(item);
    item.draggableList.forEach((el) => {
      el.selectOptions &&
        el.selectOptions.forEach((kl) => {
          kl.sqIndex = null;
        });
    });
    dealWithselectIds(item);
  }

  function handleClickButton(item) {
    clientActiveKey.value = item.value;
  }

  const [registerForm, { validate, setFieldsValue, updateSchema, clearValidate }] = useForm({
    schemas: getWithdrawForm(),
    size: FORM_SIZE,
    submitFunc,
    submitButtonOptions: {
      text: t('common.confirmSave'),
      size: FORM_SIZE,
      style: {
        marginTop: '20px',
        width: '200px',
      },
    },
    showResetButton: false,
  });
  const setCurrentMemberLevel = (e) => {
    setFieldsValue({ level: e });
    clearValidate('level');
  };

  async function submitFunc(): Promise<void> {
    try {
      const values = await validate();
      let params = {
        level: values.level.map(String),
      };
      const setting = {};
      // 遍历list数据
      currencyList.value.forEach((currency) => {
        currency.clientList.forEach((client) => {
          if (client.configList) {
            client.configList.forEach((config) => {
              const key = client.value.toString(); // 将客户端值作为键
              if (!setting[key]) {
                setting[key] = []; // 如果该键不存在，创建一个空数组
              }
              // 将config数据添加到数组中
              if (config.draggableList && config.draggableList.length > 0) {
                config.draggableList.forEach((el) => {
                  if (el.value) {
                    const [id, name] = el.value.split('%');
                    setting[key].push({
                      currency_id: currency.id,
                      company_id: id,
                      company_name: name,
                      method_id: config.id,
                      method_name: config.name,
                      method_alias: config.alias,
                      type_id: config.type_id,
                      seq: config.seq,
                    });
                  }
                });
              }
            });
          }
        });
      });
      // 打印转换后的setting数据
      params['setting'] = setting;

      const { status, data } =
        route.params.modalType == 'add' || route.params.modalType == 'copy'
          ? await insertSetting(params)
          : await updateSetting({ ...params, id: allDetailList.value.id });
      if (status) {
        message.success(data);
        router.push({ name: 'WithdrawalConfig' });
      } else {
        message.error(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>

<style lang="less">
  .radio-list {
    .ant-tabs-nav {
      display: none !important;
    }
  }
</style>

<style lang="less" scoped>
  .currencyList {
    margin-bottom: 10px;

    ::v-deep(.ant-radio-button-wrapper:first-child) {
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      border-left-width: 1px;
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      border-left-width: 1px;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px;
      border-left-width: 1px solid #d9d9d9;
      text-align: center;
    }
  }
</style>
