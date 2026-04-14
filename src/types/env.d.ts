declare module "*.vue" {
  import { DefineComponent } from "vue";
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

// 环境变量
interface ImportMetaEnv {
  readonly [key: string]: string;
  //   VITE_APP_ENV: string;
  //   VITE_BASE_PATH: string;
  //   VITE_BASE_PORT: string;
  //   VITE_APP_TARGET_API: string;
  //   VITE_APP_BASE_API: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
  // readonly glob: any;
}
