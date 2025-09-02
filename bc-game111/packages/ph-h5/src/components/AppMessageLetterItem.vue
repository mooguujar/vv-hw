<script setup lang='ts'>
import { BaseImage } from '@tg/bccomponents'
import { IconUniDelete } from '@tg/icons'
import { timeToFromNow } from '@tg/vue-i18n'
import { usePointerSwipe } from '@vueuse/core'
import { ref, watch } from 'vue'

interface Props {
  data: {
    id: string
    title: string
    msg: string
    created_at: number
    read: boolean
  }
}

defineOptions({ name: 'AppMessageLetterItem' })
const props = defineProps<Props>()
const emit = defineEmits(['delete'])

const rightRef = ref()
const { isSwiping, direction } = usePointerSwipe(rightRef)
const showDelete = ref(false)

function onClickDelete() {
  emit('delete', props.data.id)
}

watch([isSwiping, direction], ([a, b]) => {
  if (a && props.data.read) {
    showDelete.value = b === 'left'
  }
})
</script>

<template>
  <div class="flex w-full h-[70rem] rounded-[4px] overflow-hidden">
    <div class="flex-none h-full flex items-center text-[20rem] justify-center bg-[#EBEBEB] w-[62rem]">
      <BaseImage v-if="data.read" class="w-[20rem] h-[20rem]" url="/ph-h5/png/uni-mail1.png" />
      <BaseImage v-else class="w-[20rem] h-[20rem]" url="/ph-h5/png/uni-mail.png" />
    </div>
    <div ref="rightRef" class="flex grow h-full bg-[#fff] items-center " style="max-width: calc(100% - 62rem);">
      <div class="w-full h-full flex items-center">
        <div class="flex flex-col overflow-hidden w-full">
          <div class="px-[14rem] mb-[2rem] flex text-[14rem] font-[500] leading-[20rem] items-center justify-between">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%] text-[#0D2245]">
              <span>{{ data.title }}</span>
            </div>
            <span class="flex-none flex items-center ml-[8rem]">
              <span
                v-show="!data.read"
                class="inline-block w-[6rem] h-[6rem] bg-[#F23038] rounded-[50%] mr-[4rem]"
              />
              {{ timeToFromNow(data.created_at) }}
            </span>
          </div>
          <div
            class="px-[14rem] leading-[20rem] w-full text-[#6D7693]  overflow-hidden whitespace-nowrap text-ellipsis"
          >
            <span>{{ data.msg }}</span>
          </div>
        </div>
        <div
          :class="showDelete ? 'w-[70rem]' : 'w-0'" class=" duration-[0.35s] h-full text-[26rem] bg-[#F23038] flex flex-none items-center justify-center"
          @click.stop="onClickDelete"
        >
          <IconUniDelete class="text-white" />
        </div>
      </div>
    </div>
  </div>
</template>
