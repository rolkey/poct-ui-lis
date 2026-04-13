import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
// import UnoCSS from "@unocss/vite";
import qiankun from "vite-plugin-qiankun";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_PATH,
    plugins: [vue(), UnoCSS(), qiankun("vue3", { useDevMode: true })],
    // plugins: [vue(), qiankun("vue3", { useDevMode: true })],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 10301,
      host: "0.0.0.0",
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    // 添加 build 配置，关闭生产环境的 source map 生成（如果不需要）
    build: {
      sourcemap: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  };
});
