<template>
  <BasicTable
    @register="registerTable"
    :class="[isHasAuth('41104'), currentList.length < 3 ? 'hid-btn' : '']"
    :scroll="{ y: scrollHeight }"
  >
    <template #form-createIp>
      <div class="mr-2">
        <Button
          type="primary"
          v-if="checkboxActive.length > 0 && isHasAuth('41104')"
          danger
          class="mr-2"
          @click="showConfirm(null, 'delAmount')"
          >{{ t('business.batch_delete') }}
        </Button>
        <Button type="primary" v-if="isHasAuth('41102')" class="mr-2" @click="showSpeakConfig"
          >{{ t('common.add_code') }}
        </Button>
      </div>
    </template>
    <template #form-commissionSummary>
      <DateButtonGroup
        :isSelect="isSelect"
        isEndToday
        @change="changeBtn"
        @change-button-day="changeButtonDay"
        :dateGroupButtonList="dateGroupButtonList"
      />
    </template>
    <template #form-usernameSlot>
      <a-input-group style="display: flex; width: 350px">
        <Select :dropdownMatchSelectWidth="false" v-model:value="userType">
          <!--兑换码-->
          <SelectOption value="code">
            {{ t('common.redeemCode') }}
          </SelectOption>
          <!--领取会员-->
          <SelectOption value="username">
            {{ t('common.get_membership') }}
          </SelectOption>
          <!--操作人员-->
          <SelectOption value="updated_name">
            {{ t('table.risk.report_operate_people') }}
          </SelectOption>
        </Select>
        <Input
          class="mr-5"
          allowClear
          :placeholder="t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>
    <template #code="{ record }">
      <Button @click="linkDetails(record, '', '')" type="link" v-if="getCode(1, record.code)">
        {{ getCode(1, record.code) }}
      </Button>
      <span v-else>{{ getCode(1, record.code) }}</span>
    </template>
    <template #codeNum="{ record }">
      <Button @click="linkDetails(record, '2', '')" type="link" v-if="getCode(2, record.code)">
        {{ getCode(2, record.code) }}
      </Button>
      <span v-else>{{ getCode(2, record.code) }}</span>
    </template>
    <template #tableTitle>
      <div class="w-full">
        <cdButtonCurrency
          :btn-list="currentList"
          @change-button-currency="changeClick"
          v-model="currency_id"
        />
      </div>
    </template>
    <template #currency_id="{ record }">
      <div v-if="record.currency_id">
        {{ record.currency_id }}
        <cdIconCurrency :icon="record.currency_id" class="w-20px ml-5px" />
      </div>
    </template>
    <template #action="{ column, record }">
      <TableAction
        v-if="getCode(2, record.code)"
        :actions="[
          {
            label: t('business.common_off'),
            onClick: showLimitModal.bind(null, record, 'limit'),
            ifShow: isHasAuth('41104'),
          },
        ]"
      />
      <TableAction
        v-else
        :actions="[
          {
            label: t('common.delText'),
            color: 'error',
            onClick: showConfirm.bind(null, record, 'del'),
            ifShow: isHasAuth('41104'),
          },
        ]"
      />
    </template>
  </BasicTable>
  <AddIpModal @register="registerSend" @success="handleModalSuccess" />
</template>
<script lang="ts" setup name="CommissionRecord">
  import { ref, nextTick } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { columns, searchForm, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { useRouter } from 'vue-router';
  import { Select, Input, SelectOption, Button, message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useModal } from '/@/components/Modal';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { openConfirm } from '@/utils/confirm';
  import AddIpModal from '../components/addIpModal.vue';
  import {
    deleteExchangeCode,
    getExchangeCodeList,
    getExchangeCurrency,
    updateExchangeCodeClose,
  } from '@/api/activity';
  import { useUserStore } from '@/store/modules/user';
  import { currentyOptions } from '@/settings/commonSetting';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(420).value);
  dateGroupButtonList[0].label = t('table.member.member_today'); //今日
  dateGroupButtonList[1].label = t('modalForm.common.yesterday'); //昨日
  dateGroupButtonList[2].label = t('table.member.member_week'); //本周
  dateGroupButtonList[3].label = t('table.member.member_month'); //本月
  const userType = ref('code' as string);
  const isSelect = ref('' as string);
  const currency_id = ref('' as string);
  const fromSearch = ref('' as any);
  const subList = ref([] as any);
  const ifData = ref(true as boolean);
  const num = ref(0 as number); // 进入页面会多次请求接口
  const { exportFile } = useExportFile();
  const dataCurrency = ref([] as any);
  const router = useRouter();
  const { currencyTreeList } = useTreeListStore();

  // const props = defineProps({
  //   currencyList: {
  //     type: Array,
  //     default: () => [],
  //   },
  // });

  // 跳转二级页面
  const { setDetailExchangeCode, setOnePageData, getOnePageData } = useUserStore();
  const currentList = ref([] as any);
  const [
    registerTable,
    { reload, clearSelectedRowKeys, getForm, getColumns, getRawDataSource, getPaginationRef },
  ] = useTable({
    // api: getExchangeCodeList,
    api: async (params) => {
      const { page, page_size, currency_id, ...paramsCopy } = params;
      let res = await getExchangeCurrency(paramsCopy);
      if (!Array.isArray(res)) {
        res = []; // 或者取决于业务逻辑，设置为其他默认值
      }
      // res = currencyTreeList.filter((item) => res.includes(item.name));
      if (res && res.length > 0) {
        const list = res?.map((item) => {
          return {
            name: item,
            value: item,
            label: item,
          };
        });
        currentList.value = [{ name: t('business.common_all'), value: '', lable: 'ALL' }, ...list];
      } else {
        currentList.value = [];
      }
      if (go1.value) {
        params.page = 1;
        go1.value = false;
      }
      const data = await getExchangeCodeList(params);
      return data;
    },
    columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: t('business.common_operate'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
      ifShow: auths(['41103', '41104']),
    },
    formConfig: {
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com action-btn-box',
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showResetButton: false,
      // showResetButton: isHasAuth('41107'),
      resetFunc: handleExportTableList,
    },
    rowSelection: isHasAuth('41104')
      ? {
          onChange: (value, record) => {
            checkboxActive.value = record
              .filter((val) => !getCode(2, val.code))
              .map((item) => {
                return item.id;
              });
          },
          getCheckboxProps: (record) => ({
            disabled: getCode(2, record.code),
          }),
        }
      : undefined,
    beforeFetch: (param) => {
      if ((userType.value === 'code' || userType.value === 'username') && fromSearch.value) {
        let obj = {
          id: param.id,
          userType: userType.value,
          fromSearch: fromSearch.value,
        };
        setDetailExchangeCode({ state: { ...obj, num: '', time: '' } });
        setParamas();
        // router.push({ name: 'CodeDetails', state: { ...obj, num: '', time: '' } });
      }

      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }

      /**
       * 二级页面回一级页面数据回填；
       * */
      if (getOnePageData?.show && ifData.value) {
        ifData.value = false;
        param.start_time = getOnePageData.ti[0];
        param.end_time = getOnePageData.ti[1];
        getForm().setFieldsValue({ time: [param.start_time, param.end_time] });
        isSelect.value = getOnePageData.sta;
        if (getOnePageData?.uname) {
          userType.value = 'updated_name';
          fromSearch.value = getOnePageData.uname;
        }
      }

      delete param.time;
      param['currency_id'] = currency_id.value;
      if (fromSearch.value) {
        param[userType.value] = fromSearch.value;
      }
      return param;
    },
    afterFetch: async (response) => {
      const data = getRawDataSource();
      dataCurrency.value = data.d;
      // currentList.value = [
      //   { name: t('table.member.member_money_all1'), value: '', lable: 'ALL' },
      //   ...props.currencyList,
      // ].concat(currencyTreeList.filter((item) => dataCurrency.value.includes(item.id)));
      subList.value = data.c;
      response = response.sort(function (a, b) {
        if (b.send_time && a.send_time) {
          return Number(new Date(b.send_time)) - Number(new Date(a.send_time as number));
        } else {
          return 0;
        }
      });
      clearSelectedRowKeys();
      checkboxActive.value = [];
      return response;
    },
  });
  const [registerSend, { openModal }] = useModal();
  const go1 = ref(false as boolean); // 回到第一页
  function changeClick(v) {
    go1.value = true;
    reload();
    currency_id.value = v;
  }

  // 操作按钮显示逻辑
  function getCode(v: number, code: string) {
    let num = 0;
    switch (v) {
      case 1:
        num = Object.keys(JSON.parse(code)).length;
        break;
      case 2:
        num = Object.values(JSON.parse(code)).filter(Boolean).length;
        break;
    }
    return num;
  }

  function linkDetails(record, num, time) {
    setDetailExchangeCode({ state: { id: record.id, num, time } });
    // 从表格来
    setParamas('y');
    // router.push({ name: 'CodeDetails', state: { id: record.id, num, time } });
  }

  function setParamas(str: string) {
    let values = getForm().getFieldsValue();
    let obj = { sta: isSelect.value, ti: values.time, fromTableBtn: str || '' };
    if (userType.value === 'updated_name') {
      obj.uname = fromSearch.value;
    }
    setOnePageData(obj);
  }

  const isTimeArr = ref([]);

  function changeBtn(e) {
    isSelect.value = e.target.value;
    getForm().setFieldsValue({ time: [isTimeArr.value[0], isTimeArr.value[1]] });
    reload();
  }

  function changeButtonDay(value) {
    isTimeArr.value = value;
    if (ifData.value) {
      getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    }
  }

  async function handleExportTableList(): Promise<void> {
    try {
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }

  // 关闭弹窗
  async function showLimitModal(record, type) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('common.code_close_msg'),
      () => {
        handleClose(record);
      },
      'confirmModal',
    );
  }

  const checkboxActive = ref<Array<string | number>>([]);
  const languageModal = ref('' as string);

  // 删除弹窗
  async function showConfirm(record, type) {
    if (type === 'del') {
      openConfirm(
        t('table.google.report_columns_APP_confirm'),
        t('common.code_del_all_msg', { len: '' }),
        () => {
          handleDelete(record);
        },
        'confirmModal',
      );
    }
    if (type === 'delAmount') {
      openConfirm(
        t('table.google.report_columns_APP_confirm'),
        `${t('common.code_del_all_msg', { len: checkboxActive.value.length })}`,
        () => {
          handleDelete(record);
        },
        'confirmModal',
      );
    }
  }

  // 确认关闭
  const emit = defineEmits(['reload']);
  const handleClose = async (record) => {
    const status = await updateExchangeCodeClose({
      id: record.id,
    });
    if (status) {
      message.success(t('layout.setting.operatingTitle'));
      reload();
      setTimeout(() => {
        emit('reload');
      }, 500);
    }
  };
  // 确认删除
  const handleDelete = async (record) => {
    const status = await deleteExchangeCode({
      id: record ? record.id : checkboxActive.value.join(','),
    });
    if (status) {
      message.success(t('table.google.report_columns_APP_delete_success'));
      reload();
      setTimeout(() => {
        emit('reload');
      }, 500);
    }
  };
  // 添加兑换码
  const showSpeakConfig = async (record) => {
    openModal(true, { category: 1, title: t('common.add_code') }); //添加兑换码
  };

  // 成功后回调
  function handleModalSuccess() {
    reload();
    setTimeout(() => {
      emit('reload');
    }, 500);
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col) {
    &.action-btn-box > div {
      position: relative;
      width: auto !important;
      float: left;

      div {
        position: relative;
        float: left;

        button {
          position: relative;
          float: left;
        }
      }
    }
  }

  ::v-deep(.time-type-sty) {
    .ant-select-selector {
      display: inline-block;
      width: 180px;
      height: 40px;
      line-height: 40px;
    }

    .ant-picker-input > input:focus,
    .ant-picker-input > input-focused,
    .ant-picker,
    .ant-input,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:hover {
      border: 0 !important;
      box-shadow: none !important;
    }
  }

  .select-all {
    ::v-deep(.ant-table-body) {
      table:first-child {
        td:first-child div {
          width: 48px !important;
          min-width: 48px !important;
        }

        .ant-table-placeholder {
          .ant-table-expanded-row-fixed {
            width: 100% !important;
            min-width: 100% !important;
          }

          .ant-empty,
          .ant-empty-image {
            width: 100% !important;
            min-width: 100% !important;
          }
        }
      }
    }

    ::v-deep(.ant-checkbox-wrapper-disabled) {
      .ant-checkbox-inner::after {
        border-color: rgb(0 0 0 / 0%);
      }
    }
  }

  .hid-btn {
    ::v-deep(.ant-table-title) {
      display: none !important;
    }
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }
</style>
