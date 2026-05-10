export interface QcReportQuery extends PageQuery {
  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface QcInControlRateVO {
  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 仪器名称
   */
  instrumentName: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 检验项目名称
   */
  testItemName: string;

  /**
   * 总次数
   */
  totalCount: number;

  /**
   * 在控次数
   */
  inControlCount: number;

  /**
   * 在控率
   */
  inControlRate: number;

  /**
   * 统计月份
   */
  statMonth: string;
}

export interface QcMonthlyReportVO {
  /**
   * 月份
   */
  month: string;

  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 仪器名称
   */
  instrumentName: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 检验项目名称
   */
  testItemName: string;

  /**
   * 测定次数
   */
  testCount: number;

  /**
   * 均值
   */
  mean: number;

  /**
   * 标准差
   */
  sd: number;

  /**
   * 变异系数
   */
  cv: number;

  /**
   * 在控率
   */
  inControlRate: number;
}

export interface QcTrendAnalysisVO {
  /**
   * 测定日期
   */
  testDate: string;

  /**
   * 测定值
   */
  testValue: number;

  /**
   * 均值
   */
  mean: number;

  /**
   * 标准差上限
   */
  upperSd: number;

  /**
   * 标准差下限
   */
  lowerSd: number;

  /**
   * 2倍标准差上限
   */
  upper2Sd: number;

  /**
   * 2倍标准差下限
   */
  lower2Sd: number;

  /**
   * 3倍标准差上限
   */
  upper3Sd: number;

  /**
   * 3倍标准差下限
   */
  lower3Sd: number;
}

export interface QcInstrumentRateVO {
  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 仪器名称
   */
  instrumentName: string;

  /**
   * 总次数
   */
  totalCount: number;

  /**
   * 在控次数
   */
  inControlCount: number;

  /**
   * 在控率
   */
  inControlRate: number;

  /**
   * 失控次数
   */
  outOfControlCount: number;

  /**
   * 失控率
   */
  outOfControlRate: number;
}
