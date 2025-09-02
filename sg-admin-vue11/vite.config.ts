import { defineApplicationConfig } from '@vben/vite-config';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    // plugins: [VueDevTools()],
    server: {
      proxy: {
        '/merchant': {
          target: 'https://ht.a79163.com',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/merchant`), '/merchant'),
          // only https
          // secure: false
        },
      },
    },
    css: {
      postcss: {
        // 确保这里不会覆盖默认解析规则
      },
      preprocessorOptions: {
        css: {
          additionalData: `@import "@/assets/font/font.css";`,
        },
      },
    },
  },
});
