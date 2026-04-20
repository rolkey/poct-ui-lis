import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ChargeItemVO, ChargeItemForm, ChargeItemQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;
/**
 * 查询诊疗项目列表
 * @param query
 * @returns {*}
 */

export const listChargeItem = (query?: ChargeItemQuery): AxiosPromise<ChargeItemVO[]> => {
  return request({
    url: `/${hisLis()}/chargeItem/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询诊疗项目详细
 * @param chargeItemId
 */
export const getChargeItem = (chargeItemId: string | number): AxiosPromise<ChargeItemVO> => {
  return request({
    url: `/${hisLis()}/chargeItem/${chargeItemId}`,
    method: "get",
  });
};

/**
 * 新增诊疗项目
 * @param data
 */
export const addChargeItem = (data: ChargeItemForm) => {
  return request({
    url: `/${hisLis()}/chargeItem`,
    method: "post",
    data: data,
  });
};

/**
 * 修改诊疗项目
 * @param data
 */
export const updateChargeItem = (data: ChargeItemForm) => {
  return request({
    url: `/${hisLis()}/chargeItem`,
    method: "put",
    data: data,
  });
};

/**
 * 删除诊疗项目
 * @param chargeItemId
 */
export const delChargeItem = (chargeItemId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/chargeItem/${chargeItemId}`,
    method: "delete",
  });
};
