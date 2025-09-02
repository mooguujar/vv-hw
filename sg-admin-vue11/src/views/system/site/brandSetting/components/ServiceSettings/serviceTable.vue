<template>
  <div class="mt-20px mb-20px service-table">
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #action="{ column, record }">
        <template v-if="!isReadOnly">
          <TableAction :actions="createActions(record, column)" />
        </template>
      </template>
    </BasicTable>
    <Button
      block
      class="table-add mt-5 !text-xs h-40px! leading-[40px]! flex! justify-center items-center"
      type="dashed"
      preIcon="gala:add"
      @click="handleAdd"
      v-if="!isReadOnly && !isControlValueSet()"
    >
      {{ t('modalForm.system.system_add_service') }}
    </Button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, inject, ref, toRefs, watch } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Button } from '/@/components/Button';
  import { openConfirmBoolean, openConfirm } from '/@/utils/confirm';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

  const { t } = useI18n();

  export default defineComponent({
    components: { BasicTable, TableAction, Button },
    props: {
      dataList: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const isReadOnly = inject('isReadOnly', false);
      const { dataList } = toRefs(props);
      const onEditRecord = ref({} as EditRecordRow);
      function checkNativeKF(checked: boolean) {
        if (checked) {
          openConfirmBoolean(
            t('common.warning'),
            t('common.nativeKF_confim'),
            function () {
              // 确认回调
            },
            function () {
              // 取消回调
              const data = getDataSource();
              data.map((el) => {
                if (el.id === onEditRecord.value.id) {
                  el.nativeKF = false;
                  el.key = `${Date.now()}`;
                }
              });
              setTableData([...data]);
            },
            'noCancelButton',
          );
        }
      }
      const columns: BasicColumn[] = [
        {
          title: t('table.system.system_index_table'),
          dataIndex: 'id',
          editRow: false,
          width: 80,
        },
        {
          title: t('table.common.system_service_link'),
          dataIndex: 'url',
          editRow: true,
          editRule: true,
        },
        {
          title: t('table.system.remark'),
          dataIndex: 'remark',
          editRow: true,
        },
        {
          title: t('common.native_service'),
          dataIndex: 'nativeKF',
          editRow: true,
          editValueMap: (value) => {
            return value == 1 ? t('table.common.activate') : t('table.common.deactivate');
          },
          editComponent: 'Switch',
          editComponentProps: {
            onChange(checked: boolean) {
              checkNativeKF(checked);
            },
            size: 'large',
          },
        },
        {
          title: t('table.system.system_table_header_status'),
          dataIndex: 'state',
          editRow: true,
          editComponent: 'Switch',
          editValueMap: (value) => {
            return value == 1 ? t('table.common.activate') : t('table.common.deactivate');
          },
          editComponentProps: {
            onChange(checked: boolean) {},
            size: 'large',
          },
        },
      ];
      useAutoTableLabelWidth(columns);
      const [registerTable, { getDataSource, setTableData }] = useTable({
        columns: columns,
        showIndexColumn: false,
        bordered: true,
        dataSource: dataList.value,
        actionColumn: {
          width: 160,
          title: t('table.system.operate'),
          dataIndex: 'action',
          ifShow: !isControlValueSet(),
          slots: { customRender: 'action' },
        },
        scroll: { y: '100%' },
        pagination: false,
      });
      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        // openConfirm(t('common.warning'), '是否取消编辑？', () => {

        record.onEdit?.(false);
        if (record.isNew) {
          const data = getDataSource();
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
          data.map((el, index) => {
            el.id = index + 1;
          });
        }

        // },'noCancelButton');
      }
      function handleDelete(record: EditRecordRow) {
        openConfirm(
          t('common.warning'),
          t('table.google.report_columns_APP_delete_msg'),
          () => {
            record.onEdit?.(false);
            const data = getDataSource();
            const index = data.findIndex((item) => item.key === record.key);
            data.splice(index, 1);
            data.map((el, index) => {
              el.id = index + 1;
            });
          },
          'noCancelButton',
        );
      }

      function handleSave(record: EditRecordRow) {
        record.onEdit?.(false, true);
      }

      function handleEditChange(data: Recordable) {
        onEditRecord.value = data.record;
      }

      function handleAdd() {
        const data = getDataSource();
        const addRow: EditRecordRow = {
          url: '',
          remark: '',
          status: '',
          id: data.length + 1,
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        };
        data.push(addRow);
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: t('common.editorText'),
              onClick: handleEdit.bind(null, record),
            },
            {
              label: t('common.delText'),
              onClick: handleDelete.bind(null, record),
            },
          ];
        }
        return [
          {
            label: t('common.sure'),
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: t('common.cancelText'),
            onClick: handleCancel.bind(null, record, column),
          },
        ];
      }

      watch(
        () => props.dataList,
        (val) => {
          // 确保val确实是一个数组
          if (Array.isArray(val)) {
            // 创建一个新数组来存放更新后的数据
            const newData = val.map((el, index) => ({
              ...el, // 复制原来的对象
              id: index + 1, // 更新id
            }));
            setTableData(newData);
          }
        },
        { deep: true },
      );

      return {
        registerTable,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
        handleEditChange,
        isReadOnly,
        t,
        isControlValueSet,
      };
    },
  });
</script>
<style lang="less" scoped>
  .service-table {
    width: calc(100% - 5px) !important;
  }

  ::v-deep(.ant-spin-container) {
    .vben-editable-cell__wrapper > input {
      height: 40px;
    }
  }
</style>
