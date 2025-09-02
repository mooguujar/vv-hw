<template>
  <main>
    <BasicModal
      v-bind="$attrs"
      :width="800"
      :centered="true"
      :title="t('search.finance.finance_commission_choose')"
      :canFullscreen="false"
      @register="registerModal"
    >
      <template v-for="item in currentBusinessTypeList" :key="item.style">
        <div class="nav-bg w-full px-4 py-4">{{ item.name }}</div>
        <div class="py-4 content">
          <a-checkbox-group
            :options="item.styleList"
            v-model:value="item.checkedList"
            @change="onChangeTypeCheck($event)"
          >
            <template #label="{ label }">
              <span>{{ label }}</span>
            </template>
          </a-checkbox-group>
        </div>
      </template>

      <template #footer>
        <a-button @click="resetPicked">{{ t('common.resetText') }}</a-button>
        <a-button type="primary" @click="confirmPickedTypes">{{ t('common.okText') }}</a-button>
      </template>
    </BasicModal>
  </main>
</template>
<script lang="ts">
  import { defineComponent, ref, Ref, onMounted, toRaw, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getTransactiontype } from '/@/api/sys/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { CheckboxGroup } from 'ant-design-vue';

  export default defineComponent({
    name: 'BusinessTypeModal',
    components: { BasicModal, [CheckboxGroup.name]: CheckboxGroup },
    emits: ['register', 'comfirmBusinessTypesPicked'],
    setup(_, context) {
      const resetFlag: Ref<boolean> = ref(false);
      const businessTypesList = ref<any>([]);
      const currentBusinessTypeList = ref<any>([]);
      const type = ref('');
      const { t } = useI18n();

      watch(type, () => {
        resetPicked();
        if (type.value) {
          currentBusinessTypeList.value = businessTypesList.value.filter(
            (item: any) => item.style === type.value,
          );
        } else {
          currentBusinessTypeList.value = businessTypesList.value;
        }
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        type.value = data.type;
        setModalProps({ confirmLoading: false });
      });

      const fetchBusinessTypeList = async () => {
        const list = await getTransactiontype();
        const translate = (list) => {
          const newList = list.map((item) => {
            item.label = item.name;
            item.value = item.id;
            item.style = item.id;
            item.checkedList = [];
            if (item.list) {
              item.styleList = translate(item.list);
            }
            return toRaw(item);
          });
          return newList;
        };
        businessTypesList.value = translate(list);
        currentBusinessTypeList.value = businessTypesList.value;
      };

      const changeBusinessTypesPicked = (data, list: string[]) => {
        data.checkedList = list;
      };

      const confirmPickedTypes = () => {
        setModalProps({ confirmLoading: true });
        toRaw(currentBusinessTypeList.value);
        const pickedList = [];
        const getPickedList = (list) => {
          list.forEach((item: any) => {
            if (item.checkedList.length) {
              pickedList.push(...item.checkedList);
            }
            if (item.styleList) {
              getPickedList(item.styleList);
            }
          });
        };
        getPickedList(currentBusinessTypeList.value);
        context.emit('comfirmBusinessTypesPicked', pickedList);
        setModalProps({ confirmLoading: false });
        closeModal();
      };

      const resetPicked = () => {
        resetFlag.value = !resetFlag.value;
        const getPickedList = (list) => {
          list.forEach((item: any) => {
            item.checkedList = [];
            if (item.styleList) {
              getPickedList(item.styleList);
            }
          });
        };
        getPickedList(currentBusinessTypeList.value);
        context.emit('comfirmBusinessTypesPicked', []);
      };

      function onChangeTypeCheck(value: string[]): void {}

      onMounted(() => {
        fetchBusinessTypeList();
      });

      return {
        registerModal,
        resetPicked,
        confirmPickedTypes,
        changeBusinessTypesPicked,
        resetFlag,
        businessTypesList,
        currentBusinessTypeList,
        onChangeTypeCheck,
        t,
      };
    },
  });
</script>

<style lang="less" scoped>
  .nav-bg {
    background-color: @header-bg-100;
  }
</style>
