<template>
  <Select
    class="memberLSelect"
    mode="multiple"
    :size="FORM_SIZE"
    :placeholder="t('modalForm.discountActivity.member_tip0')"
    v-model:value="currentMemberLevel_"
    :class="{ '!h-20 !overflow-x-auto': getSelectValue.length > 10 }"
    @change="changeMemberHandle"
  >
    <SelectOption
      value="all"
      :class="disabledAll ? '' : 'color_000'"
      @click="disabledAll ? '' : tapSelectOption('all')"
      :disabled="true"
      >{{ $t('business.common_select_all') }}
      <Checkbox
        class="!m-l-3 Checkbox_m"
        :disabled="disabledAll"
        @change="changeCheckMemberValues(checkMemberValues_)"
        v-model:checked="checkMemberValues_"
      />
    </SelectOption>
    <SelectOption
      v-for="option in optionsListMember"
      :disabled="option.disabled"
      :key="option.value"
      :value="option.value"
      >{{ option.label }}
    </SelectOption>
  </Select>
</template>

<script setup lang="ts">
  import {
    message,
    Checkbox,
    CheckboxGroup,
    FormItemRest,
    Select,
    SelectOption,
  } from 'ant-design-vue';
  import { computed, defineEmits, nextTick, ref, watch } from 'vue';
  // import { useAuthStore } from '@/store';
  // import { storeToRefs } from 'pinia';
  // import { useRoute, useRouter } from 'vue-router';
  // import eventBus from '/@/utils/eventBus';
  import { useMemberStore } from '/@/store/modules/member';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  const FORM_SIZE: any = useFormSetting().getFormSize;

  export interface Props {
    currentMemberLevel: any;
    model: any;
    field: string;
    routePath: string;
    checkMemberValues: boolean;
    disabled_select: any;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentMemberLevel: [],
    model: {},
    field: '',
    checkMemberValues: false,
    disabled_select: [],
    routePath: '/',
  });
  const { t } = useI18n();

  // const route = useRoute();
  // const router = useRouter();
  const emit = defineEmits(['setCurrentMemberLevel']);
  const memberStore = useMemberStore();
  memberStore.getLevelList();

  const getSelectValue = ref([] as any);
  const checkMemberValues_ = ref(false as any);
  const currentMemberLevel_ = ref([]);

  var changeMemberHandleNum = true;
  watch(
    () => props.currentMemberLevel,
    () => {
      var arr = [];
      if (props.currentMemberLevel.length) {
        props.currentMemberLevel.forEach((item: number | string) => {
          arr.push(item + '');
        });
        currentMemberLevel_.value = arr;
        checkMemberValues_.value = props.checkMemberValues;
        if (currentMemberLevel_.value.length == optionsListMember.value.length) {
          checkMemberValues_.value = true;
        } else {
          checkMemberValues_.value = false;
        }

        if (changeMemberHandleNum) {
          changeMemberHandle(arr);
          changeMemberHandleNum = false;
        }
      }
    },
    {
      // immediate: true,
    },
  );

  const tapSelectOption = (e) => {
    checkMemberValues_.value
      ? (checkMemberValues_.value = false)
      : (checkMemberValues_.value = true);
  };

  const optionsListMember = computed(() => {
    const outputArray: { label: string; value: string; disabled: boolean }[] = [];
    for (const key in memberStore.levelSelect) {
      outputArray.push({ label: memberStore.levelSelect[key], value: key, disabled: false });
    }
    if (props.disabled_select.length) {
      outputArray.forEach((element) => {
        props.disabled_select.forEach((item) => {
          if (element.value == item.value) {
            element.disabled = item.disabled;
          }
        });
      });
      let disabledNum = 0;
      disabledNum = props.disabled_select.filter((item) => item.disabled).length;
      // if(disabledNum)checkMemberValues_.value = true;
      if (disabledNum == outputArray.length) {
        disabledAll.value = true;
      } else {
        disabledAll.value = false;
      }
    }
    return outputArray;
  });

  function changeMemberHandle(e) {
    //getSelectValue.value = e;
    let arr = e.filter((item: any) => {
      return item !== 'all';
    });
    emit('setCurrentMemberLevel', arr);
  }
  const changeCheckMemberValues = (v) => {
    if (!v) {
      currentMemberLevel_.value = [];
      emit('setCurrentMemberLevel', []);
    }
  };
  watch(
    () => checkMemberValues_.value,
    (v) => {
      if (!v) {
        // currentMemberLevel_.value = [];
        // emit('setCurrentMemberLevel', []);
      } else {
        currentMemberLevel_.value = [];
        optionsListMember.value.map((item: any) => {
          if (item !== 'all' && !item.disabled)
            return currentMemberLevel_.value.push(String(item?.value) as never);
        });
        emit('setCurrentMemberLevel', currentMemberLevel_.value);
        // eventBus.emit('setCurrentMemberLevel', listValue);
      }
    },
  );
  const disabledAll = ref<boolean>(false);
  watch(
    () => props.disabled_select,
    (v) => {
      if (optionsListMember.value.length) {
        optionsListMember.value.forEach((element) => {
          v.forEach((item) => {
            if (element.value == item.value) {
              element.disabled = item.disabled;
            }
          });
        });

        let disabledNum = 0;
        disabledNum = v.filter((item) => item.disabled).length;
        // if(disabledNum)checkMemberValues_.value = true;
        if (disabledNum == optionsListMember.value.length) {
          disabledAll.value = true;
        } else {
          disabledAll.value = false;
        }
      } else {
        setTimeout(() => {
          optionsListMember.value.forEach((element) => {
            v.forEach((item) => {
              if (element.value == item.value) {
                element.disabled = item.disabled;
              }
            });
          });
          let disabledNum = 0;
          disabledNum = v.filter((item) => item.disabled).length;
          // if(disabledNum)checkMemberValues_.value = true;
          if (disabledNum == optionsListMember.value.length) {
            disabledAll.value = true;
          } else {
            disabledAll.value = false;
          }
        }, 1111);
      }
    },
  );
</script>

<style lang="scss" scoped>
  :deep(.color_000) {
    color: #000;
    cursor: inherit !important;
  }

  :deep(.Checkbox_m) {
    position: absolute;
    right: 10px;
  }
</style>
