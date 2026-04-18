import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  CommInstrumentVO,
  CommInstrumentForm,
  CommInstrumentQuery,
} from "@/api/lis/commInstrument/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询仪器列表
 * @param query
 * @returns {*}
 */
export const listCommInstrument = (
  query?: CommInstrumentQuery,
): AxiosPromise<CommInstrumentVO[]> => {
  return request({
    url: `/${hisLis()}/commInstrument/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询仪器详细
 * @param instrumentId
 */
export const getCommInstrument = (
  instrumentId: string | number,
): AxiosPromise<CommInstrumentVO> => {
  return request({
    url: `/${hisLis()}/commInstrument/${instrumentId}`,
    method: "get",
  });
};

/**
 * 新增仪器
 * @param data
 */
export const addCommInstrument = (data: CommInstrumentForm) => {
  return request({
    url: `/${hisLis()}/commInstrument`,
    method: "post",
    data: data,
  });
};

/**
 * 修改仪器
 * @param data
 */
export const updateCommInstrument = (data: CommInstrumentForm) => {
  return request({
    url: `/${hisLis()}/commInstrument`,
    method: "put",
    data: data,
  });
};

/**
 * 删除仪器
 * @param instrumentId
 */
export const delCommInstrument = (instrumentId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/commInstrument/${instrumentId}`,
    method: "delete",
  });
};
