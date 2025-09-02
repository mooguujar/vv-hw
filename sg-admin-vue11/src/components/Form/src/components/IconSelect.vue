<template>
  <Select
    v-bind="$attrs"
    @change="handleChange"
    :dropdown-match-select-width="false"
    v-model:value="state"
    option-label-prop="children"
  >
    <template v-if="showImg">
      <SelectOption v-for="item of getOptions" :key="item.value" :value="item.value">
        <div style="display: flex">
          <div class="w-18px h-18px mr-1 -mt-1px">
            <img :src="item.img" alt="" style="width: 18px" />
          </div>
          {{ item.label }}
        </div>
      </SelectOption>
    </template>
    <template v-else>
      <SelectOption v-for="item of getOptions" :key="item.value" :value="item.value">
        <cdIconCurrency :icon="currentyOptions[item.value]" class="w-18px mt--3px mr-1" />{{
          item.label
        }}
      </SelectOption>
    </template>
    <!-- <template #option="{ label, value, img }">
      <div style="display: flex">
        <template v-if="showImg">
          <img :src="img" class="w-18px h-18px" />
        </template>
        <template v-else>
          <div v-if="value">
            <cdIconCurrency :icon="currentyOptions[value]" class="w-18px mt--2px" />
          </div>
          <div v-else class="w-18px"></div>
        </template>
        <div class="ml-5px"
          ><span>{{ label }}</span></div
        >
      </div>
    </template> -->
  </Select>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, computed, unref, watch } from 'vue';
  import { Select, SelectOption } from 'ant-design-vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';
  import { get, omit } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { currentyOptions } from '/@/views/common/commonSetting';

  type OptionsItem = { label: string; value: string; disabled?: boolean };

  export default defineComponent({
    name: 'IconSelect',
    components: {
      Select,
      LoadingOutlined,
      cdIconCurrency,
      SelectOption,
    },
    inheritAttrs: false,
    props: {
      value: [Array, Object, String, Number],
      numberToString: propTypes.bool,
      params: propTypes.any.def({}),
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('label'),
      valueField: propTypes.string.def('value'),
      immediate: propTypes.bool.def(true),
      alwaysLoad: propTypes.bool.def(false),
      options: propTypes.array.def([]),
      showImg: propTypes.bool.def(false),
    },
    emits: ['options-change', 'change', 'update:value'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([]);
      const loading = ref(false);
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const { t } = useI18n();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);
      const getOptions = computed(() => {
        let data = unref(options).reduce((prev, next: any) => {
          if (next) {
            const { labelField, valueField, numberToString } = props;
            const value = get(next, valueField);
            prev.push({
              ...omit(next, [labelField, valueField]),
              label: get(next, labelField),
              value: numberToString ? `${value}` : value,
            });
          }
          return prev;
        }, [] as OptionsItem[]);
        return data.length > 0 ? data : props.options;
      });

      watch(
        () => state.value,
        (v) => {
          emit('update:value', v);
        },
      );

      function emitChange() {
        emit('options-change', unref(getOptions));
      }

      function handleChange(_, ...args) {
        emitData.value = args;
        emit('change', state.value, ...args);
      }

      return { state, attrs, getOptions, loading, t, handleChange, currentyOptions };
    },
  });
</script>
