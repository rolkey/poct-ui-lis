export interface QcOocRecordVO {
  /**
   * OOC记录ID
   */
  oocId: string;

  /**
   * 质控记录ID
   */
  recordId: string;

  /**
   * OOC原因
   */
  oocCause: string;

  /**
   * 纠正措施
   */
  correctiveAction: string;

  /**
   * 处理人
   */
  handler: string;

  /**
   * 处理时间
   */
  handleTime: string;

  /**
   * OOC状态
   */
  oocStatus: string;

  /**
   * 复测记录ID
   */
  retestRecordId: string;

  /**
   * 解锁时间
   */
  unlockTime: string;

  /**
   * 备注
   */
  remark: string;
}

export interface QcOocRecordForm extends BaseEntity {
  /**
   * OOC记录ID
   */
  oocId?: string | number;

  /**
   * 质控记录ID
   */
  recordId?: string | number;

  /**
   * OOC原因
   */
  oocCause?: string;

  /**
   * 纠正措施
   */
  correctiveAction?: string;

  /**
   * 处理人
   */
  handler?: string;

  /**
   * 处理时间
   */
  handleTime?: string;

  /**
   * OOC状态
   */
  oocStatus?: string;

  /**
   * 复测记录ID
   */
  retestRecordId?: string | number;

  /**
   * 解锁时间
   */
  unlockTime?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface QcOocRecordQuery extends PageQuery {
  /**
   * OOC记录ID
   */
  oocId?: string | number;

  /**
   * 质控记录ID
   */
  recordId?: string | number;

  /**
   * OOC原因
   */
  oocCause?: string;

  /**
   * 处理人
   */
  handler?: string;

  /**
   * OOC状态
   */
  oocStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface OocCauseDictVO {
  /**
   * 原因ID
   */
  causeId: string;

  /**
   * 原因名称
   */
  causeName: string;

  /**
   * 原因类型
   */
  causeType: string;

  /**
   * 排序号
   */
  sortOrder: number;

  /**
   * 状态
   */
  status: string;
}

export interface OocCauseDictForm extends BaseEntity {
  /**
   * 原因ID
   */
  causeId?: string | number;

  /**
   * 原因名称
   */
  causeName?: string;

  /**
   * 原因类型
   */
  causeType?: string;

  /**
   * 排序号
   */
  sortOrder?: number;

  /**
   * 状态
   */
  status?: string;
}

export interface OocCauseDictQuery extends PageQuery {
  /**
   * 原因ID
   */
  causeId?: string | number;

  /**
   * 原因名称
   */
  causeName?: string;

  /**
   * 原因类型
   */
  causeType?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
