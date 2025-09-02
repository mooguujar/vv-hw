<template>
  <div>
    <!--    <BasicTable @register="registerTable" class="!p-0">-->
    <!--      <template #form-settingBind>-->
    <!--        <div class="gtag_gtm_box">-->
    <!--          <div style="width: 40%">-->
    <!--            <p class="gtag_gtm_box_title">-->
    <!--              <span>大厅推广渠道/代理链接</span><span class="!ml-3 primary-color cursor" @click="creatChannel">创建渠道</span>-->
    <!--            </p>-->
    <!--            <Input-->
    <!--              style="width: 100%"-->
    <!--              allowClear-->
    <!--              :placeholder="'请输入推广渠道/代理链接，例：https://222.baidu.com/home?cid=111s'"-->
    <!--              v-model:value="fromSearch"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div style="width: 30%; margin-left: 15px">-->
    <!--            <p class="gtag_gtm_box_title">-->
    <!--              <span>TikTok Pixel ID(从TikTok后台获取，详见以下教程)</span>-->
    <!--            </p>-->
    <!--            <Input-->
    <!--              style="width: 100%"-->
    <!--              allowClear-->
    <!--              placeholder="请输入TikTok Pixel ID ，例：66666666666"-->
    <!--              v-model:value="fromSearch"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div style="margin-left: 15px">-->
    <!--            <p class="gtag_gtm_box_title">&nbsp;</p>-->
    <!--            <Button type="primary">绑定</Button>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--      <template #action="{ record, column }">-->
    <!--        <TableAction :actions="createActions(record, column)" />-->
    <!--      </template>-->
    <!--      <template #form-currentType>-->
    <!--        <FormItemRest>-->
    <!--          <InputGroup class="!flex" compact>-->
    <!--            <Select style="width: 38%" v-model:value="currentType">-->
    <!--              <SelectOption :value="'content'">绑定链接</SelectOption>-->
    <!--              <SelectOption :value="'updated_name'">Pixel ID</SelectOption>-->
    <!--            </Select>-->
    <!--            <Input-->
    <!--              style="width: 59%"-->
    <!--              allowClear-->
    <!--              :placeholder="$t('common.inputText')"-->
    <!--              v-model:value="fromSearch"-->
    <!--            />-->
    <!--          </InputGroup>-->
    <!--        </FormItemRest>-->
    <!--      </template>-->
    <!--      <template #form-startDate="{ model, field }">-->
    <!--        <DatePicker-->
    <!--          v-model:value="model[field]"-->
    <!--          :disabledDate="disabledStartDate"-->
    <!--          @change="onStartDateChange"-->
    <!--        />-->
    <!--      </template>-->
    <!--      <template #form-endDate="{ model, field }">-->
    <!--        <DatePicker-->
    <!--          v-model:value="model[field]"-->
    <!--          :disabledDate="disabledEndDate"-->
    <!--          @change="onEndDateChange"-->
    <!--        />-->
    <!--      </template>-->
    <!--    </BasicTable>-->
    <Specification />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    EditRecordRow,
    BasicColumn,
    ActionItem,
  } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    DatePicker,
    FormItemRest,
    message,
    RadioGroup,
    RadioButton,
  } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { getRiskBlackList, deletRiskBlack } from '/@/api/risk';
  // import AddIpModal from '../../common/components/addIpModal.vue';
  import Specification from './specification.vue';
  import { useModal } from '/@/components/Modal';
  import dayjs from 'dayjs';
  import { openConfirm } from '/@/utils/confirm';
  import { setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const $router = useRouter();
  const { t } = useI18n();
  const fromSearch = ref('' as string);
  const checkboxActive = ref([] as any);
  const currentType = ref('content' as string);
  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
  };

  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };
  const [registerTable, { getDataSource, reload, clearSelectedRowKeys, getColumns, setColumns }] =
    useTable({
      api: getRiskBlackList,
      columns: columns,
      bordered: true,
      useSearchForm: true,
      showIndexColumn: false,
      formConfig: {
        schemas,
        showAdvancedButton: false,
        actionColOptions: {
          class: 't-form-col',
          xxl: 11,
          xl: 11,
          lg: 11,
        },
        showResetButton: false,
      },
      beforeFetch: (params) => {
        setDateParmas(params);
        params[currentType.value] = fromSearch.value;
        return params;
      },
      afterFetch: () => {
        clearSelectedRowKeys();
      },
    });
  function handleEdit(record: EditRecordRow) {
    record.onEdit?.(true);
  }
  function handleDelete(record: EditRecordRow) {
    record.onEdit?.(false);
    const data = getDataSource();
    const index = data.findIndex((item) => item.key === record.key);
    data.splice(index, 1);
  }
  function handleSave(record: EditRecordRow) {
    record.onEdit?.(false, true);
  }
  function handleCancel(record: EditRecordRow) {
    record.onEdit?.(false);
    if (record.isNew) {
      const data = getDataSource();
      const index = data.findIndex((item) => item.key === record.key);
      data.splice(index, 1);
    }
  }
  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
        },
        {
          label: '删除',
          onClick: handleDelete.bind(null, record),
        },
      ];
    } else {
      return [
        {
          label: '保存',
          onClick: handleSave.bind(null, record, column),
        },
        {
          label: '取消',
          popConfirm: {
            title: '是否取消编辑',
            confirm: handleCancel.bind(null, record, column),
          },
        },
      ];
    }
  }
  function showConfirm(params) {
    // '操作确认'，'您确定删除该IP地址吗？'
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.risk.report_ip_address_remove_tip'),
      async () => {
        try {
          const { status, data } = await deletRiskBlack(params);
          if (status) {
            message.success(data);
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
    );
  }
  function creatChannel() {
    $router.push({
      name: 'channelManagement',
    });
  }
  function handleModalSuccess() {
    reload();
  }
</script>
<style scoped>
  .gtag_gtm_box {
    width: 80vw;
    background-color: rgba(242, 242, 242, 1);
    padding: 15px;
    display: flex;
    .gtag_gtm_box_title {
      font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      text-align: center;
    }
  }
</style>
