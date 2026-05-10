export interface QcRuleVO {
  /**
   * 规则ID
   */
  ruleId: string;

  /**
   * 规则编码
   */
  ruleCode: string;

  /**
   * 规则名称
   */
  ruleName: string;

  /**
   * 规则类型
   */
  ruleType: string;

  /**
   * 规则描述
   */
  description: string;

  /**
   * 排序号
   */
  sortOrder: number;
}

export interface QcRuleForm extends BaseEntity {
  /**
   * 规则ID
   */
  ruleId?: string | number;

  /**
   * 规则编码
   */
  ruleCode?: string;

  /**
   * 规则名称
   */
  ruleName?: string;

  /**
   * 规则类型
   */
  ruleType?: string;

  /**
   * 规则描述
   */
  description?: string;

  /**
   * 排序号
   */
  sortOrder?: number;
}

export interface QcRuleQuery extends PageQuery {
  /**
   * 规则ID
   */
  ruleId?: string | number;

  /**
   * 规则编码
   */
  ruleCode?: string;

  /**
   * 规则名称
   */
  ruleName?: string;

  /**
   * 规则类型
   */
  ruleType?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface QcRuleConfigVO {
  /**
   * 配置ID
   */
  configId: string;

  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 规则ID集合
   */
  ruleIds: string;

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
   * 总允许误差
   */
  tea: number;

  /**
   * 允许偏倚
   */
  allowableBias: number;

  /**
   * 状态
   */
  status: string;
}

export interface QcRuleConfigForm extends BaseEntity {
  /**
   * 配置ID
   */
  configId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 规则ID集合
   */
  ruleIds?: string;

  /**
   * 均值
   */
  mean?: number;

  /**
   * 标准差
   */
  sd?: number;

  /**
   * 变异系数
   */
  cv?: number;

  /**
   * 总允许误差
   */
  tea?: number;

  /**
   * 允许偏倚
   */
  allowableBias?: number;

  /**
   * 状态
   */
  status?: string;
}

export interface QcRuleConfigQuery extends PageQuery {
  /**
   * 配置ID
   */
  configId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

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
