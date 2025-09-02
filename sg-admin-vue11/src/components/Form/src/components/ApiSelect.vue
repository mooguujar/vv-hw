<template>
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :dropdown-match-select-width="false"
    v-model:value="state"
    optionLabelProp="children"
    :style="{ minWidth: width }"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template v-if="showIcon">
      <SelectOption v-for="item of getOptions" :key="item.value" :value="item.value">
        <div style="display: flex">
          <div v-if="item.value">
            <cdIconCurrency :icon="currentyOptions[item.value]" class="w-18px mt--3px" />
          </div>
          <span class="ml-3px">{{ item.label }}</span>
        </div>
      </SelectOption>
    </template>
    <template v-else>
      <SelectOption
        v-for="item of getOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      >
        <div style="display: flex">
          <span class="ml-5px truncate">{{ item.label }}</span>
        </div>
      </SelectOption>
    </template>

    <!-- <template #option="{ label, value }" v-if="showIcon">
      <div style="display: flex">
        <div v-if="value">
          <cdIconCurrency :icon="currentyOptions[value]" class="w-18px mt--2px" />
        </div>
        <div v-else class="w-18px"></div>
        <div class="ml-5px"
          ><span>{{ label }}</span></div
        >
      </div>
    </template> -->
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, computed, unref, watch } from 'vue';
  import { Select, SelectOption } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
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
    name: 'ApiSelect',
    components: {
      Select,
      LoadingOutlined,
      cdIconCurrency,
      SelectOption,
    },
    inheritAttrs: false,
    props: {
      showIcon: propTypes.bool.def(false),
      width: propTypes.string.def('73px'),
      value: [Array, Object, String, Number],
      numberToString: propTypes.bool,
      api: {
        type: Function as PropType<(arg?: any) => Promise<OptionsItem[]>>,
        default: null,
      },
      // api params
      params: propTypes.any.def({}),
      // support xxx.xxx.xx
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('label'),
      valueField: propTypes.string.def('value'),
      immediate: propTypes.bool.def(true),
      alwaysLoad: propTypes.bool.def(false),
      options: propTypes.array.def([]),
    },
    emits: ['options-change', 'change', 'update:value'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([]);
      const loading = ref(false);
      const isFirstLoad = ref(true);
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const { t } = useI18n();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      const getOptions = computed(() => {
        const { labelField, valueField, numberToString } = props;

        let data = unref(options).reduce((prev, next: any) => {
          if (next) {
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

      watchEffect(() => {
        props.immediate && !props.alwaysLoad && fetch();
      });

      watch(
        () => state.value,
        (v) => {
          emit('update:value', v);
        },
      );

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoad) && fetch();
        },
        { deep: true },
      );

      async function fetch() {
        const api = props.api;
        if (!api || !isFunction(api)) return;
        options.value = [];
        try {
          loading.value = true;
          const res = await api(props.params);
          if (Array.isArray(res)) {
            options.value = res;
            emitChange();
            return;
          }
          if (props.resultField) {
            options.value = get(res, props.resultField) || [];
          }
          emitChange();
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function handleFetch(visible) {
        if (visible) {
          if (props.alwaysLoad) {
            await fetch();
          } else if (!props.immediate && unref(isFirstLoad)) {
            await fetch();
            isFirstLoad.value = false;
          }
        }
      }

      function emitChange() {
        emit('options-change', unref(getOptions));
      }

      function handleChange(_, ...args) {
        emitData.value = args;
      }

      return { state, attrs, getOptions, loading, t, handleFetch, handleChange, currentyOptions };
    },
  });
</script>
