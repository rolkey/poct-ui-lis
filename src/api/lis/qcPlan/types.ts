export interface QcPlanVO {
  /**
   * 质控计划ID
   */
  planId: string;

  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 计划类型
   */
  planType: string;

  /**
   * 计划时间
   */
  scheduleTime: string;

  /**
   * 提前提醒分钟数
   */
  remindBeforeMin: number;

  /**
   * 负责人
   */
  responsiblePerson: string;

  /**
   * 状态
   */
  status: string;
}

export interface QcPlanForm extends BaseEntity {
  /**
   * 质控计划ID
   */
  planId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 计划类型
   */
  planType?: string;

  /**
   * 计划时间
   */
  scheduleTime?: string;

  /**
   * 提前提醒分钟数
   */
  remindBeforeMin?: number;

  /**
   * 负责人
   */
  responsiblePerson?: string;

  /**
   * 状态
   */
  status?: string;
}

export interface QcPlanQuery extends PageQuery {
  /**
   * 质控计划ID
   */
  planId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 计划类型
   */
  planType?: string;

  /**
   * 负责人
   */
  responsiblePerson?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
