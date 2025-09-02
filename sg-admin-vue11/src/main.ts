import 'uno.css';
import '@/design/index.less';
import '@/components/VxeTable/src/css/index.scss';
import 'ant-design-vue/dist/antd.less';
// Register icon sprite
import 'virtual:svg-icons-register';

import { createApp } from 'vue';
// import { createPinia } from 'pinia';
import { registerGlobComp } from '@/components/registerGlobComp';
import { setupGlobDirectives } from '@/directives';
import { setupI18n } from '@/locales/setupI18n';
import { setupErrorHandle } from '@/logics/error-handle';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { setupStore } from '@/store';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';

import App from './App.vue';
//pina持久化
// const pinia = createPinia();

async function bootstrap() {
  const app = createApp(App);
  // Configure store
  await setupI18n(app);
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  await initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  // Configure routing
  // 配置路由
  await setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();

  app.mount('#app');
}

bootstrap();
