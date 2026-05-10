import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcRecordVO,
  QcRecordForm,
  QcRecordQuery,
} from "@/api/lis/qcRecord/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询质控记录列表
 * @param query
 * @returns {*}
 */
export const listQcRecord = (
  query?: QcRecordQuery,
): AxiosPromise<QcRecordVO[]> => {
  return request({
    url: `/${hisLis()}/qc/record/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询质控记录详细
 * @param recordId
 */
export const getQcRecord = (
  recordId: string | number,
): AxiosPromise<QcRecordVO> => {
  return request({
    url: `/${hisLis()}/qc/record/${recordId}`,
    method: "get",
  });
};

/**
 * 新增质控记录
 * @param data
 */
export const addQcRecord = (data: QcRecordForm) => {
  return request({
    url: `/${hisLis()}/qc/record`,
    method: "post",
    data: data,
  });
};

/**
 * 删除质控记录
 * @param recordId
 */
export const delQcRecord = (recordId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/record/${recordId}`,
    method: "delete",
  });
};

/**
 * 导出质控记录
 * @param query
 */
export const exportQcRecord = (query?: QcRecordQuery) => {
  return request({
    url: `/${hisLis()}/qc/record/export`,
    method: "get",
    params: query,
    responseType: "blob",
  });
};
