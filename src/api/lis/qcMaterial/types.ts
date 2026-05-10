export interface QcMaterialVO {
  /**
   * 质控品ID
   */
  materialId: string;

  /**
   * 质控品名称
   */
  materialName: string;

  /**
   * 检验项目ID
   */
  testItemId: number;

  /**
   * 水平/浓度级别
   */
  level: string;

  /**
   * 生产厂家
   */
  manufacturer: string;

  /**
   * 注册证号
   */
  regCertNo: string;

  /**
   * 储存温度
   */
  storageTemp: string;

  /**
   * 状态
   */
  status: string;
}

export interface QcMaterialForm extends BaseEntity {
  /**
   * 质控品ID
   */
  materialId?: string | number;

  /**
   * 质控品名称
   */
  materialName?: string;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 水平/浓度级别
   */
  level?: string;

  /**
   * 生产厂家
   */
  manufacturer?: string;

  /**
   * 注册证号
   */
  regCertNo?: string;

  /**
   * 储存温度
   */
  storageTemp?: string;

  /**
   * 状态
   */
  status?: string;
}

export interface QcMaterialQuery extends PageQuery {
  /**
   * 质控品ID
   */
  materialId?: string | number;

  /**
   * 质控品名称
   */
  materialName?: string;

  /**
   * 检验项目ID
   */
  testItemId?: number;

  /**
   * 水平/浓度级别
   */
  level?: string;

  /**
   * 生产厂家
   */
  manufacturer?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface QcMaterialBatchVO {
  /**
   * 批次ID
   */
  batchId: string;

  /**
   * 质控品ID
   */
  materialId: string;

  /**
   * 批号
   */
  lotNo: string;

  /**
   * 部门ID
   */
  deptId: string;

  /**
   * 仪器ID
   */
  instrumentId: string;

  /**
   * 靶值
   */
  targetValue: number;

  /**
   * 标准差
   */
  sd: number;

  /**
   * 变异系数
   */
  cv: number;

  /**
   * 范围下限
   */
  rangeLow: string;

  /**
   * 范围上限
   */
  rangeHigh: string;

  /**
   * 有效期
   */
  expiryDate: string;

  /**
   * 开瓶有效天数
   */
  openBottleValidDays: number;

  /**
   * 开瓶日期
   */
  openDate: string;

  /**
   * 入库日期
   */
  inStockDate: string;

  /**
   * 入库人
   */
  inStockPerson: string;

  /**
   * 批次状态
   */
  batchStatus: string;
}

export interface QcMaterialBatchForm extends BaseEntity {
  /**
   * 批次ID
   */
  batchId?: string | number;

  /**
   * 质控品ID
   */
  materialId?: string | number;

  /**
   * 批号
   */
  lotNo?: string;

  /**
   * 部门ID
   */
  deptId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 靶值
   */
  targetValue?: number;

  /**
   * 标准差
   */
  sd?: number;

  /**
   * 变异系数
   */
  cv?: number;

  /**
   * 范围下限
   */
  rangeLow?: string;

  /**
   * 范围上限
   */
  rangeHigh?: string;

  /**
   * 有效期
   */
  expiryDate?: string;

  /**
   * 开瓶有效天数
   */
  openBottleValidDays?: number;

  /**
   * 开瓶日期
   */
  openDate?: string;

  /**
   * 入库日期
   */
  inStockDate?: string;

  /**
   * 入库人
   */
  inStockPerson?: string;

  /**
   * 批次状态
   */
  batchStatus?: string;
}

export interface QcMaterialBatchQuery extends PageQuery {
  /**
   * 批次ID
   */
  batchId?: string | number;

  /**
   * 质控品ID
   */
  materialId?: string | number;

  /**
   * 批号
   */
  lotNo?: string;

  /**
   * 部门ID
   */
  deptId?: string | number;

  /**
   * 仪器ID
   */
  instrumentId?: string | number;

  /**
   * 批次状态
   */
  batchStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
