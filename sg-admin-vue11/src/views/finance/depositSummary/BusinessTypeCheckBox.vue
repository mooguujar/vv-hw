<template>
  <div class="flex">
    <div class="py-4 px-5">
      <a-checkbox
        v-model:checked="checkboxState.checkAll"
        :indeterminate="checkboxState.indeterminate"
        @change="onCheckAllChange($event)"
      >
        {{ businessName }}:
      </a-checkbox>
    </div>
    <div class="py-4 content">
      <a-checkbox-group
        v-model:value="checkboxState.checkedList"
        @change="onChangeTypeCheck($event)"
        :options="businessTypes"
      >
        <template #label="{ label }">
          <span>{{ label }}</span>
        </template>
      </a-checkbox-group>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { Checkbox, CheckboxGroup, FormItemRest } from 'ant-design-vue';

  interface BusinessTypeOption {
    value: number;
    label: string;
  }

  export default defineComponent({
    name: 'BusinessTypeCheckbox',
    components: {
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [FormItemRest.name]: FormItemRest,
    },
    props: {
      businessName: {
        type: String,
        default: '',
      },
      businessTypeOptions: {
        type: Array as () => BusinessTypeOption[],
        default: () => [],
      },
      resetFlag: {
        type: Boolean,
      },
    },
    emits: ['changeBusinessTypesPicked'],
    setup(props, context) {
      const businessTypes = ref<BusinessTypeOption[]>(
        props.businessTypeOptions.filter((item: any) => item.attr !== '4'),
      );

      const checkboxState = reactive({
        indeterminate: false,
        checkAll: false,
        checkedList: [],
      });

      function onCheckAllChange(e: any): void {
        Object.assign(checkboxState, {
          checkedList: e.target.checked ? businessTypes.value.map((el) => el.value) : [],
          indeterminate: false,
        });
        context.emit(
          'changeBusinessTypesPicked',
          e.target.checked ? businessTypes.value.map((el) => el.value) : [],
        );
      }

      function onChangeTypeCheck(value: string[]): void {
        context.emit('changeBusinessTypesPicked', value);
      }

      watch(
        () => checkboxState.checkedList,
        (val) => {
          checkboxState.indeterminate = !!val.length && val.length < businessTypes.value.length;
          checkboxState.checkAll = val.length === businessTypes.value.length;
        },
      );

      watch(
        () => props.resetFlag,
        () => {
          checkboxState.indeterminate = true;
          checkboxState.checkAll = false;
          checkboxState.checkedList = [];
        },
      );

      return {
        checkboxState,
        onCheckAllChange,
        onChangeTypeCheck,
        businessTypes,
      };
    },
  });
</script>
<style scoped>
  .type-name {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 15px;
    background: #f2f2f2;
  }

  .content {
    width: 650px;
  }

  ::v-deep(.ant-checkbox-group-item) {
    width: 150px;
    margin-bottom: 8px;
  }
</style>
