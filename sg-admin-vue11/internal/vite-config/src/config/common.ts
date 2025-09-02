import { presetTypography, presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';
import { type UserConfig } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
  },
  esbuild: {
    drop: mode === 'procution' ? ['console', 'debugger'] : [],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3,
    },
  },
  plugins: [
    UnoCSS({
      presets: [presetUno(), presetTypography()],
    }),
    vueSetupExtend(),
  ],
});

export { commonConfig };
