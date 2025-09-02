<template>
  <div :class="rotating ? 'rotating' : ''">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      @click="updateRotating"
    >
      <g clip-path="url(#clip0_2134_4908)">
        <path
          d="M6.99978 0.388672C8.53257 0.388672 9.98338 0.913264 11.1436 1.84807L11.972 1.01937L13.3008 4.76391L9.5563 3.43507L10.2019 2.78983C9.28203 2.08817 8.15669 1.70899 6.99978 1.71089C4.07866 1.71089 1.71089 4.07866 1.71089 6.99978C1.71089 9.9209 4.07866 12.2887 6.99978 12.2887C7.6945 12.2898 8.38258 12.1535 9.02442 11.8877C9.66627 11.6218 10.2492 11.2317 10.7397 10.7397C11.6996 9.78264 12.2537 8.4924 12.2867 7.13729L12.2887 6.99978H13.6109C13.612 7.86812 13.4414 8.72812 13.1091 9.53036C12.7768 10.3326 12.2893 11.0613 11.6745 11.6745C11.0613 12.2893 10.3326 12.7768 9.53036 13.1091C8.72812 13.4414 7.86812 13.612 6.99978 13.6109C3.34847 13.6109 0.388672 10.6511 0.388672 6.99978C0.388672 3.34847 3.34847 0.388672 6.99978 0.388672Z"
          fill="#1475E1"
        />
      </g>
      <defs>
        <clipPath id="clip0_2134_4908">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  export interface Props {
    rotating: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    rotating: false,
  });
  const rotating = ref(props.rotating);

  const updateRotating = () => {
    rotating.value = true;
    setTimeout(() => {
      rotating.value = false;
    }, 999);
  };
</script>
<style>
  .rotating svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
