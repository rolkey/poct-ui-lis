import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcOocRecordVO,
  QcOocRecordForm,
  QcOocRecordQuery,
  OocCauseDictVO,
  OocCauseDictForm,
  OocCauseDictQuery,
} from "@/api/lis/qcOoc/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询OOC记录列表
 * @param query
 * @returns {*}
 */
export const listQcOocRecord = (
  query?: QcOocRecordQuery,
): AxiosPromise<QcOocRecordVO[]> => {
  return request({
    url: `/${hisLis()}/qc/ooc/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询OOC记录详细
 * @param oocId
 */
export const getQcOocRecord = (
  oocId: string | number,
): AxiosPromise<QcOocRecordVO> => {
  return request({
    url: `/${hisLis()}/qc/ooc/${oocId}`,
    method: "get",
  });
};

/**
 * 新增OOC记录
 * @param data
 */
export const addQcOocRecord = (data: QcOocRecordForm) => {
  return request({
    url: `/${hisLis()}/qc/ooc`,
    method: "post",
    data: data,
  });
};

/**
 * 修改OOC记录
 * @param data
 */
export const updateQcOocRecord = (data: QcOocRecordForm) => {
  return request({
    url: `/${hisLis()}/qc/ooc`,
    method: "put",
    data: data,
  });
};

/**
 * 删除OOC记录
 * @param oocId
 */
export const delQcOocRecord = (oocId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/ooc/${oocId}`,
    method: "delete",
  });
};

/**
 * 查询OOC原因字典列表
 * @param query
 * @returns {*}
 */
export const listOocCauseDict = (
  query?: OocCauseDictQuery,
): AxiosPromise<OocCauseDictVO[]> => {
  return request({
    url: `/${hisLis()}/qc/ooc/causeDict/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询OOC原因字典详细
 * @param causeId
 */
export const getOocCauseDict = (
  causeId: string | number,
): AxiosPromise<OocCauseDictVO> => {
  return request({
    url: `/${hisLis()}/qc/ooc/causeDict/${causeId}`,
    method: "get",
  });
};

/**
 * 新增OOC原因字典
 * @param data
 */
export const addOocCauseDict = (data: OocCauseDictForm) => {
  return request({
    url: `/${hisLis()}/qc/ooc/causeDict`,
    method: "post",
    data: data,
  });
};

/**
 * 修改OOC原因字典
 * @param data
 */
export const updateOocCauseDict = (data: OocCauseDictForm) => {
  return request({
    url: `/${hisLis()}/qc/ooc/causeDict`,
    method: "put",
    data: data,
  });
};

/**
 * 删除OOC原因字典
 * @param causeId
 */
export const delOocCauseDict = (causeId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/ooc/causeDict/${causeId}`,
    method: "delete",
  });
};

/**
 * 处理OOC记录
 * @param data
 */
export const handleQcOoc = (data: { oocCause: string; correctiveAction: string; handler: string; recordId: string | number }) => {
  return request({
    url: `/${hisLis()}/qc/ooc/handle`,
    method: "post",
    data: data,
  });
};

/**
 * 解除锁定OOC记录
 * @param oocId
 */
export const unlockQcOoc = (oocId: string | number) => {
  return request({
    url: `/${hisLis()}/qc/ooc/unlock/${oocId}`,
    method: "post",
  });
};
