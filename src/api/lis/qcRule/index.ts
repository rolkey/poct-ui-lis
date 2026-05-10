import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcRuleVO,
  QcRuleForm,
  QcRuleQuery,
  QcRuleConfigVO,
  QcRuleConfigForm,
  QcRuleConfigQuery,
} from "@/api/lis/qcRule/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询质控规则列表
 * @param query
 * @returns {*}
 */
export const listQcRule = (
  query?: QcRuleQuery,
): AxiosPromise<QcRuleVO[]> => {
  return request({
    url: `/${hisLis()}/qc/rule/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询质控规则详细
 * @param ruleId
 */
export const getQcRule = (
  ruleId: string | number,
): AxiosPromise<QcRuleVO> => {
  return request({
    url: `/${hisLis()}/qc/rule/${ruleId}`,
    method: "get",
  });
};

/**
 * 新增质控规则
 * @param data
 */
export const addQcRule = (data: QcRuleForm) => {
  return request({
    url: `/${hisLis()}/qc/rule`,
    method: "post",
    data: data,
  });
};

/**
 * 修改质控规则
 * @param data
 */
export const updateQcRule = (data: QcRuleForm) => {
  return request({
    url: `/${hisLis()}/qc/rule`,
    method: "put",
    data: data,
  });
};

/**
 * 删除质控规则
 * @param ruleId
 */
export const delQcRule = (ruleId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/rule/${ruleId}`,
    method: "delete",
  });
};

/**
 * 查询质控规则配置列表
 * @param query
 * @returns {*}
 */
export const listQcRuleConfig = (
  query?: QcRuleConfigQuery,
): AxiosPromise<QcRuleConfigVO[]> => {
  return request({
    url: `/${hisLis()}/qc/rule/config/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询质控规则配置详细
 * @param configId
 */
export const getQcRuleConfig = (
  configId: string | number,
): AxiosPromise<QcRuleConfigVO> => {
  return request({
    url: `/${hisLis()}/qc/rule/config/${configId}`,
    method: "get",
  });
};

/**
 * 新增质控规则配置
 * @param data
 */
export const addQcRuleConfig = (data: QcRuleConfigForm) => {
  return request({
    url: `/${hisLis()}/qc/rule/config`,
    method: "post",
    data: data,
  });
};

/**
 * 修改质控规则配置
 * @param data
 */
export const updateQcRuleConfig = (data: QcRuleConfigForm) => {
  return request({
    url: `/${hisLis()}/qc/rule/config`,
    method: "put",
    data: data,
  });
};

/**
 * 删除质控规则配置
 * @param configId
 */
export const delQcRuleConfig = (configId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisLis()}/qc/rule/config/${configId}`,
    method: "delete",
  });
};
