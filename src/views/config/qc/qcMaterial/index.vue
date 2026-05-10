<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="质控品名称" prop="materialName">
              <el-input
                v-model="queryParams.materialName"
                placeholder="请输入质控品名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="水平级别" prop="level">
              <el-select
                v-model="queryParams.level"
                placeholder="请选择水平级别"
                clearable
              >
                <el-option label="低值(LOW)" value="LOW" />
                <el-option label="中值(MEDIUM)" value="MEDIUM" />
                <el-option label="高值(HIGH)" value="HIGH" />
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input
                v-model="queryParams.manufacturer"
                placeholder="请输入生产厂家"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option label="启用" value="0" />
                <el-option label="禁用" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" class="flex flex-col flex-1 table-card">
      <template #header>
        <el-row ref="editButtonsRef" :gutter="10" class="mb-[6px]">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['lis:qc:material:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['lis:qc:material:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['lis:qc:material:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['lis:qc:material:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="qcMaterialList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
          row-key="materialId"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="质控品ID" align="center" prop="materialId" width="80" />
          <el-table-column label="质控品名称" align="center" prop="materialName" min-width="140" />
          <el-table-column label="检验项目ID" align="center" prop="testItemId" width="100" />
          <el-table-column label="水平级别" align="center" prop="level" width="120">
            <template #default="scope">
              <el-tag
                :type="scope.row.level === 'LOW' ? 'success' : scope.row.level === 'MEDIUM' ? 'warning' : 'danger'"
                disable-transitions
              >
                {{ scope.row.level === 'LOW' ? '低值' : scope.row.level === 'MEDIUM' ? '中值' : '高值' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="生产厂家" align="center" prop="manufacturer" min-width="140" />
          <el-table-column label="注册证号" align="center" prop="regCertNo" width="130" />
          <el-table-column label="储存温度" align="center" prop="storageTemp" width="100" />
          <el-table-column label="状态" align="center" prop="status" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'info'" disable-transitions>
                {{ scope.row.status === '0' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="170" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            width="120"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['lis:qc:material:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['lis:qc:material:remove']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="批次管理" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Collection"
                  @click="handleBatchManage(scope.row)"
                  v-hasPermi="['lis:qc:material:edit']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        ref="paginationRef"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 添加或修改质控品对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body draggable>
      <el-form ref="qcMaterialFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="质控品名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder="请输入质控品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验项目" prop="testItemId">
              <el-select v-model="form.testItemId" placeholder="请选择检验项目" filterable clearable>
                <el-option
                  v-for="item in testItemOptions"
                  :key="item.testItemId"
                  :label="item.chineseName"
                  :value="item.testItemId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="水平级别" prop="level">
              <el-select v-model="form.level" placeholder="请选择水平级别" clearable>
                <el-option label="低值(LOW)" value="LOW" />
                <el-option label="中值(MEDIUM)" value="MEDIUM" />
                <el-option label="高值(HIGH)" value="HIGH" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册证号" prop="regCertNo">
              <el-input v-model="form.regCertNo" placeholder="请输入注册证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="储存温度" prop="storageTemp">
              <el-input v-model="form.storageTemp" placeholder="请输入储存温度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="0">启用</el-radio>
                <el-radio value="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批次管理对话框 -->
    <el-dialog
      :title="batchDialog.title"
      v-model="batchDialog.visible"
      width="800px"
      append-to-body
      draggable
    >
      <template #header>
        <span>{{ batchDialog.title }}</span>
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          class="ml-[16px]"
          @click="handleBatchAdd"
          v-hasPermi="['lis:qc:material:edit']"
        >新增批次</el-button>
      </template>
      <el-table
        v-loading="batchLoading"
        border
        :data="batchList"
        max-height="400"
        style="width: 100%"
      >
        <el-table-column label="批号" align="center" prop="lotNo" min-width="120" />
        <el-table-column label="靶值" align="center" prop="targetValue" width="80" />
        <el-table-column label="标准差" align="center" prop="sd" width="80" />
        <el-table-column label="变异系数" align="center" prop="cv" width="80" />
        <el-table-column label="范围下限" align="center" prop="rangeLow" width="90" />
        <el-table-column label="范围上限" align="center" prop="rangeHigh" width="90" />
        <el-table-column label="有效期" align="center" prop="expiryDate" width="110" />
        <el-table-column label="开瓶有效天数" align="center" prop="openBottleValidDays" width="110" />
        <el-table-column label="批次状态" align="center" prop="batchStatus" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.batchStatus === '0' ? 'success' : 'info'" disable-transitions>
              {{ scope.row.batchStatus === '0' ? '正常' : '过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleBatchUpdate(scope.row)"
                v-hasPermi="['lis:qc:material:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleBatchDelete(scope.row)"
                v-hasPermi="['lis:qc:material:edit']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchDialog.visible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改批次对话框 -->
    <el-dialog
      :title="batchFormDialog.title"
      v-model="batchFormDialog.visible"
      width="700px"
      append-to-body
      draggable
    >
      <el-form ref="batchFormRef" :model="batchForm" :rules="batchRules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="批号" prop="lotNo">
              <el-input v-model="batchForm.lotNo" placeholder="请输入批号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器" prop="instrumentId">
              <el-select v-model="batchForm.instrumentId" placeholder="请选择仪器" filterable clearable>
                <el-option
                  v-for="item in instrumentOptions"
                  :key="item.instrumentId"
                  :label="item.instrumentName"
                  :value="item.instrumentId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="靶值" prop="targetValue">
              <el-input-number v-model="batchForm.targetValue" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准差(SD)" prop="sd">
              <el-input-number v-model="batchForm.sd" :precision="4" :step="0.01" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="变异系数(CV)" prop="cv">
              <el-input-number v-model="batchForm.cv" :precision="4" :step="0.01" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="范围下限" prop="rangeLow">
              <el-input v-model="batchForm.rangeLow" placeholder="请输入范围下限" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="范围上限" prop="rangeHigh">
              <el-input v-model="batchForm.rangeHigh" placeholder="请输入范围上限" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="expiryDate">
              <el-date-picker
                v-model="batchForm.expiryDate"
                type="date"
                placeholder="选择有效期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开瓶有效天数" prop="openBottleValidDays">
              <el-input-number v-model="batchForm.openBottleValidDays" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开瓶日期" prop="openDate">
              <el-date-picker
                v-model="batchForm.openDate"
                type="date"
                placeholder="选择开瓶日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入库日期" prop="inStockDate">
              <el-date-picker
                v-model="batchForm.inStockDate"
                type="date"
                placeholder="选择入库日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库人" prop="inStockPerson">
              <el-input v-model="batchForm.inStockPerson" placeholder="请输入入库人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="批次状态" prop="batchStatus">
              <el-radio-group v-model="batchForm.batchStatus">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">过期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="batchButtonLoading" type="primary" @click="submitBatchForm">确 定</el-button>
          <el-button @click="cancelBatchForm">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="QcMaterial" lang="ts">
import {
  listQcMaterial,
  getQcMaterial,
  delQcMaterial,
  addQcMaterial,
  updateQcMaterial,
  listQcMaterialBatch,
  addQcMaterialBatch,
  updateQcMaterialBatch,
  delQcMaterialBatch,
} from "@/api/lis/qcMaterial";
import {
  QcMaterialVO,
  QcMaterialForm,
  QcMaterialQuery,
  QcMaterialBatchVO,
  QcMaterialBatchForm,
} from "@/api/lis/qcMaterial/types";
import { listTestItem } from "@/api/lis/testItem";
import { TestItemVO } from "@/api/lis/testItem/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const qcMaterialList = ref<QcMaterialVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const qcMaterialFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: QcMaterialForm = {
  materialId: undefined,
  materialName: undefined,
  testItemId: undefined,
  level: undefined,
  manufacturer: undefined,
  regCertNo: undefined,
  storageTemp: undefined,
  status: "0",
};
const data = reactive<PageData<QcMaterialForm, QcMaterialQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialName: undefined,
    level: undefined,
    manufacturer: undefined,
    status: undefined,
    params: {},
  },
  rules: {
    materialName: [{ required: true, message: "质控品名称不能为空", trigger: "blur" }],
    testItemId: [{ required: true, message: "请选择检验项目", trigger: "change" }],
    level: [{ required: true, message: "请选择水平级别", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 检验项目下拉选项
const testItemOptions = ref<TestItemVO[]>([]);
const loadTestItemOptions = async () => {
  const res = await listTestItem({ pageNum: 1, pageSize: 999, params: {} });
  testItemOptions.value = res.rows;
};

// 仪器下拉选项
const instrumentOptions = ref<CommInstrumentVO[]>([]);
const loadInstrumentOptions = async () => {
  const res = await listCommInstrument({ pageNum: 1, pageSize: 999, params: {} });
  instrumentOptions.value = res.rows;
};

/** 查询质控品列表 */
const getList = async () => {
  loading.value = true;
  const res = await listQcMaterial(queryParams.value);
  qcMaterialList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
const tableHeight = ref("500px");

const updateHeight = () => {
  setTimeout(() => {
    if (tableWrapperRef.value) {
      const pageinationHeight = paginationRef.value?.$el?.clientHeight || 0;
      const editButtonsHeight = editButtonsRef.value?.$el?.clientHeight || 0;
      const tabHeightCale =
        tableWrapperRef.value.clientHeight - pageinationHeight - editButtonsHeight - 40;
      if (tabHeightCale > 500) {
        queryParams.value.pageSize = 20;
      } else if (tabHeightCale < 500) {
        queryParams.value.pageSize = 10;
      }
      tableHeight.value = tabHeightCale + "px";
    }
  }, 150);
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  qcMaterialFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: QcMaterialVO[]) => {
  ids.value = selection.map((item) => item.materialId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加质控品";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: QcMaterialVO) => {
  reset();
  const _materialId = row?.materialId || ids.value[0];
  const res = await getQcMaterial(_materialId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改质控品";
};

/** 提交按钮 */
const submitForm = () => {
  qcMaterialFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.materialId) {
        await updateQcMaterial(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQcMaterial(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: QcMaterialVO) => {
  const _materialIds = row?.materialId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除质控品编号为"' + _materialIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delQcMaterial(_materialIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "lis/qc/material/export",
    {
      ...queryParams.value,
    },
    `qcMaterial_${new Date().getTime()}.xlsx`,
  );
};

// ========== 批次管理 ==========
const batchDialog = reactive<DialogOption>({
  visible: false,
  title: "",
});
const batchLoading = ref(false);
const batchList = ref<QcMaterialBatchVO[]>([]);
const currentMaterialId = ref<string | number>("");

const handleBatchManage = async (row: QcMaterialVO) => {
  currentMaterialId.value = row.materialId;
  batchDialog.title = `批次管理 - ${row.materialName}`;
  batchDialog.visible = true;
  await loadBatchList();
};

const loadBatchList = async () => {
  batchLoading.value = true;
  const res = await listQcMaterialBatch({ materialId: currentMaterialId.value, pageNum: 1, pageSize: 999, params: {} });
  batchList.value = res.rows;
  batchLoading.value = false;
};

// 批次表单
const batchFormDialog = reactive<DialogOption>({
  visible: false,
  title: "",
});
const batchFormRef = ref<ElFormInstance>();
const batchButtonLoading = ref(false);

const initBatchFormData: QcMaterialBatchForm = {
  batchId: undefined,
  materialId: undefined,
  lotNo: undefined,
  deptId: undefined,
  instrumentId: undefined,
  targetValue: undefined,
  sd: undefined,
  cv: undefined,
  rangeLow: undefined,
  rangeHigh: undefined,
  expiryDate: undefined,
  openBottleValidDays: undefined,
  openDate: undefined,
  inStockDate: undefined,
  inStockPerson: undefined,
  batchStatus: "0",
};
const batchForm = ref<QcMaterialBatchForm>({ ...initBatchFormData });
const batchRules: FormRules = {
  lotNo: [{ required: true, message: "批号不能为空", trigger: "blur" }],
  instrumentId: [{ required: true, message: "请选择仪器", trigger: "change" }],
  targetValue: [{ required: true, message: "靶值不能为空", trigger: "blur" }],
};

const handleBatchAdd = () => {
  batchForm.value = {
    ...initBatchFormData,
    materialId: currentMaterialId.value,
  };
  batchFormDialog.visible = true;
  batchFormDialog.title = "新增批次";
};

const handleBatchUpdate = (row: QcMaterialBatchVO) => {
  Object.assign(batchForm.value, row);
  batchFormDialog.visible = true;
  batchFormDialog.title = "修改批次";
};

const submitBatchForm = () => {
  batchFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      batchButtonLoading.value = true;
      try {
        if (batchForm.value.batchId) {
          await updateQcMaterialBatch(batchForm.value);
        } else {
          await addQcMaterialBatch(batchForm.value);
        }
        proxy?.$modal.msgSuccess("操作成功");
        batchFormDialog.visible = false;
        await loadBatchList();
      } finally {
        batchButtonLoading.value = false;
      }
    }
  });
};

const cancelBatchForm = () => {
  batchForm.value = { ...initBatchFormData };
  batchFormRef.value?.resetFields();
  batchFormDialog.visible = false;
};

const handleBatchDelete = async (row: QcMaterialBatchVO) => {
  await proxy?.$modal
    .confirm('是否确认删除批次"' + row.lotNo + '"的数据项？')
    .finally(() => (batchLoading.value = false));
  await delQcMaterialBatch(row.batchId);
  proxy?.$modal.msgSuccess("删除成功");
  await loadBatchList();
};

onMounted(async () => {
  await loadTestItemOptions();
  await loadInstrumentOptions();
  getList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
