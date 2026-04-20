import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  InspectionGroupVO,
  InspectionGroupForm,
  InspectionGroupQuery,
} from "@/api/lis/inspectionGroup/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询检验分组信息列表
 * @param query
 * @returns {*}
 */

export const listInspectionGroup = (
  query?: InspectionGroupQuery,
): AxiosPromise<InspectionGroupVO[]> => {
  return request({
    url: `/${hisLis()}/inspectionGroup/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询检验分组信息详细
 * @param groupId
 */
export const getInspectionGroup = (groupId: string | number): AxiosPromise<InspectionGroupVO> => {
  return request({
    url: `/${hisLis()}/inspectionGroup/${groupId}`,
    method: "get",
  });
};

/**
 * 新增检验分组信息
 * @param data
 */
export const addInspectionGroup = (data: InspectionGroupForm) => {
  return request({
    url: `/${hisLis()}/inspectionGroup`,
    method: "post",
    data: data,
  });
};

/**
 * 修改检验分组信息
 * @param data
 */
export const updateInspectionGroup = (data: InspectionGroupForm) => {
  return request({
    url: `/${hisLis()}/inspectionGroup`,
    method: "put",
    data: data,
  });
};

/**
 * 删除检验分组信息
 * @param groupId
 */
export const delInspectionGroup = (groupId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/inspectionGroup/${groupId}`,
    method: "delete",
  });
};
