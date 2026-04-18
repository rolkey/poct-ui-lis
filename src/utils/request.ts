import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken } from "./auth";
import FileSaver from "file-saver";
import { LoadingInstance } from "element-plus/lib/components/index.js";
import { blobValidate, tansParams } from "./ruoyi";
import errorCode from "./errorCode";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || "/dev-api",
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      ElMessage.error(res.msg || "请求失败");
      return Promise.reject(new Error(res.msg || "请求失败"));
    }
    return res;
  },
  (error) => {
    ElMessage.error(error.message || "网络请求失败");
    return Promise.reject(error);
  },
);

let downloadLoadingInstance: LoadingInstance;
export function download(url: string, params: any, fileName: string): any {
  downloadLoadingInstance = ElLoading.service({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  // prettier-ignore
  return service.post(url, params, {
      transformRequest: [
        (params: any) => {
          return tansParams(params);
        }
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob'
    }).then(async (resp: any) => {
      const isLogin = blobValidate(resp);
      if (isLogin) {
        const blob = new Blob([resp]);
        FileSaver.saveAs(blob, fileName);
      } else {
        const blob = new Blob([resp]);
        const resText = await blob.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
        ElMessage.error(errMsg);
      }
      downloadLoadingInstance.close();
    }).catch((r: any) => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}
export default service;
