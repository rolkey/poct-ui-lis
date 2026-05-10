import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcPlanVO,
  QcPlanForm,
  QcPlanQuery,
} from "@/api/lis/qcPlan/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询质控计划列表
 * @param query
 * @returns {*}
 */
export const listQcPlan = (
  query?: QcPlanQuery,
): AxiosPromise<QcPlanVO[]> => {
  return request({
    url: `/${hisLis()}/qc/plan/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询质控计划详细
 * @param planId
 */
export const getQcPlan = (
  planId: string | number,
): AxiosPromise<QcPlanVO> => {
  return request({
    url: `/${hisLis()}/qc/plan/${planId}`,
    method: "get",
  });
};

/**
 * 新增质控计划
 * @param data
 */
export const addQcPlan = (data: QcPlanForm) => {
  return request({
    url: `/${hisLis()}/qc/plan`,
    method: "post",
    data: data,
  });
};

/**
 * 修改质控计划
 * @param data
 */
export const updateQcPlan = (data: QcPlanForm) => {
  return request({
    url: `/${hisLis()}/qc/plan`,
    method: "put",
    data: data,
  });
};

/**
 * 删除质控计划
 * @param planId
 */
export const delQcPlan = (planId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/plan/${planId}`,
    method: "delete",
  });
};
