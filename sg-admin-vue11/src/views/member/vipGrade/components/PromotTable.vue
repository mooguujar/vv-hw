<template>
  <header v-if="auths(['10512', '10513', '10514'])">
    <div v-if="!editStatus" :size="10" class="toolbar-box">
      <Button type="primary" @click="editDataSource">{{ t('common.editorText') }}</Button>
    </div>
    <div v-else class="toolbar-box save-toolbar-box">
      <Button class="savaButton" type="primary" v-if="isHasAuth('10512')" @click="editDataSave">{{
        t('common.saveText')
      }}</Button>
      <Button class="ml-12px" @click="editDataCancel(true)">{{ t('common.cancelText') }}</Button>
    </div>
  </header>
  <vxe-table
    stripe
    border
    :min-height="400"
    :data="tableData"
    :cell-config="{ height: 60 }"
    :header-cell-config="{ height: 60 }"
    :virtual-x-config="{ enabled: true, gt: 0 }"
  >
    <template v-for="item in columns" :key="item.field">
      <!-- 插槽列 -->
      <!-- <vxe-column v-else v-bind="item">
        <template #default="scope">
          <slot :name="item.field" v-bind="scope"></slot>
        </template>
      </vxe-column> -->
      <vxe-column
        v-if="item.editRow"
        v-bind="item"
        :min-width="item.minWidth"
        :edit-render="{ name: 'input' }"
      >
        <template #header="{ column }">
          <div
            >{{ column.title }}
            <cdIconCurrency :id="item.currenty" class="w-22px ml-4px" />
          </div>
        </template>
        <template #default="{ row }" v-if="editStatus">
          <InputNumber v-model:value="row[item.field]" :min="0" :stringMode="true" />
        </template>
        <template #default="{ row }" v-else>
          <span>{{ row[item.field] }}</span>
          <cdIconCurrency :id="item.currenty" class="w-18px ml-4px" />
        </template>
      </vxe-column>
      <vxe-column v-else-if="item.field === 'level'" v-bind="item" :min-width="item.minWidth">
        <template #default="{ row }"> VIP{{ row.level }} </template>
      </vxe-column>
      <vxe-column v-else v-bind="item" :min-width="item.minWidth" />
    </template>
  </vxe-table>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, inject } from 'vue';
  import 'vxe-table/lib/style.css';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { message, Button, InputNumber } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { getPrizeLevelList, updateVipPrize } from '@/api/member/index';

  import { getBonusColumn } from '../vipGrade.data';
  import { auths, isHasAuth } from '@/utils/authFunction';

  const { t } = useI18n();
  const currencyId = ref('');
  const cashTypeId = ref('818');
  const editStatus = ref(false);
  const tableData = ref([]);
  const initData = ref([]);
  const columns = ref([]);
  const baseForm = inject<Function>('reloadTableData');
  const baseData = computed(() => {
    return baseForm();
  });

  /** 获取奖金配置列表 */
  const getPrizeData = async () => {
    const { currencies, prizes: data } = await getPrizeLevelList({ cash_type: cashTypeId.value });
    columns.value = getBonusColumn(currencies, cashTypeId);
    initData.value = cloneDeep(data);
    tableData.value = data;
  };

  /**
   取消
   */
  function editDataCancel(type?: boolean) {
    if (type) {
      tableData.value = initData.value;
    }
    editStatus.value = false;
  }
  /**
   * 编辑
   */
  function editDataSource() {
    if (!isHasAuth('10512')) {
      return;
    }
    editStatus.value = true;
  }

  async function editDataSave() {
    const getDate = tableData.value.map((item: any) => {
      const newObj = {};
      for (const key in item) {
        newObj[key] = item[key] || '0.00';
      }
      const row = {
        ...newObj,
        cash_type: Number(cashTypeId.value),
        level: item.level,
      };
      delete row['is_delete'];
      delete row['_X_ROW_KEY'];
      return row;
    });
    const { data, status } = await updateVipPrize(getDate);
    if (status) {
      message.success(data);
      editDataCancel();
      getPrizeData();
    } else {
      message.error(data);
    }
  }

  watch(
    () => baseData.value.baseKey,
    (n, o) => {
      currencyId.value = baseData.value.baseData.filter(
        (p) => p.ty === 10 && p.key === 'currency',
      )[0].value;
      getPrizeData();
    },
    {
      immediate: true,
    },
  );
</script>
<style lang="less" scoped>
  header {
    position: absolute;
    width: 100%;

    > .toolbar-box {
      position: absolute;
      top: -140px;
      right: 80px;
    }
  }
</style>
