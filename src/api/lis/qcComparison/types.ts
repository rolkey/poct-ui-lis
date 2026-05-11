export interface QcComparisonVO {
  /**
   * 比对ID
   */
  comparisonId: string;

  /**
   * 比对类型
   */
  comparisonType: string;

  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 参考仪器ID
   */
  referenceInstrumentId: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 比对日期
   */
  comparisonDate: string;

  /**
   * 期号
   */
  periodNumber: string;

  /**
   * 总样本数
   */
  totalSamples: number;

  /**
   * 通过样本数
   */
  passSamples: number;

  /**
   * 通过率
   */
  passRate: number;

  /**
   * 总体结论
   */
  overallResult: string;

  /**
   * 导出文件
   */
  exportFile: string;
}

export interface QcComparisonForm extends BaseEntity {
  /**
   * 比对ID
   */
  comparisonId?: string | number;

  /**
   * 比对类型
   */
  comparisonType?: string;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 参考仪器ID
   */
  referenceInstrumentId?: string | number;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 比对日期
   */
  comparisonDate?: string;

  /**
   * 期号
   */
  periodNumber?: string;

  /**
   * 总样本数
   */
  totalSamples?: number;

  /**
   * 通过样本数
   */
  passSamples?: number;

  /**
   * 通过率
   */
  passRate?: number;

  /**
   * 总体结论
   */
  overallResult?: string;

  /**
   * 导出文件
   */
  exportFile?: string;
}

export interface QcComparisonQuery extends PageQuery {
  /**
   * 比对ID
   */
  comparisonId?: string | number;

  /**
   * 比对类型
   */
  comparisonType?: string;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 参考仪器ID
   */
  referenceInstrumentId?: string | number;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 开始日期
   */
  beginComparisonDate?: string;

  /**
   * 结束日期
   */
  endComparisonDate?: string;

  /**
   * 总体结论
   */
  overallResult?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface ComparisonDetailVO {
  /**
   * 明细ID
   */
  detailId: string;

  /**
   * 比对ID
   */
  comparisonId: string;

  /**
   * 样本编号
   */
  sampleNo: string;

  /**
   * 靶值
   */
  targetValue: number;

  /**
   * 测定值
   */
  testValue: number;

  /**
   * 偏倚
   */
  bias: number;

  /**
   * 允许偏差
   */
  allowDeviation: number;

  /**
   * 样本结果
   */
  sampleResult: string;
}

export interface ComparisonDetailForm extends BaseEntity {
  /**
   * 明细ID
   */
  detailId?: string | number;

  /**
   * 比对ID
   */
  comparisonId?: string | number;

  /**
   * 样本编号
   */
  sampleNo?: string;

  /**
   * 靶值
   */
  targetValue?: number;

  /**
   * 测定值
   */
  testValue?: number;

  /**
   * 偏倚
   */
  bias?: number;

  /**
   * 允许偏差
   */
  allowDeviation?: number;

  /**
   * 样本结果
   */
  sampleResult?: string;
}

// Alias for backward compatibility
export type QcComparisonDetailVO = ComparisonDetailVO;

export interface ComparisonDetailQuery extends PageQuery {
  /**
   * 明细ID
   */
  detailId?: string | number;

  /**
   * 比对ID
   */
  comparisonId?: string | number;

  /**
   * 样本编号
   */
  sampleNo?: string;

  /**
   * 样本结果
   */
  sampleResult?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
