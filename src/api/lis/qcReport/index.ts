import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  QcReportQuery,
  QcInControlRateVO,
  QcMonthlyReportVO,
  QcTrendAnalysisVO,
  QcInstrumentRateVO,
} from "@/api/lis/qcReport/types";
import { useServiceStore } from "@/store/modules/services";

const hisLis = () => useServiceStore().apiUrl.hisLis;

/**
 * 查询在控率统计
 * @param query
 * @returns {*}
 */
export const getInControlRate = (
  query?: QcReportQuery,
): AxiosPromise<QcInControlRateVO[]> => {
  return request({
    url: `/${hisLis()}/qc/report/inControlRate`,
    method: "get",
    params: query,
  });
};

/**
 * 查询月度质控报告
 * @param query
 * @returns {*}
 */
export const getMonthlyReport = (
  query?: QcReportQuery,
): AxiosPromise<QcMonthlyReportVO[]> => {
  return request({
    url: `/${hisLis()}/qc/report/monthly`,
    method: "get",
    params: query,
  });
};

/**
 * 查询趋势分析数据
 * @param query
 * @returns {*}
 */
export const getTrendAnalysis = (
  query?: QcReportQuery,
): AxiosPromise<QcTrendAnalysisVO[]> => {
  return request({
    url: `/${hisLis()}/qc/report/trend`,
    method: "get",
    params: query,
  });
};

/**
 * 查询仪器质控率统计
 * @param query
 * @returns {*}
 */
export const getInstrumentRate = (
  query?: QcReportQuery,
): AxiosPromise<QcInstrumentRateVO[]> => {
  return request({
    url: `/${hisLis()}/qc/report/instrumentRate`,
    method: "get",
    params: query,
  });
};

/**
 * 导出PDF报告
 * @param query
 */
export const exportPdf = (query?: QcReportQuery) => {
  return request({
    url: `/${hisLis()}/qc/report/export/pdf`,
    method: "get",
    params: query,
    responseType: "blob",
  });
};

/**
 * 导出Excel报告
 * @param query
 */
export const exportExcel = (query?: QcReportQuery) => {
  return request({
    url: `/${hisLis()}/qc/report/export/excel`,
    method: "get",
    params: query,
    responseType: "blob",
  });
};
