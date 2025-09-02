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
    :loading="loading"
    border
    :min-height="400"
    :data="tableData"
    :cell-config="{ height: 60 }"
    :header-cell-config="{ height: 60 }"
  >
    <template #loading>
      <div class="ant-spin-nested-loading h-400px">
        <div>
          <div class="ant-spin ant-spin-spinning">
            <span class="ant-spin-dot ant-spin-dot-spin">
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-for="item in column" :key="item.field">
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
        <template #default="{ row }" v-if="editStatus">
          <InputNumber v-model:value="row[item.field]" :stringMode="true" :min="0" />
        </template>
        <template #default="{ row }" v-else>
          <span>{{ row[item.field] }}</span>
          <cdIconCurrency :id="currencyId" class="w-18px ml-4px" />
        </template>
      </vxe-column>
      <vxe-column v-else-if="item.field === 'level'" v-bind="item" :min-width="item.minWidth">
        <template #default="{ row }"> VIP{{ row.level }} </template>
      </vxe-column>
      <vxe-column
        v-slot="{ row }"
        v-else-if="item.field === 'total'"
        v-bind="item"
        :min-width="item.minWidth"
      >
        <router-link
          v-if="row.total > 0 && isHasAuth('10100')"
          :to="{
            path: '/member/inquiryMember',
            query: { vipLevel: String(row.level) },
          }"
          class="member-number"
          >{{ row.total }}
        </router-link>
        <soan v-else>0</soan>
      </vxe-column>
      <vxe-column v-else-if="item.field === 'is_default'" v-bind="item" :min-width="item.minWidth">
        <template #default="{ row }">
          <span :style="{ color: row.is_default === 1 ? '#1cd91c' : '' }">
            {{ row.is_default === 1 ? t('business.common_yes') : t('business.common_no') }}
          </span>
        </template>
      </vxe-column>
      <vxe-column v-else-if="item.field === 'oper'" v-bind="item" :min-width="item.minWidth">
        <template #default="{ row }">
          <div class="flex justify-center" v-if="editStatus && row.level === tableData.length - 1">
            <img
              v-if="isHasAuth('10514')"
              class="cursor-pointer"
              :src="RECT_ADD"
              alt=""
              :title="t('business.add_new') + 'VIP'"
              :style="{
                'pointer-events': 'auto',
              }"
              @click="handleAdd"
            />
            <img
              v-if="isHasAuth('10513')"
              class="cursor-pointer ml-5px"
              :src="RECT_DELETE"
              alt=""
              :title="t('common.delText')"
              :class="{ 'disabled-link': row.level === 0 }"
              :style="{
                opacity: row.level === 0 ? 0.5 : 1,
              }"
              @click="showConfirm(row, $t('table.system.system_message_delete_tip'))"
            />
          </div>
          <span v-else>-</span>
        </template>
      </vxe-column>
      <vxe-column v-else v-bind="item" :min-width="item.minWidth" />
    </template>
  </vxe-table>
  <footer>
    <BasicButton
      class="add-creat-vip"
      v-if="editStatus && isHasAuth('10514') && tableData.length === 0"
      type="dashed"
      block
      preIcon="gala:add"
      @click="handleAdd"
    >
      {{ t('business.add_new') }}VIP
    </BasicButton>
  </footer>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onBeforeMount, inject, nextTick } from 'vue';
  import 'vxe-table/lib/style.css';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message, Button, InputNumber } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import { cloneDeep } from 'lodash-es';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';
  import { auths, isHasAuth } from '@/utils/authFunction';
  import { getVipLevelList, deleteBasicVip, updateVipBase } from '@/api/member/index';

  import { getBasicColumn } from '../vipGrade.data';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';

  const baseForm = inject<Function>('reloadTableData');
  const reloadFormData = inject<Function>('reloadFormData');
  const baseData = computed(() => {
    return baseForm();
  });

  const { t } = useI18n();
  const initMaxVip = ref(0);
  const currency = ref('1');
  const currencyId = ref('');
  const loading = ref(true);
  const editStatus = ref(false);
  const tableData = ref([]);
  const initData = ref([]);
  const column = ref([]);
  async function getBasicData() {
    loading.value = true;
    column.value = getBasicColumn(2);
    const data = await getVipLevelList();
    let dataSource = data.filter((item) => item.is_delete === 2);
    initMaxVip.value = dataSource.length;
    initData.value = cloneDeep(dataSource);
    tableData.value = dataSource;
    loading.value = false;
    // }
  }
  /**新增VIP */
  function handleAdd() {
    const data = tableData.value;
    if (data.length > 100) {
      return message.error(t('common.cannot_create_over_100'));
    }
    data.push({
      level: data.length,
      total: 0,
      upgrade: '0',
      retain: '0',
      multiple: '0',
      deposit_retain: '0',
      type: 'add',
      editable: true,
    } as never);
    setTimeout(() => {
      nextTick(() => {
        const div = document.getElementsByTagName('body')[0];
        div.scrollTop = div.scrollHeight;
      });
    }, 0);
  }

  /** 确认删除 */
  function showConfirm(record, msg) {
    if (record.level === 0) {
      return;
    }
    if (record.level >= initMaxVip.value) {
      const data = tableData.value;
      data.pop();
      return;
    }

    openConfirm(t('modalForm.finance.finance_operation_confirmation'), msg, async () => {
      const { data, status } = await deleteBasicVip({
        level: record.level,
      });
      if (status) {
        message.success(data);
        if (record.level === 1) {
          editDataCancel();
          reloadFormData();
        }
        getBasicData();
      } else {
        message.error(data);
      }
    });
  }
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
  onBeforeMount(() => {
    getBasicData();
  });

  async function editDataSave() {
    const getDataModal = tableData.value;
    const getDate = getDataModal.map((item: any) => {
      return {
        is_default: item.is_default,
        total: item.total,
        level: item.level,
        upgrade: String(item.upgrade || 0),
        retain: String(item.retain || 0),
        multiple: String(item.multiple || '1'),
        deposit_retain: String(item.deposit_retain || 0),
        is_delete: 2,
      };
    });

    const parityData = getDate.find(
      (p, index) => index > 1 && Number(p.upgrade) < Number(getDate[index - 1].upgrade),
    );
    if (parityData) {
      message.error(
        t('common.promotion_code_comparison', { a: parityData.level, b: parityData.level - 1 }),
      );

      return;
    }
    const { data, status } = await updateVipBase(getDate);
    if (status) {
      message.success(data);
      editDataCancel();
      getBasicData();
    } else {
      message.error(data);
    }
  }

  watch(
    () => baseData.value.baseKey,
    (n, o) => {
      currency.value = baseData.value.baseData.filter(
        (p) => p.ty === 10 && p.key === 'mode',
      )[0].value;
      currencyId.value = baseData.value.baseData.filter(
        (p) => p.ty === 10 && p.key === 'currency',
      )[0].value;
      getBasicData();
    },
  );
</script>
<style lang="less" scoped>
  header {
    position: absolute;
    width: 100%;

    > .toolbar-box {
      position: absolute;
      top: -65px;
      right: 80px;
    }
  }

  .disabled-link {
    cursor: not-allowed;
  }
</style>
