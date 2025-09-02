<script lang="ts" setup>
defineOptions({
  name: 'SSBaseLoading',
})
</script>

<template>
  <span class="text-[13rem] text-[#333] whitespace-nowrap">
    Loading...
  </span>
  <!-- <div class="relative">
    <div class="loader top-[46%]">
      <div class="loader-animation" />
    </div>

    <div class="loader-wrap">
      <div class="wrap">
        <div class="content">
          <div class="loader top-[46%]">
            <div class="loader-animation" />
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
.wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.content {
  position: relative;
  height: 100%;
  width: 100%;
}

.loader-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 76rem;
  height: 12rem;
  background-color: #f23038;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  border-radius: 100rem;
}

.loader .loader-animation {
  border-radius: 100rem;
  position: absolute;
  background-color: white;
  top: 2rem;
  bottom: 2rem;
  animation: loader-slide 0.8s infinite;
  will-change: left, right;
}

.loader .loader-animation.no-animation-chromatic {
  animation-play-state: paused;
}

@keyframes loader-slide {
  0% {
    right: 64rem;
    left: 2rem;
  }

  5% {
    left: 2rem;
  }

  50% {
    right: 2rem;
    left: 64rem;
  }

  55% {
    right: 2rem;
  }

  to {
    right: 64rem;
    left: 2rem;
  }
}
</style>
