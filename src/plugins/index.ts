import modal from "./modal";

export default {
  install(app: any) {
    // 插件配置

    app.config.globalProperties.$modal = modal;
  },
};
