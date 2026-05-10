import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcMaterialVO,
  QcMaterialForm,
  QcMaterialQuery,
  QcMaterialBatchVO,
  QcMaterialBatchForm,
  QcMaterialBatchQuery,
} from "@/api/lis/qcMaterial/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询质控品列表
 * @param query
 * @returns {*}
 */
export const listQcMaterial = (
  query?: QcMaterialQuery,
): AxiosPromise<QcMaterialVO[]> => {
  return request({
    url: `/${hisLis()}/qc/material/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询质控品详细
 * @param materialId
 */
export const getQcMaterial = (
  materialId: string | number,
): AxiosPromise<QcMaterialVO> => {
  return request({
    url: `/${hisLis()}/qc/material/${materialId}`,
    method: "get",
  });
};

/**
 * 新增质控品
 * @param data
 */
export const addQcMaterial = (data: QcMaterialForm) => {
  return request({
    url: `/${hisLis()}/qc/material`,
    method: "post",
    data: data,
  });
};

/**
 * 修改质控品
 * @param data
 */
export const updateQcMaterial = (data: QcMaterialForm) => {
  return request({
    url: `/${hisLis()}/qc/material`,
    method: "put",
    data: data,
  });
};

/**
 * 删除质控品
 * @param materialId
 */
export const delQcMaterial = (materialId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/material/${materialId}`,
    method: "delete",
  });
};

/**
 * 查询质控品批次列表
 * @param query
 * @returns {*}
 */
export const listQcMaterialBatch = (
  query?: QcMaterialBatchQuery,
): AxiosPromise<QcMaterialBatchVO[]> => {
  return request({
    url: `/${hisLis()}/qc/material/batch/list`,
    method: "get",
    params: query,
  });
};

/**
 * 新增质控品批次
 * @param data
 */
export const addQcMaterialBatch = (data: QcMaterialBatchForm) => {
  return request({
    url: `/${hisLis()}/qc/material/batch`,
    method: "post",
    data: data,
  });
};

/**
 * 修改质控品批次
 * @param data
 */
export const updateQcMaterialBatch = (data: QcMaterialBatchForm) => {
  return request({
    url: `/${hisLis()}/qc/material/batch`,
    method: "put",
    data: data,
  });
};

/**
 * 删除质控品批次
 * @param batchId
 */
export const delQcMaterialBatch = (batchId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/material/batch/${batchId}`,
    method: "delete",
  });
};
