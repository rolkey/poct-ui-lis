export interface QcEqaPlanVO {
  /**
   * 室间质评计划ID
   */
  eqaPlanId: string;

  /**
   * 计划年份
   */
  planYear: string;

  /**
   * 组织机构
   */
  organization: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 计划日期
   */
  scheduledDate: string;

  /**
   * 状态
   */
  status: string;
}

export interface QcEqaPlanForm extends BaseEntity {
  /**
   * 室间质评计划ID
   */
  eqaPlanId?: string | number;

  /**
   * 计划年份
   */
  planYear?: string;

  /**
   * 组织机构
   */
  organization?: string;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 计划日期
   */
  scheduledDate?: string;

  /**
   * 状态
   */
  status?: string;
}

export interface QcEqaPlanQuery extends PageQuery {
  /**
   * 室间质评计划ID
   */
  eqaPlanId?: string | number;

  /**
   * 计划年份
   */
  planYear?: string;

  /**
   * 组织机构
   */
  organization?: string;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface QcEqaRecordVO {
  /**
   * 室间质评记录ID
   */
  eqaRecordId: string;

  /**
   * 室间质评计划ID
   */
  eqaPlanId: string;

  /**
   * 结果值
   */
  resultValue: string;

  /**
   * 报告文件
   */
  reportFile: string;

  /**
   * 得分
   */
  score: number;

  /**
   * 结果
   */
  result: string;

  /**
   * 整改记录
   */
  rectifyRecord: string;

  /**
   * 报告日期
   */
  reportDate: string;
}

export interface QcEqaRecordForm extends BaseEntity {
  /**
   * 室间质评记录ID
   */
  eqaRecordId?: string | number;

  /**
   * 室间质评计划ID
   */
  eqaPlanId?: string | number;

  /**
   * 结果值
   */
  resultValue?: string;

  /**
   * 报告文件
   */
  reportFile?: string;

  /**
   * 得分
   */
  score?: number;

  /**
   * 结果
   */
  result?: string;

  /**
   * 整改记录
   */
  rectifyRecord?: string;

  /**
   * 报告日期
   */
  reportDate?: string;
}

export interface QcEqaRecordQuery extends PageQuery {
  /**
   * 室间质评记录ID
   */
  eqaRecordId?: string | number;

  /**
   * 室间质评计划ID
   */
  eqaPlanId?: string | number;

  /**
   * 结果
   */
  result?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
