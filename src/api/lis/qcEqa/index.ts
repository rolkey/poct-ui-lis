import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcEqaPlanVO,
  QcEqaPlanForm,
  QcEqaPlanQuery,
  QcEqaRecordVO,
  QcEqaRecordForm,
  QcEqaRecordQuery,
} from "@/api/lis/qcEqa/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询室间质评计划列表
 * @param query
 * @returns {*}
 */
export const listQcEqaPlan = (
  query?: QcEqaPlanQuery,
): AxiosPromise<QcEqaPlanVO[]> => {
  return request({
    url: `/${hisLis()}/qc/eqa/plan/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询室间质评计划详细
 * @param eqaPlanId
 */
export const getQcEqaPlan = (
  eqaPlanId: string | number,
): AxiosPromise<QcEqaPlanVO> => {
  return request({
    url: `/${hisLis()}/qc/eqa/plan/${eqaPlanId}`,
    method: "get",
  });
};

/**
 * 新增室间质评计划
 * @param data
 */
export const addQcEqaPlan = (data: QcEqaPlanForm) => {
  return request({
    url: `/${hisLis()}/qc/eqa/plan`,
    method: "post",
    data: data,
  });
};

/**
 * 修改室间质评计划
 * @param data
 */
export const updateQcEqaPlan = (data: QcEqaPlanForm) => {
  return request({
    url: `/${hisLis()}/qc/eqa/plan`,
    method: "put",
    data: data,
  });
};

/**
 * 删除室间质评计划
 * @param eqaPlanId
 */
export const delQcEqaPlan = (eqaPlanId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/eqa/plan/${eqaPlanId}`,
    method: "delete",
  });
};

/**
 * 查询室间质评记录列表
 * @param query
 * @returns {*}
 */
export const listQcEqaRecord = (
  query?: QcEqaRecordQuery,
): AxiosPromise<QcEqaRecordVO[]> => {
  return request({
    url: `/${hisLis()}/qc/eqa/record/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询室间质评记录详细
 * @param eqaRecordId
 */
export const getQcEqaRecord = (
  eqaRecordId: string | number,
): AxiosPromise<QcEqaRecordVO> => {
  return request({
    url: `/${hisLis()}/qc/eqa/record/${eqaRecordId}`,
    method: "get",
  });
};

/**
 * 新增室间质评记录
 * @param data
 */
export const addQcEqaRecord = (data: QcEqaRecordForm) => {
  return request({
    url: `/${hisLis()}/qc/eqa/record`,
    method: "post",
    data: data,
  });
};

/**
 * 修改室间质评记录
 * @param data
 */
export const updateQcEqaRecord = (data: QcEqaRecordForm) => {
  return request({
    url: `/${hisLis()}/qc/eqa/record`,
    method: "put",
    data: data,
  });
};

/**
 * 删除室间质评记录
 * @param eqaRecordId
 */
export const delQcEqaRecord = (eqaRecordId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/eqa/record/${eqaRecordId}`,
    method: "delete",
  });
};
