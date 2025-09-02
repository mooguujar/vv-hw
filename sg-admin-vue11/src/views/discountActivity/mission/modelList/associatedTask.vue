<template>
  <div>
    <BasicModal
      :showCancelBtn="false"
      :showOkBtn="false"
      :width="950"
      :height="600"
      @register="recordModal"
      :destroyOnClose="true"
      :title="`${t('table.member.member_receive_record_mission')}`"
    >
      <BasicForm @register="registerNewTask">
        <template #categoryTask>
          <BasicTable @register="registerTable">
            <template #activeState="{ record }">
              <Switch
                v-model:checked="record.state"
                :checkedValue="2"
                :unCheckedValue="1"
                :disabled="true"
              />
            </template>
            <template #taskName="{ record }">
              <span class="mr-2 cursor-pointer text-[#1475e1]" @click="EditFun(record)">{{
                safeParse(record.names)
              }}</span>
            </template>
            <template #cateName="{ record }">
              <div v-if="record.cate_name">{{
                JSON.parse(record.cate_name)[langBtn] ? JSON.parse(record.cate_name)[langBtn] : '-'
              }}</div>
              <div v-else>-</div>
            </template>
          </BasicTable>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { h, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './addClassify.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getRelatedList } from '/@/api/mission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
  import { toTimezone } from '/@/utils/dateUtil';
  import { Switch } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';

  const currentLanguage = useLocaleStoreWithOut();
  const { t } = useI18n();

  const result = ref();
  const $router = useRouter();
  const langBtn = ref(currentLanguage.getLocale);

  const [recordModal] = useModalInner((data) => {
    result.value = data;
    setFieldsValue({ category_name: JSON.parse(data.category_name)[langBtn.value] });
  });

  const FORM_SIZE = useFormSetting().getFormSize;

  const [registerNewTask, { setFieldsValue }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    size: FORM_SIZE as any,
  });

  const [registerTable] = useTable({
    api: getRelatedList,
    style: { width: '750px', 'overflow-x': 'scroll' },
    columns: [
      {
        title: t('table.discountActivity.missain_ty_1'), //ID
        dataIndex: 'id',
        minWidth: 50,
      },
      {
        title: t('table.discountActivity.task_name'), //分类名称
        dataIndex: 'task_name',
        minWidth: 80,
        slots: { customRender: 'taskName' },
      },
      {
        title: t('table.discountActivity.missain_ty'), //关联任务
        dataIndex: 'ty',
        minWidth: 80,
        customRender: ({ record }) => {
          //任务类型 1.注册,2.下载,3.验证,4.存款,5.投注
          return record.ty == 1
            ? t('table.report.report_reg')
            : record.ty == 2
            ? t('sys.login.download')
            : record.ty == 3
            ? t('common.verify')
            : record.ty == 4
            ? t('table.report.report_deposit')
            : t('table.report.report_bet');
        },
      },
      {
        title: t('table.discountActivity.task_category'), //任务分类
        dataIndex: 'cate_name',
        minWidth: 100,
        slots: { customRender: 'cateName' },
        componentProps: {
          getPopupContainer: () => document.body,
        },
      },
      {
        title: `${t('business.common_period_start')}\n${t('business.common_period_end')}`, //关联任务
        dataIndex: 'start_at',
        minWidth: 170,
        customRender: ({ record }) => {
          return h(cdBlockTwoline, {
            line1: record.start_at ? toTimezone(record.start_at, 'YYYY-MM-DD HH:mm:ss') : '-',
            line2: record.end_at ? toTimezone(record.end_at, 'YYYY-MM-DD HH:mm:ss') : '-',
          });
        },
      },
      {
        title: t('table.discountActivity.task_status'), //关联任务
        dataIndex: 'state',
        minWidth: 80,
        slots: { customRender: 'activeState' },
      },
    ],
    bordered: true,
    useSearchForm: false,
    showIndexColumn: false,
    rowKey: 'id',
    beforeFetch: (params) => {
      params['cate_id'] = result.value['id'];
      return params;
    },
  });
  function EditFun(record: any) {
    record.start_at = toTimezone(record.start_at, 'YYYY-MM-DD HH:mm:ss');
    record.end_at = toTimezone(record.end_at, 'YYYY-MM-DD HH:mm:ss');
    $router.push({
      name: 'Insertmission',
      state: { id: record.id, data: JSON.stringify(record), type: 3 },
    });
  }

  function safeParse(names) {
    try {
      const parsed = JSON.parse(names);
      return parsed[langBtn.value] || ''; // 返回中文名或空字符串
    } catch (e) {
      console.error('JSON parse error:', e);
      return ''; // 返回空字符串以避免异常
    }
  }
</script>
