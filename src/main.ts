// import "virtual:uno.css";

import { createApp } from "vue";
import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "uno.css";

import ElementPlus from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
// import "element-plus/theme-chalk/dark/css-vars.css";
import locale from "element-plus/es/locale/lang/zh-cn";
import "@/assets/styles/index.scss";

import { loadRouters } from "./router/routerLoader";

const appName = import.meta.env.VITE_BASE_PATH;
const microAppName = appName.substr(1);

let app: ReturnType<typeof createApp> | null = null;

const render = (container?: any) => {
  const appDom = container ? container.querySelector("#app") : "#app";
  app = createApp(App);

  app.config.globalProperties.msgBus = (window as any).__QIANKUN_MSG_BUS__;

  app.use(store);

  // 读取主应用路由
  loadRouters();
  app.use(ElementPlus, {
    locale: locale,
  });
  app.use(router);
  app.mount(appDom);
};

renderWithQiankun({
  bootstrap() {
    console.log(`[${microAppName}] bootstrap`);
  },
  mount(props: any) {
    console.log(`[${microAppName}] mount`, props);
    (window as any).__QIANKUN_MSG_BUS__ = props.msgBus;
    render(props.container);
  },
  unmount() {
    console.log(`[${microAppName}] unmount`);
    app?.unmount();
    app = null;
  },
  update(props: any) {
    console.log(`[${microAppName}] update`, props);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  const redirect = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/?redirect=${redirect}`;
}
