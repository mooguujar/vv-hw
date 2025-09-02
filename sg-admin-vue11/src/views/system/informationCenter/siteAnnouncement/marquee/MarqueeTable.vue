<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: $t('business.common_detail'), //详情
              icon: 'clarity:note-edit-line',
              onClick: handleDetail.bind(null, record),
              ifShow: isControlValueSet() ? true : isHasAuth('70915'),
            },
            {
              label: $t('common.editorText'), //编辑
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              ifShow: isControlValueSet() ? false : isHasAuth('70513'),
            },
            {
              label: $t('common.delText'), //删除
              icon: 'ant-design:delete-outlined',
              color: 'error',
              onClick: handleDelete.bind(null, record.id),
              ifShow: isControlValueSet() ? false : isHasAuth('70513'),
            },
          ]"
        />
      </template>
    </BasicTable>
    <AddMarqueeModal @register="register" />
    <MarqueeModalDetail @register="registerDetail" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './marqueeTableData';
  import eventBus from '/@/utils/eventBus';
  import { ADDraggableRow } from '/@/utils';
  import { message } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import { marquee_delete, marquee_list, marquee_sort } from '/@/api/sys';
  import AddMarqueeModal from './AddMarqueeModal.vue';
  import MarqueeModalDetail from './MarqueeModalDetail.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  type Recordable<T = any> = Record<string, T>;

  export default defineComponent({
    name: 'MarqueeTable',
    components: {
      BasicTable,
      TableAction,
      PageWrapper,
      AddMarqueeModal,
      MarqueeModalDetail,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(400).value);
      let tableSearchParam = ref<any>({});

      let dataSource = ref<any>([]);
      /**
       * 移动后回调函数
       * @param dataSource 数据源
       * @param target 移动后下标
       * @param source 移动前下标
       * style 1-动漫 2-漫画 3-图片 4-小说 5-有声小说 6-视频
       */
      async function sortTable(targetWork, tempSource) {
        if (!targetWork && !tempSource) {
          return;
        }
        //TODO 分类id  专题上一个id 下一个id
        let param = {
          index_id: targetWork.id,
          notice_type: 2, // 类型(1-公告,2-跑马灯)
          id: tempSource.id, // 广告Id
          sort_before: tempSource.seq,
          sort_after: targetWork.seq,
        };
        try {
          const { status, data } = await marquee_sort(param);
          if (status) {
            message.success(data);
          } else {
            message.error(data);
          }
          reload();
        } catch (e) {
          console.error(e);
        }
      }
      const [register, { openModal: openAdd }] = useModal();

      const [registerDetail, { openModal: openDetail }] = useModal();

      const [registerTable, { reload, setTableData }] = useTable({
        customRow: (record, index) => {
          return isHasAuth('70518')
            ? ADDraggableRow(dataSource.value, index, setTableData, sortTable)
            : (onclick = () => {});
        },
        api: getData,
        columns,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          minWidth: 200,
          title: t('business.common_operate'), //操作
          dataIndex: 'action',
          fixed: false,
          slots: { customRender: 'action' },
          ifShow: isControlValueSet() ? true : auths(['70915', '70513']),
        },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          actionColOptions: {
            class: 't-form-col',
            xxl: 11,
            xl: 11,
            lg: 11,
          },
          submitButtonOptions: {
            text: t('common.queryText'),
          },
          showResetButton: false,
        },
        useSearchForm: false,
        beforeFetch: (tableParams: Recordable) => {
          return Object.assign(tableParams, tableSearchParam.value);
        },
        afterFetch: (data) => {
          data = data.map((item) => parseData(item));
          dataSource.value = data;
        },
      });

      onBeforeMount(() => {
        eventBus.off('marqSearchSubmit');
      });

      onMounted(() => {
        eventBus.on('marqSearchSubmit', (value) => {
          tableSearchParam.value = value;
          handleSuccess();
        });
      });

      let parseData = (record) => {
        try {
          typeof record.content === 'string' ? (record.content = JSON.parse(record.content)) : '';
          typeof record.title === 'string' ? (record.title = JSON.parse(record.title)) : '';
          record.client =
            typeof record.client === 'string' ? record.client.split(',') : record.client;
        } catch (e) {
          console.error(e);
        }
        return record;
      };

      function handleEdit(record: Recordable): void {
        record = parseData(record);
        openAdd(true, record);
      }

      function handleDetail(record: Recordable): void {
        openDetail(true, record);
      }

      function handleDelete(id: any) {
        //操作确认, 是否进行删除操作？删除后无法恢复
        openConfirm(
          t('table.member.member_oprate_tip'),
          t('table.system.system_option_delete_tip'),
          () => {
            deleteRecord(id);
          },
        );
      }

      function getData(tableParams: { rows: number; page: number }): Promise<any> {
        return marquee_list({ ...tableParams, notice_type: 2 });
      }

      async function deleteRecord(id: number): Promise<void> {
        try {
          const { status, data } = await marquee_delete({ id, notice_type: 2 });
          if (status) {
            message.success(data);
            reload();
          } else {
            message.error(data);
          }
        } catch (e) {
          console.loerrorg(e);
        }
      }

      function handleSuccess() {
        reload();
      }
      return {
        registerTable,
        reload,
        handleEdit,
        handleDelete,
        register,
        handleSuccess,
        registerDetail,
        handleDetail,
        isHasAuth,
        isControlValueSet,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.app-iconify) {
    svg {
      display: none;
    }
  }

  ::v-deep(.app-iconify)::after {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    background-image: url('/@/assets/svg/drag.svg');
  }

  ::v-deep(.vben-basic-table-action) {
    .app-iconify {
      display: none !important;
    }
  }

  ::v-deep(.ant-switch-inner) {
    color: transparent !important;
  }
</style>
