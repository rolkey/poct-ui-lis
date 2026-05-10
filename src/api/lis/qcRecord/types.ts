export interface QcRecordVO {
  /**
   * 质控记录ID
   */
  recordId: string;

  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 批次ID
   */
  batchId: string;

  /**
   * 测定值
   */
  testValue: number;

  /**
   * 判定结果
   */
  judgment: string;

  /**
   * 触发规则
   */
  triggeredRules: string;

  /**
   * 采集类型
   */
  collectionType: string;

  /**
   * 操作人
   */
  operator: string;

  /**
   * 测定时间
   */
  testTime: string;

  /**
   * 备注
   */
  remark: string;
}

export interface QcRecordForm extends BaseEntity {
  /**
   * 质控记录ID
   */
  recordId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 批次ID
   */
  batchId?: string | number;

  /**
   * 测定值
   */
  testValue?: number;

  /**
   * 判定结果
   */
  judgment?: string;

  /**
   * 触发规则
   */
  triggeredRules?: string;

  /**
   * 采集类型
   */
  collectionType?: string;

  /**
   * 操作人
   */
  operator?: string;

  /**
   * 测定时间
   */
  testTime?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface QcRecordQuery extends PageQuery {
  /**
   * 质控记录ID
   */
  recordId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 批次ID
   */
  batchId?: string | number;

  /**
   * 判定结果
   */
  judgment?: string;

  /**
   * 采集类型
   */
  collectionType?: string;

  /**
   * 操作人
   */
  operator?: string;

  /**
   * 开始时间
   */
  beginTestTime?: string;

  /**
   * 结束时间
   */
  endTestTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
