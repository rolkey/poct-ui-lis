<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="比对类型" prop="comparisonType">
              <el-select v-model="queryParams.comparisonType" placeholder="请选择比对类型" clearable>
                <el-option label="仪器间比对" value="INTER_INSTRUMENT" />
                <el-option label="方法学比对" value="METHODOLOGY" />
                <el-option label="人员比对" value="OPERATOR" />
              </el-select>
            </el-form-item>
            <el-form-item label="仪器" prop="instrumentId">
              <el-select
                v-model="queryParams.instrumentId"
                placeholder="请选择仪器"
                clearable
                filterable
              >
                <el-option
                  v-for="item in instrumentOptions"
                  :key="item.instrumentId"
                  :label="item.instrumentName"
                  :value="item.instrumentId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="检验项目" prop="testItemId">
              <el-select
                v-model="queryParams.testItemId"
                placeholder="请选择检验项目"
                clearable
                filterable
              >
                <el-option
                  v-for="item in testItemOptions"
                  :key="item.testItemId"
                  :label="item.chineseName"
                  :value="item.testItemId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="总体结果" prop="overallResult">
              <el-select v-model="queryParams.overallResult" placeholder="请选择总体结果" clearable>
                <el-option label="通过" value="PASS" />
                <el-option label="不通过" value="FAIL" />
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
              v-hasPermi="['lis:qc:comparison:edit']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['lis:qc:comparison:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['lis:qc:comparison:export']"
            >导出报告</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="qcComparisonList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
          @expand-change="handleExpandChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="expand" width="40">
            <template #default="scope">
              <div class="p-3">
                <h4 class="mb-2 font-bold">样本明细</h4>
                <el-table :data="scope.row.details || []" border size="small">
                  <el-table-column label="明细ID" align="center" prop="detailId" width="80" />
                  <el-table-column label="样本编号" align="center" prop="sampleNo" width="120" />
                  <el-table-column label="靶值" align="center" prop="targetValue" width="100">
                    <template #default="detail">
                      <span class="font-mono">{{ detail.row.targetValue }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="测定值" align="center" prop="testValue" width="100">
                    <template #default="detail">
                      <span class="font-mono">{{ detail.row.testValue }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="偏倚" align="center" prop="bias" width="100">
                    <template #default="detail">
                      <span class="font-mono">{{ detail.row.bias }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="允许偏差" align="center" prop="allowDeviation" width="100">
                    <template #default="detail">
                      <span class="font-mono">{{ detail.row.allowDeviation }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="样本结果" align="center" prop="sampleResult" width="100">
                    <template #default="detail">
                      <el-tag
                        :type="detail.row.sampleResult === 'PASS' ? 'success' : 'danger'"
                        disable-transitions
                      >
                        {{ detail.row.sampleResult === 'PASS' ? '通过' : '不通过' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="比对ID" align="center" prop="comparisonId" width="80" />
          <el-table-column label="比对类型" align="center" prop="comparisonType" width="120">
            <template #default="scope">
              {{ scope.row.comparisonType === 'INTER_INSTRUMENT' ? '仪器间比对' : scope.row.comparisonType === 'METHODOLOGY' ? '方法学比对' : '人员比对' }}
            </template>
          </el-table-column>
          <el-table-column label="仪器" align="center" prop="instrumentName" min-width="120" />
          <el-table-column label="参考仪器" align="center" prop="referenceInstrumentName" min-width="120" />
          <el-table-column label="检验项目" align="center" prop="testItemName" min-width="120" />
          <el-table-column label="比对日期" align="center" prop="comparisonDate" width="120" />
          <el-table-column label="期号" align="center" prop="periodNumber" width="80" />
          <el-table-column label="总样本数" align="center" prop="totalSamples" width="90" />
          <el-table-column label="通过数" align="center" prop="passSamples" width="80" />
          <el-table-column label="通过率" align="center" prop="passRate" width="80">
            <template #default="scope">
              <span class="font-mono">{{ scope.row.passRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="总体结果" align="center" prop="overallResult" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.overallResult === 'PASS' ? 'success' : 'danger'"
                disable-transitions
              >
                {{ scope.row.overallResult === 'PASS' ? '通过' : '不通过' }}
              </el-tag>
            </template>
          </el-table-column>
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
                  v-hasPermi="['lis:qc:comparison:edit']"
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

    <!-- 添加或修改一致性比对对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="700px" append-to-body draggable>
      <el-form ref="comparisonFormRef" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="比对类型" prop="comparisonType">
              <el-select v-model="form.comparisonType" placeholder="请选择比对类型" clearable>
                <el-option label="仪器间比对" value="INTER_INSTRUMENT" />
                <el-option label="方法学比对" value="METHODOLOGY" />
                <el-option label="人员比对" value="OPERATOR" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="比对日期" prop="comparisonDate">
              <el-date-picker
                v-model="form.comparisonDate"
                type="date"
                placeholder="选择比对日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪器" prop="instrumentId">
              <el-select v-model="form.instrumentId" placeholder="请选择仪器" filterable clearable>
                <el-option
                  v-for="item in instrumentOptions"
                  :key="item.instrumentId"
                  :label="item.instrumentName"
                  :value="item.instrumentId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参考仪器" prop="referenceInstrumentId">
              <el-select v-model="form.referenceInstrumentId" placeholder="请选择参考仪器" filterable clearable>
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
          <el-col :span="12">
            <el-form-item label="期号" prop="periodNumber">
              <el-input v-model="form.periodNumber" placeholder="请输入期号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总样本数" prop="totalSamples">
              <el-input-number v-model="form.totalSamples" :min="1" :max="999" style="width: 100%" @change="calcPassRate" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通过数" prop="passSamples">
              <el-input-number v-model="form.passSamples" :min="0" :max="form.totalSamples || 999" style="width: 100%" @change="calcPassRate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="通过率" prop="passRate">
              <el-input v-model="form.passRate" disabled placeholder="自动计算">
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总体结果" prop="overallResult">
              <el-select v-model="form.overallResult" placeholder="请选择总体结果" clearable>
                <el-option label="通过" value="PASS" />
                <el-option label="不通过" value="FAIL" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">样本明细</el-divider>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" plain icon="Plus" @click="addDetailRow">添加样本</el-button>
          </el-col>
        </el-row>
        <el-table :data="form.details || []" border size="small" class="mt-2">
          <el-table-column label="样本编号" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.sampleNo" placeholder="样本编号" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="靶值" align="center" width="120">
            <template #default="scope">
              <el-input-number v-model="scope.row.targetValue" :precision="4" :step="0.1" size="small" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column label="测定值" align="center" width="120">
            <template #default="scope">
              <el-input-number v-model="scope.row.testValue" :precision="4" :step="0.1" size="small" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column label="允许偏差" align="center" width="120">
            <template #default="scope">
              <el-input-number v-model="scope.row.allowDeviation" :precision="4" :step="0.1" size="small" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template #default="scope">
              <el-button link type="danger" icon="Delete" @click="form.details?.splice(scope.$index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="QcComparison" lang="ts">
import {
  listQcComparison,
  getQcComparison,
  addQcComparison,
  updateQcComparison,
  listQcComparisonDetail,
} from "@/api/lis/qcComparison";
import {
  QcComparisonVO,
  QcComparisonForm,
  QcComparisonQuery,
  QcComparisonDetailVO,
} from "@/api/lis/qcComparison/types";
import { listTestItem } from "@/api/lis/testItem";
import { TestItemVO } from "@/api/lis/testItem/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const qcComparisonList = ref<QcComparisonVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const comparisonFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: QcComparisonForm = {
  comparisonId: undefined,
  comparisonType: undefined,
  instrumentId: undefined,
  referenceInstrumentId: undefined,
  testItemId: undefined,
  comparisonDate: undefined,
  periodNumber: undefined,
  totalSamples: 0,
  passSamples: 0,
  passRate: 0,
  overallResult: undefined,
  details: [],
};
const data = reactive<PageData<QcComparisonForm, QcComparisonQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    comparisonType: undefined,
    instrumentId: undefined,
    testItemId: undefined,
    overallResult: undefined,
    params: {},
  },
  rules: {
    comparisonType: [{ required: true, message: "请选择比对类型", trigger: "change" }],
    instrumentId: [{ required: true, message: "请选择仪器", trigger: "change" }],
    testItemId: [{ required: true, message: "请选择检验项目", trigger: "change" }],
    comparisonDate: [{ required: true, message: "请选择比对日期", trigger: "change" }],
    totalSamples: [{ required: true, message: "请输入总样本数", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 下拉选项
const testItemOptions = ref<TestItemVO[]>([]);
const instrumentOptions = ref<CommInstrumentVO[]>([]);

const loadOptions = async () => {
  const [testItemRes, instrumentRes] = await Promise.all([
    listTestItem({ pageNum: 1, pageSize: 999, params: {} }),
    listCommInstrument({ pageNum: 1, pageSize: 999, params: {} }),
  ]);
  testItemOptions.value = testItemRes.rows;
  instrumentOptions.value = instrumentRes.rows;
};

/** 自动计算通过率 */
const calcPassRate = () => {
  if (form.value.totalSamples && form.value.totalSamples > 0) {
    form.value.passRate = Math.round((form.value.passSamples / form.value.totalSamples) * 10000) / 100;
  } else {
    form.value.passRate = 0;
  }
};

/** 添加样本明细行 */
const addDetailRow = () => {
  if (!form.value.details) {
    form.value.details = [];
  }
  form.value.details.push({
    detailId: undefined,
    sampleNo: undefined,
    targetValue: undefined,
    testValue: undefined,
    bias: undefined,
    allowDeviation: undefined,
    sampleResult: undefined,
  });
};

/** 查询一致性比对列表 */
const getList = async () => {
  loading.value = true;
  const res = await listQcComparison(queryParams.value);
  qcComparisonList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 展开行时加载明细 */
const handleExpandChange = async (row: QcComparisonVO, expandedRows: QcComparisonVO[]) => {
  if (expandedRows.includes(row) && (!row.details || row.details.length === 0)) {
    try {
      const res = await listQcComparisonDetail(row.comparisonId);
      row.details = res.data || res.rows || [];
    } catch {
      row.details = [];
    }
  }
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
  comparisonFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: QcComparisonVO[]) => {
  ids.value = selection.map((item) => item.comparisonId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增一致性比对";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: QcComparisonVO) => {
  reset();
  const _comparisonId = row?.comparisonId || ids.value[0];
  const res = await getQcComparison(_comparisonId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改一致性比对";
};

/** 提交按钮 */
const submitForm = () => {
  comparisonFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        if (form.value.comparisonId) {
          await updateQcComparison(form.value);
        } else {
          await addQcComparison(form.value);
        }
        proxy?.$modal.msgSuccess("操作成功");
        dialog.visible = false;
        await getList();
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "lis/qc/comparison/export",
    {
      ...queryParams.value,
    },
    `qcComparison_${new Date().getTime()}.xlsx`,
  );
};

onMounted(async () => {
  await loadOptions();
  getList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
