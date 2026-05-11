import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcComparisonVO,
  QcComparisonForm,
  QcComparisonQuery,
  ComparisonDetailVO,
  ComparisonDetailForm,
  ComparisonDetailQuery,
} from "@/api/lis/qcComparison/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询仪器比对列表
 * @param query
 * @returns {*}
 */
export const listQcComparison = (
  query?: QcComparisonQuery,
): AxiosPromise<QcComparisonVO[]> => {
  return request({
    url: `/${hisLis()}/qc/comparison/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询仪器比对详细
 * @param comparisonId
 */
export const getQcComparison = (
  comparisonId: string | number,
): AxiosPromise<QcComparisonVO> => {
  return request({
    url: `/${hisLis()}/qc/comparison/${comparisonId}`,
    method: "get",
  });
};

/**
 * 新增仪器比对
 * @param data
 */
export const addQcComparison = (data: QcComparisonForm) => {
  return request({
    url: `/${hisLis()}/qc/comparison`,
    method: "post",
    data: data,
  });
};

/**
 * 修改仪器比对
 * @param data
 */
export const updateQcComparison = (data: QcComparisonForm) => {
  return request({
    url: `/${hisLis()}/qc/comparison`,
    method: "put",
    data: data,
  });
};

/**
 * 删除仪器比对
 * @param comparisonId
 */
export const delQcComparison = (comparisonId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/comparison/${comparisonId}`,
    method: "delete",
  });
};

/**
 * 查询比对明细列表（别名）
 * @param comparisonId 比对ID
 * @returns {*}
 */
export const listQcComparisonDetail = (
  comparisonId?: string | number,
): AxiosPromise<ComparisonDetailVO[]> => {
  return request({
    url: `/${hisLis()}/qc/comparison/detail/list`,
    method: "get",
    params: { comparisonId },
  });
};

/**
 * 查询比对明细列表
 * @param query
 * @returns {*}
 */
export const listComparisonDetail = (
  query?: ComparisonDetailQuery,
): AxiosPromise<ComparisonDetailVO[]> => {
  return request({
    url: `/${hisLis()}/qc/comparison/detail/list`,
    method: "get",
    params: query,
  });
};

/**
 * 新增比对明细
 * @param data
 */
export const addComparisonDetail = (data: ComparisonDetailForm) => {
  return request({
    url: `/${hisLis()}/qc/comparison/detail`,
    method: "post",
    data: data,
  });
};

/**
 * 修改比对明细
 * @param data
 */
export const updateComparisonDetail = (data: ComparisonDetailForm) => {
  return request({
    url: `/${hisLis()}/qc/comparison/detail`,
    method: "put",
    data: data,
  });
};

/**
 * 删除比对明细
 * @param detailId
 */
export const delComparisonDetail = (detailId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/comparison/detail/${detailId}`,
    method: "delete",
  });
};
