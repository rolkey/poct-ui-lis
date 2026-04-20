export interface ChargeItemVO {
  /**
   * 诊疗项目ID
   */
  chargeItemId: string | number;

  /**
   * 诊疗项目名称
   */
  chineseName: string;

  /**
   * 诊疗项目简称
   */
  chineseNameShort: string;

  /**
   * 诊疗项目英文名称
   */
  englishName: string;

  /**
   * HIS代码
   */
  hisId: string | number;

  /**
   * 医保代码（对应惠桥代码）
   */
  medicareId: string | number;

  /**
   * 标准代码（返回给体检系统代码）
   */
  standartId: string | number;

  /**
   * 条码规则序号
   */
  barcodeSeq: string;

  /**
   * 排序号
   */
  chargeItemSort: string;

  /**
   * 诊疗项目分类
   */
  chargeItemClass: string;

  /**
   * 诊疗项目金额（与HIS对应）
   */
  charge: number;

  /**
   * 默认标本种类
   */
  sampleClass: string;

  /**
   * 项目开展类型
   */
  patientType: string;

  /**
   * 采样要求
   */
  samplingRequest: string;

  /**
   * 允许采样时间
   */
  samplingTime: string;

  /**
   * 采样地点
   */
  samplingPlace: string;

  /**
   * 报告时间
   */
  reportTime: string;

  /**
   * 报告地点
   */
  reportPlace: string;

  /**
   * 报告时间序号
   */
  reportTimeSort: string;

  /**
   * 开展时间（默认每天都开展）
   */
  inspectionTime: string;

  /**
   * 工作量
   */
  workload: number;

  /**
   * 项目数量
   */
  testItemCount: number;

  /**
   * 合并标记（共管标识）
   */
  uniteFlag: string;

  /**
   * 展开标记
   */
  expandFlag: string;

  /**
   * 自定义码
   */
  customCode: string;

  /**
   * 拼音码
   */
  spellCode: string;

  /**
   * 五笔码
   */
  strokeCode: string;

  /**
   * 实验室分类
   */
  labClass: string;

  /**
   * 是否常用：1是，空不是
   */
  usedFlag: string;

  /**
   * 使用状态：1使用，0禁用
   */
  stateFlag: string;

  /**
   * 起始编号
   */
  numberFrom: number;

  /**
   * 结束编号
   */
  numberTo: number;

  /**
   * 编号规则
   */
  numberPriority: string;

  /**
   * 标本保留天数
   */
  saveTerm: number;

  /**
   * 所属检验分组
   */
  groupId: string | number;

  /**
   * 发送标记
   */
  sendFlag: string;

  /**
   * 试管标记
   */
  tubeFlag: string;

  /**
   * 队列标记
   */
  queueFlag: string;

  /**
   * 项目代码
   */
  itemCode: number;

  /**
   * 体检代码（未使用）
   */
  tjxmbh: string;

  /**
   * 危急值超时分钟
   */
  policeMinute: number;

  /**
   * HIS名称
   */
  hisName: string;

  /**
   * 检验条码打印份数
   */
  numberPrint: number;

  /**
   * 试管数量
   */
  tubeNumber: number;

  /**
   * 采样人员规则
   */
  samplingPersonRule: string;

  /**
   * 体检关联码
   */
  pesId: string | number;

}

export interface ChargeItemForm extends BaseEntity {
  /**
   * 诊疗项目ID
   */
  chargeItemId?: string | number;

  /**
   * 诊疗项目名称
   */
  chineseName?: string;

  /**
   * 诊疗项目简称
   */
  chineseNameShort?: string;

  /**
   * 诊疗项目英文名称
   */
  englishName?: string;

  /**
   * HIS代码
   */
  hisId?: string | number;

  /**
   * 医保代码（对应惠桥代码）
   */
  medicareId?: string | number;

  /**
   * 标准代码（返回给体检系统代码）
   */
  standartId?: string | number;

  /**
   * 条码规则序号
   */
  barcodeSeq?: string;

  /**
   * 排序号
   */
  chargeItemSort?: string;

  /**
   * 诊疗项目分类
   */
  chargeItemClass?: string;

  /**
   * 诊疗项目金额（与HIS对应）
   */
  charge?: number;

  /**
   * 默认标本种类
   */
  sampleClass?: string;

  /**
   * 项目开展类型
   */
  patientType?: string;

  /**
   * 采样要求
   */
  samplingRequest?: string;

  /**
   * 允许采样时间
   */
  samplingTime?: string;

  /**
   * 采样地点
   */
  samplingPlace?: string;

  /**
   * 报告时间
   */
  reportTime?: string;

  /**
   * 报告地点
   */
  reportPlace?: string;

  /**
   * 报告时间序号
   */
  reportTimeSort?: string;

  /**
   * 开展时间（默认每天都开展）
   */
  inspectionTime?: string;

  /**
   * 工作量
   */
  workload?: number;

  /**
   * 项目数量
   */
  testItemCount?: number;

  /**
   * 合并标记（共管标识）
   */
  uniteFlag?: string;

  /**
   * 展开标记
   */
  expandFlag?: string;

  /**
   * 自定义码
   */
  customCode?: string;

  /**
   * 拼音码
   */
  spellCode?: string;

  /**
   * 五笔码
   */
  strokeCode?: string;

  /**
   * 实验室分类
   */
  labClass?: string;

  /**
   * 是否常用：1是，空不是
   */
  usedFlag?: string;

  /**
   * 使用状态：1使用，0禁用
   */
  stateFlag?: string;

  /**
   * 起始编号
   */
  numberFrom?: number;

  /**
   * 结束编号
   */
  numberTo?: number;

  /**
   * 编号规则
   */
  numberPriority?: string;

  /**
   * 标本保留天数
   */
  saveTerm?: number;

  /**
   * 所属检验分组
   */
  groupId?: string | number;

  /**
   * 发送标记
   */
  sendFlag?: string;

  /**
   * 试管标记
   */
  tubeFlag?: string;

  /**
   * 队列标记
   */
  queueFlag?: string;

  /**
   * 项目代码
   */
  itemCode?: number;

  /**
   * 体检代码（未使用）
   */
  tjxmbh?: string;

  /**
   * 危急值超时分钟
   */
  policeMinute?: number;

  /**
   * HIS名称
   */
  hisName?: string;

  /**
   * 检验条码打印份数
   */
  numberPrint?: number;

  /**
   * 试管数量
   */
  tubeNumber?: number;

  /**
   * 采样人员规则
   */
  samplingPersonRule?: string;

  /**
   * 体检关联码
   */
  pesId?: string | number;

}

export interface ChargeItemQuery extends PageQuery {

  /**
   * 诊疗项目名称
   */
  chineseName?: string;

  /**
   * 诊疗项目简称
   */
  chineseNameShort?: string;

  /**
   * 诊疗项目英文名称
   */
  englishName?: string;

  /**
   * HIS代码
   */
  hisId?: string | number;

  /**
   * 医保代码（对应惠桥代码）
   */
  medicareId?: string | number;

  /**
   * 标准代码（返回给体检系统代码）
   */
  standartId?: string | number;

  /**
   * 条码规则序号
   */
  barcodeSeq?: string;

  /**
   * 排序号
   */
  chargeItemSort?: string;

  /**
   * 诊疗项目分类
   */
  chargeItemClass?: string;

  /**
   * 诊疗项目金额（与HIS对应）
   */
  charge?: number;

  /**
   * 默认标本种类
   */
  sampleClass?: string;

  /**
   * 项目开展类型
   */
  patientType?: string;

  /**
   * 采样要求
   */
  samplingRequest?: string;

  /**
   * 允许采样时间
   */
  samplingTime?: string;

  /**
   * 采样地点
   */
  samplingPlace?: string;

  /**
   * 报告时间
   */
  reportTime?: string;

  /**
   * 报告地点
   */
  reportPlace?: string;

  /**
   * 报告时间序号
   */
  reportTimeSort?: string;

  /**
   * 开展时间（默认每天都开展）
   */
  inspectionTime?: string;

  /**
   * 工作量
   */
  workload?: number;

  /**
   * 项目数量
   */
  testItemCount?: number;

  /**
   * 合并标记（共管标识）
   */
  uniteFlag?: string;

  /**
   * 展开标记
   */
  expandFlag?: string;

  /**
   * 自定义码
   */
  customCode?: string;

  /**
   * 拼音码
   */
  spellCode?: string;

  /**
   * 五笔码
   */
  strokeCode?: string;

  /**
   * 实验室分类
   */
  labClass?: string;

  /**
   * 是否常用：1是，空不是
   */
  usedFlag?: string;

  /**
   * 使用状态：1使用，0禁用
   */
  stateFlag?: string;

  /**
   * 起始编号
   */
  numberFrom?: number;

  /**
   * 结束编号
   */
  numberTo?: number;

  /**
   * 编号规则
   */
  numberPriority?: string;

  /**
   * 标本保留天数
   */
  saveTerm?: number;

  /**
   * 所属检验分组
   */
  groupId?: string | number;

  /**
   * 发送标记
   */
  sendFlag?: string;

  /**
   * 试管标记
   */
  tubeFlag?: string;

  /**
   * 队列标记
   */
  queueFlag?: string;

  /**
   * 项目代码
   */
  itemCode?: number;

  /**
   * 体检代码（未使用）
   */
  tjxmbh?: string;

  /**
   * 危急值超时分钟
   */
  policeMinute?: number;

  /**
   * HIS名称
   */
  hisName?: string;

  /**
   * 检验条码打印份数
   */
  numberPrint?: number;

  /**
   * 试管数量
   */
  tubeNumber?: number;

  /**
   * 采样人员规则
   */
  samplingPersonRule?: string;

  /**
   * 体检关联码
   */
  pesId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}



