import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { TestItemVO, TestItemForm, TestItemQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询检验项目列表
 * @param query
 * @returns {*}
 */
export const listTestItem = (query?: TestItemQuery): AxiosPromise<TestItemVO[]> => {
  return request({
    url: `/${hisLis()}/testItem/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询检验项目详细
 * @param testItemId
 */
export const getTestItem = (testItemId: string | number): AxiosPromise<TestItemVO> => {
  return request({
    url: `/${hisLis()}/testItem/${testItemId}`,
    method: "get",
  });
};

/**
 * 新增检验项目
 * @param data
 */
export const addTestItem = (data: TestItemForm) => {
  return request({
    url: `/${hisLis()}/testItem`,
    method: "post",
    data: data,
  });
};

/**
 * 修改检验项目
 * @param data
 */
export const updateTestItem = (data: TestItemForm) => {
  return request({
    url: `/${hisLis()}/testItem`,
    method: "put",
    data: data,
  });
};

/**
 * 删除检验项目
 * @param testItemId
 */
export const delTestItem = (testItemId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/testItem/${testItemId}`,
    method: "delete",
  });
};
