<template>
  <div class="custom-select">
    <Select mode="multiple" v-model="values" :placeholder="placeholder" dropdownClassName="drop" :fieldNames="fieldNames"
      :options="tagAllList" @change="selectTagChange">
      <template #option="{ name, countNum }">
        <div style="width: 100%;display: flex;justify-content: space-between;">
          <div><span>{{ name }}</span></div>
          <div>
            <Tag :color="tagColor">{{ countNum }}</Tag>
            <!-- <Checkbox :checked="checked"></Checkbox> -->
          </div>
        </div>
      </template>
      <template #tagRender="{ option, closable, onClose }">
        <Tag :closable="closable" style="margin-right: 3px;margin-top: 2px;" @close="onClose">
          {{ option.name }}</Tag>
      </template>
    </Select>
  </div>
</template>
<script setup lang="ts">
import {  Tag, Select } from 'ant-design-vue';
import { ref, watch } from 'vue';
import {useI18n} from "@/hooks/web/useI18n";

const { t } = useI18n();
const props = defineProps({
  options: {
    type: Array<any>,
    default: []
  },
  placeholder:{
    type:String,
    default: t('common.chooseText')
  },
  fieldNames:{
    type:Object,
    default:{
      label: 'name',
      value: 'id'
    }
  },
  tagColor:{
    type: String,
    default:'#cd201f'
  },
  value:{
    type:Array,
    default:[]
  }
});

const { placeholder, fieldNames,tagColor} = props;

let tagAllList = ref<any>([])

let values = ref<any>([])

const emit = defineEmits(['change'])

watch(
  () => props.options,
  (value) => {
    tagAllList.value = value
  },
  { immediate: true },
);

watch(
  () => props.value,
  (value) => {
    values.value = value
  },
  { immediate: true },
);

const selectTagChange = (value) => {

  tagAllList.value = tagAllList.value.reduce((result,current)=>{

    current.checked= value.includes(current.id);

    result.push(current)

    return result;
  },[])

  emit('change', value)
}

</script>
