<template>
  <Teleport to="body">
    <div
      class="absolute top-0 bottom-0 left-0 right-0 bg-[#000] bg-opacity-45 carousel__container flex justify-center items-center"
      style="z-index: 9999"
      @click="closeCarousel"
    >
      <div class="w-[870px] h-[570px] carousel__container__modal" @click.stop>
        <div class="absolute -right-10 -top-3 cursor-pointer" @click="closeCarousel"
          ><img :src="cancelSvg" alt=""
        /></div>
        <Carousel arrows dots-class="slick-dots slick-thumb">
          <template #prevArrow>
            <div class="custom-slick-arrow" style="z-index: 1; left: 10px">
              <img style="z-index: 100; width: 40px" :src="leftArrow" />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <img style="z-index: 100; width: 40px" :src="rightArrow" />
            </div>
          </template>
          <template #customPaging="{ i }">
            <a>
              <img :src="getImgUrl(i)" />
            </a>
          </template>
          <div v-for="item in validCarouselList.length" :key="item">
            <img :src="getImgUrl(item - 1)" />
          </div>
        </Carousel>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
  import { Carousel } from 'ant-design-vue';
  import rightArrow from '/@/assets/svg/rightArrow.svg';
  import leftArrow from '/@/assets/svg/left-arrow.svg';
  import cancelSvg from '/@/assets/svg/cancel-svg.svg';
  import { computed, onMounted } from 'vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';

  interface Props {
    isShow: boolean;
    carouselList: any[];
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:isShow']);
  const carouselList = computed(() => props.carouselList);
  const validCarouselList = computed(() => {
    const filterCarouselList = carouselList.value.filter((url) => url != 1);
    return filterCarouselList.map((url) => getDataTypePreviewUrl(url));
  });
  const getImgUrl = (i: number) => {
    return validCarouselList.value[i];
  };
  function closeCarousel() {
    emits('update:isShow');
  }
  onMounted(() => {});
</script>
<style lang="scss">
  .carousel__container {
    box-shadow: 0 5px 20px 5px rgb(0 0 0 / 25%);

    .ant-carousel {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }

    // .slick-list {
    //   height: 364px;
    // }

    .slick-dots {
      position: relative;
      height: auto;
    }

    .slick-slide img {
      display: block;
      max-width: 80%;
      margin: auto;
      border: 5px solid #fff;
    }

    .slick-thumb {
      position: relative;
      top: 50%;
      bottom: 0;
      align-items: center;
      height: 56px;
      margin: 0;
      transform: translateY(50%);
      border-radius: 0 0 4px 4px;
      opacity: 0.7;
      background: #000;
    }

    .slick-thumb li {
      width: 40px;
      height: 50px;
      margin-right: 10px;
    }

    .slick-thumb li img {
      display: block;
      width: 100%;
      height: 100%;
      // filter: grayscale(100%);
    }

    .slick-thumb li.slick-active img {
      filter: grayscale(0%);
    }

    /* .ant-carousel .slick-dots li.slick-active {
      width: 60px;
    } */
    .slick-arrow.custom-slick-arrow {
      z-index: 1;
      width: 40px;
      height: 40px;
      transition: ease all 0.3s;
      opacity: 0.3;
      background-color: transparent;
      color: #fff;
      font-size: 25px;
    }

    .slick-arrow.custom-slick-arrow::before {
      display: none;
    }

    &__modal {
      position: relative;
      border-radius: 4px;
      background: #d9d9d9;
      box-shadow: 0 5px 20px 5px rgb(0 0 0 / 25%);
    }
  }
</style>
