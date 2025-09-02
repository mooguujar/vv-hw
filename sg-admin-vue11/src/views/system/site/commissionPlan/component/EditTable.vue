<template>
  <BasicTable @register="Table[0]" @edit-change="onEditChange">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action' && !isReadOnly">
        <TableAction :actions="createActions(record, column)" />
      </template>
    </template>
  </BasicTable>
  <a-button
    v-if="!isReadOnly"
    :size="FORM_SIZE"
    preIcon="mdi:plus"
    color="primary"
    ghost
    block
    @click="addCustomerServiceTable"
  >
    {{ buttonText }}
  </a-button>
</template>

<script lang="ts" setup>
  import { ref, inject } from 'vue';
  import { uniqueId } from 'lodash-es';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  import {
    BasicTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const { createMessage } = useMessage();

  const isReadOnly = inject('isReadOnly', false);

  const props = defineProps({
    buttonText: {
      type: String,
      default: '',
    },
    Table: {
      type: Array,
      default: () => [],
    },
    tableColumns: {
      type: Array,
      default: () => [],
    },
    isModal: {
      type: Boolean,
      default: false,
    },
  });

  const currentEditKeyRef = ref('');
  const saveText = t('common.saveText');
  const cancelText = t('common.cancelText');
  const createActions = (record: EditRecordRow, column: BasicColumn): ActionItem[] => {
    if (!record.editable) {
      return [
        {
          label: t('business.common_edit'),
          onClick: handleEdit.bind(null, record),
        },
        {
          label: t('common.delText'),
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleRemove.bind(null, record),
        },
      ];
    }
    return [
      {
        label: saveText, //保存
        onClick: handleSave.bind(null, record),
      },
      {
        label: cancelText, //取消
        onClick: handleCancel.bind(null, record),
      },
    ];
  };

  // 添加客服
  const addCustomerServiceTable = async () => {
    const tableItem = Object.fromEntries(
      props.tableColumns.map((item: any) => [item.dataIndex, '']),
    );
    const Table = props?.Table[1];
    const data = Table.getDataSource();
    const item = { ...tableItem, state: 0, editable: true, key: uniqueId() };
    data.push(item);
    handleEdit(item);
  };

  // 编辑状态改变
  const handleEdit = (record: EditRecordRow) => {
    if (record.editValueRefs && props.isModal) {
      record.editValueRefs['cashRate'] = record.editValueRefs['cashRate'].split('%')[0];
    }
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  };

  // 编辑状态改变
  const handleCancel = async (record: EditRecordRow) => {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);

    if (!record.id) {
      handleRemove(record);
    } else {
      record.onCancelEdit();
    }

    // const valid = await record.onValid?.();
    // if (valid) {
    //   record.onEdit?.(false, false);
    // } else {
    //   // handleRemove(record)
    // }
  };

  // 删除
  const handleRemove = (record: EditRecordRow) => {
    const data = props?.Table[1].getDataSource();
    const index = data.findIndex((item) => item.id === record.id);
    if (index === -1) return;
    data.splice(index, 1);
  };

  // 保存
  const handleSave = async (record: EditRecordRow) => {
    if (props.isModal) {
      if (!record.editValueRefs['cashMax']) {
        createMessage.error(t('common.enterMaximumLimit'));
        return;
      }
      if (!record.editValueRefs['cashRate']) {
        createMessage.error(t('common.enterDiscountRadio'));
        return;
      }
      record.cashRate = record.editValueRefs['cashRate'];
      record.editValueRefs['cashRate'] = `${record.editValueRefs['cashRate']}%`;
    } else {
      if (!record.editValueRefs['url']) {
        createMessage.error(t('common.enterCustomServiceLink'));
        return;
      }
    }
    for (let key in record.editValueRefs) {
      record[key] = record.editValueRefs[key];
    }

    // 校验
    const valid = await record.onValid?.();
    if (valid) {
      const pass = await record.onEdit?.(false, true);
      record.editable = false;
      if (pass) {
        currentEditKeyRef.value = '';
      }
    }
    // } else {
    //   message.error({ content: '请填写正确的数据', key: 'saving' });
    // }
  };

  const onEditChange = ({ column, value, record }) => {
    // 本例
    if (column.dataIndex === 'state') {
      record.editValueRefs.state.value = value ? 1 : 0;
    } else {
      if (record.editValueRefs[column.dataIndex]) {
        record.editValueRefs[column.dataIndex].value = value;
      }
    }
  };
</script>
