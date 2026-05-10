<template>
  <div class="showFull p-2 flex flex-col">
    <el-tabs v-model="activeTab" class="mb-[10px]">
      <el-tab-pane label="EQA计划" name="plan">
        <transition
          :enter-active-class="proxy?.animate.searchAnimate.enter"
          :leave-active-class="proxy?.animate.searchAnimate.leave"
        >
          <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
              <el-form ref="planQueryFormRef" :model="planQueryParams" :inline="true">
                <el-form-item label="计划年份" prop="planYear">
                  <el-input
                    v-model="planQueryParams.planYear"
                    placeholder="请输入计划年份"
                    clearable
                    @keyup.enter="handlePlanQuery"
                  />
                </el-form-item>
                <el-form-item label="组织机构" prop="organization">
                  <el-input
                    v-model="planQueryParams.organization"
                    placeholder="请输入组织机构"
                    clearable
                    @keyup.enter="handlePlanQuery"
                  />
                </el-form-item>
                <el-form-item label="检验项目" prop="testItemId">
                  <el-select
                    v-model="planQueryParams.testItemId"
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
                <el-form-item label="状态" prop="status">
                  <el-select v-model="planQueryParams.status" placeholder="请选择状态" clearable>
                    <el-option label="待执行" value="PENDING" />
                    <el-option label="已完成" value="COMPLETED" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="handlePlanQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetPlanQuery">重置</el-button>
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
                  @click="handlePlanAdd"
                  v-hasPermi="['lis:qc:eqa:edit']"
                >新增计划</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="Edit"
                  :disabled="planSingle"
                  @click="handlePlanUpdate()"
                  v-hasPermi="['lis:qc:eqa:edit']"
                >修改计划</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  icon="Delete"
                  :disabled="planMultiple"
                  @click="handlePlanDelete()"
                  v-hasPermi="['lis:qc:eqa:edit']"
                >删除计划</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getPlanList"></right-toolbar>
            </el-row>
          </template>

          <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
            <el-table
              v-loading="planLoading"
              border
              :data="eqaPlanList"
              :height="tableHeight"
              @selection-change="handlePlanSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="计划ID" align="center" prop="eqaPlanId" width="80" />
              <el-table-column label="计划年份" align="center" prop="planYear" width="100" />
              <el-table-column label="组织机构" align="center" prop="organization" min-width="140" />
              <el-table-column label="检验项目" align="center" prop="testItemName" min-width="120" />
              <el-table-column label="计划日期" align="center" prop="scheduledDate" width="120" />
              <el-table-column label="状态" align="center" prop="status" width="100">
                <template #default="scope">
                  <el-tag
                    :type="scope.row.status === 'PENDING' ? 'warning' : 'success'"
                    disable-transitions
                  >
                    {{ scope.row.status === 'PENDING' ? '待执行' : '已完成' }}
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
                      @click="handlePlanUpdate(scope.row)"
                      v-hasPermi="['lis:qc:eqa:edit']"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Delete"
                      @click="handlePlanDelete(scope.row)"
                      v-hasPermi="['lis:qc:eqa:edit']"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <pagination
            ref="paginationRef"
            v-show="planTotal > 0"
            :total="planTotal"
            v-model:page="planQueryParams.pageNum"
            v-model:limit="planQueryParams.pageSize"
            @pagination="getPlanList"
          />
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="EQA记录" name="record">
        <transition
          :enter-active-class="proxy?.animate.searchAnimate.enter"
          :leave-active-class="proxy?.animate.searchAnimate.leave"
        >
          <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
              <el-form ref="recordQueryFormRef" :model="recordQueryParams" :inline="true">
                <el-form-item label="EQA计划" prop="eqaPlanId">
                  <el-select
                    v-model="recordQueryParams.eqaPlanId"
                    placeholder="请选择EQA计划"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in eqaPlanList"
                      :key="item.eqaPlanId"
                      :label="`${item.planYear} - ${item.organization}`"
                      :value="item.eqaPlanId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="结果" prop="result">
                  <el-select v-model="recordQueryParams.result" placeholder="请选择结果" clearable>
                    <el-option label="通过" value="PASS" />
                    <el-option label="不通过" value="FAIL" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleRecordQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetRecordQuery">重置</el-button>
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
                  @click="handleRecordAdd"
                  v-hasPermi="['lis:qc:eqa:edit']"
                >新增记录</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="Edit"
                  :disabled="recordSingle"
                  @click="handleRecordUpdate()"
                  v-hasPermi="['lis:qc:eqa:edit']"
                >修改记录</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  icon="Delete"
                  :disabled="recordMultiple"
                  @click="handleRecordDelete()"
                  v-hasPermi="['lis:qc:eqa:edit']"
                >删除记录</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getRecordList"></right-toolbar>
            </el-row>
          </template>

          <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
            <el-table
              v-loading="recordLoading"
              border
              :data="eqaRecordList"
              :height="tableHeight"
              @selection-change="handleRecordSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="记录ID" align="center" prop="eqaRecordId" width="80" />
              <el-table-column label="EQA计划" align="center" prop="eqaPlanName" min-width="140" />
              <el-table-column label="结果值" align="center" prop="resultValue" width="100" />
              <el-table-column label="报告文件" align="center" prop="reportFile" min-width="120" show-overflow-tooltip />
              <el-table-column label="得分" align="center" prop="score" width="80" />
              <el-table-column label="结果" align="center" prop="result" width="80">
                <template #default="scope">
                  <el-tag
                    :type="scope.row.result === 'PASS' ? 'success' : 'danger'"
                    disable-transitions
                  >
                    {{ scope.row.result === 'PASS' ? '通过' : '不通过' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="整改记录" align="center" prop="rectifyRecord" min-width="160" show-overflow-tooltip />
              <el-table-column label="报告日期" align="center" prop="reportDate" width="120" />
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
                      @click="handleRecordUpdate(scope.row)"
                      v-hasPermi="['lis:qc:eqa:edit']"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Delete"
                      @click="handleRecordDelete(scope.row)"
                      v-hasPermi="['lis:qc:eqa:edit']"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <pagination
            ref="paginationRef"
            v-show="recordTotal > 0"
            :total="recordTotal"
            v-model:page="recordQueryParams.pageNum"
            v-model:limit="recordQueryParams.pageSize"
            @pagination="getRecordList"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加或修改EQA计划对话框 -->
    <el-dialog :title="planDialog.title" v-model="planDialog.visible" width="500px" append-to-body draggable>
      <el-form ref="planFormRef" :model="planForm" :rules="planRules" label-width="100px">
        <el-form-item label="计划年份" prop="planYear">
          <el-input v-model="planForm.planYear" placeholder="请输入计划年份" />
        </el-form-item>
        <el-form-item label="组织机构" prop="organization">
          <el-input v-model="planForm.organization" placeholder="请输入组织机构" />
        </el-form-item>
        <el-form-item label="检验项目" prop="testItemId">
          <el-select v-model="planForm.testItemId" placeholder="请选择检验项目" filterable clearable>
            <el-option
              v-for="item in testItemOptions"
              :key="item.testItemId"
              :label="item.chineseName"
              :value="item.testItemId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期" prop="scheduledDate">
          <el-date-picker
            v-model="planForm.scheduledDate"
            type="date"
            placeholder="选择计划日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="planForm.status" placeholder="请选择状态" clearable>
            <el-option label="待执行" value="PENDING" />
            <el-option label="已完成" value="COMPLETED" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitPlanForm">确 定</el-button>
          <el-button @click="cancelPlan">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改EQA记录对话框 -->
    <el-dialog :title="recordDialog.title" v-model="recordDialog.visible" width="600px" append-to-body draggable>
      <el-form ref="recordFormRef" :model="recordForm" :rules="recordRules" label-width="100px">
        <el-form-item label="EQA计划" prop="eqaPlanId">
          <el-select v-model="recordForm.eqaPlanId" placeholder="请选择EQA计划" filterable clearable>
            <el-option
              v-for="item in eqaPlanList"
              :key="item.eqaPlanId"
              :label="`${item.planYear} - ${item.organization}`"
              :value="item.eqaPlanId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结果值" prop="resultValue">
          <el-input v-model="recordForm.resultValue" placeholder="请输入结果值" />
        </el-form-item>
        <el-form-item label="报告文件" prop="reportFile">
          <el-upload
            v-model:file-list="fileList"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :limit="1"
            list-type="text"
          >
            <el-button type="primary" icon="Upload">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="得分" prop="score">
          <el-input-number v-model="recordForm.score" :min="0" :max="100" :precision="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-select v-model="recordForm.result" placeholder="请选择结果" clearable>
            <el-option label="通过" value="PASS" />
            <el-option label="不通过" value="FAIL" />
          </el-select>
        </el-form-item>
        <el-form-item label="整改记录" prop="rectifyRecord">
          <el-input v-model="recordForm.rectifyRecord" type="textarea" :rows="3" placeholder="请输入整改记录" />
        </el-form-item>
        <el-form-item label="报告日期" prop="reportDate">
          <el-date-picker
            v-model="recordForm.reportDate"
            type="date"
            placeholder="选择报告日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitRecordForm">确 定</el-button>
          <el-button @click="cancelRecord">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="QcEqa" lang="ts">
import {
  listQcEqaPlan,
  getQcEqaPlan,
  addQcEqaPlan,
  updateQcEqaPlan,
  delQcEqaPlan,
  listQcEqaRecord,
  getQcEqaRecord,
  addQcEqaRecord,
  updateQcEqaRecord,
  delQcEqaRecord,
} from "@/api/lis/qcEqa";
import {
  QcEqaPlanVO,
  QcEqaPlanForm,
  QcEqaPlanQuery,
  QcEqaRecordVO,
  QcEqaRecordForm,
  QcEqaRecordQuery,
} from "@/api/lis/qcEqa/types";
import { listTestItem } from "@/api/lis/testItem";
import { TestItemVO } from "@/api/lis/testItem/types";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const activeTab = ref("plan");

// Plan state
const eqaPlanList = ref<QcEqaPlanVO[]>([]);
const planLoading = ref(false);
const planTotal = ref(0);
const planIds = ref<Array<string | number>>([]);
const planSingle = ref(true);
const planMultiple = ref(true);

// Record state
const eqaRecordList = ref<QcEqaRecordVO[]>([]);
const recordLoading = ref(false);
const recordTotal = ref(0);
const recordIds = ref<Array<string | number>>([]);
const recordSingle = ref(true);
const recordMultiple = ref(true);

const buttonLoading = ref(false);
const showSearch = ref(true);

const planQueryFormRef = ref<ElFormInstance>();
const recordQueryFormRef = ref<ElFormInstance>();
const planFormRef = ref<ElFormInstance>();
const recordFormRef = ref<ElFormInstance>();

const planDialog = reactive<DialogOption>({ visible: false, title: "" });
const recordDialog = reactive<DialogOption>({ visible: false, title: "" });

// File upload
const fileList = ref<any[]>([]);
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/qc/eqa/record/upload");
const uploadHeaders = ref({ Authorization: "Bearer " + getToken() });

const handleUploadSuccess = (response: any) => {
  if (response.code === 200) {
    recordForm.value.reportFile = response.data?.url || response.data;
    proxy?.$modal.msgSuccess("上传成功");
  }
};

const handleUploadRemove = () => {
  recordForm.value.reportFile = undefined;
};

// Plan form
const initPlanFormData: QcEqaPlanForm = {
  eqaPlanId: undefined,
  planYear: undefined,
  organization: undefined,
  testItemId: undefined,
  scheduledDate: undefined,
  status: "PENDING",
};
const planForm = ref<QcEqaPlanForm>({ ...initPlanFormData });
const planRules: any = {
  planYear: [{ required: true, message: "请输入计划年份", trigger: "blur" }],
  organization: [{ required: true, message: "请输入组织机构", trigger: "blur" }],
  testItemId: [{ required: true, message: "请选择检验项目", trigger: "change" }],
};

// Record form
const initRecordFormData: QcEqaRecordForm = {
  eqaRecordId: undefined,
  eqaPlanId: undefined,
  resultValue: undefined,
  reportFile: undefined,
  score: undefined,
  result: undefined,
  rectifyRecord: undefined,
  reportDate: undefined,
};
const recordForm = ref<QcEqaRecordForm>({ ...initRecordFormData });
const recordRules: any = {
  eqaPlanId: [{ required: true, message: "请选择EQA计划", trigger: "change" }],
  result: [{ required: true, message: "请选择结果", trigger: "change" }],
};

// Plan query params
const planQueryParams = reactive<QcEqaPlanQuery>({
  pageNum: 1,
  pageSize: 10,
  planYear: undefined,
  organization: undefined,
  testItemId: undefined,
  status: undefined,
  params: {},
});

// Record query params
const recordQueryParams = reactive<QcEqaRecordQuery>({
  pageNum: 1,
  pageSize: 10,
  eqaPlanId: undefined,
  result: undefined,
  params: {},
});

// Dropdown options
const testItemOptions = ref<TestItemVO[]>([]);

const loadOptions = async () => {
  const testItemRes = await listTestItem({ pageNum: 1, pageSize: 999, params: {} });
  testItemOptions.value = testItemRes.rows;
};

// Plan CRUD
const getPlanList = async () => {
  planLoading.value = true;
  const res = await listQcEqaPlan(planQueryParams);
  eqaPlanList.value = res.rows;
  planTotal.value = res.total;
  planLoading.value = false;
};

const handlePlanSelectionChange = (selection: QcEqaPlanVO[]) => {
  planIds.value = selection.map((item) => item.eqaPlanId);
  planSingle.value = selection.length != 1;
  planMultiple.value = !selection.length;
};

const handlePlanQuery = () => {
  planQueryParams.pageNum = 1;
  getPlanList();
};

const resetPlanQuery = () => {
  planQueryFormRef.value?.resetFields();
  handlePlanQuery();
};

const handlePlanAdd = () => {
  planForm.value = { ...initPlanFormData };
  planDialog.visible = true;
  planDialog.title = "新增EQA计划";
};

const handlePlanUpdate = async (row?: QcEqaPlanVO) => {
  const _eqaPlanId = row?.eqaPlanId || planIds.value[0];
  const res = await getQcEqaPlan(_eqaPlanId);
  planForm.value = { ...initPlanFormData, ...res.data };
  planDialog.visible = true;
  planDialog.title = "修改EQA计划";
};

const submitPlanForm = () => {
  planFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        if (planForm.value.eqaPlanId) {
          await updateQcEqaPlan(planForm.value);
        } else {
          await addQcEqaPlan(planForm.value);
        }
        proxy?.$modal.msgSuccess("操作成功");
        planDialog.visible = false;
        await getPlanList();
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

const cancelPlan = () => {
  planDialog.visible = false;
};

const handlePlanDelete = async (row?: QcEqaPlanVO) => {
  const _eqaPlanIds = row?.eqaPlanId || planIds.value;
  await proxy?.$modal.confirm('是否确认删除EQA计划编号为"' + _eqaPlanIds + '"的数据项？');
  await delQcEqaPlan(_eqaPlanIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getPlanList();
};

// Record CRUD
const getRecordList = async () => {
  recordLoading.value = true;
  const res = await listQcEqaRecord(recordQueryParams);
  eqaRecordList.value = res.rows;
  recordTotal.value = res.total;
  recordLoading.value = false;
};

const handleRecordSelectionChange = (selection: QcEqaRecordVO[]) => {
  recordIds.value = selection.map((item) => item.eqaRecordId);
  recordSingle.value = selection.length != 1;
  recordMultiple.value = !selection.length;
};

const handleRecordQuery = () => {
  recordQueryParams.pageNum = 1;
  getRecordList();
};

const resetRecordQuery = () => {
  recordQueryFormRef.value?.resetFields();
  handleRecordQuery();
};

const handleRecordAdd = () => {
  recordForm.value = { ...initRecordFormData };
  fileList.value = [];
  recordDialog.visible = true;
  recordDialog.title = "新增EQA记录";
};

const handleRecordUpdate = async (row?: QcEqaRecordVO) => {
  const _eqaRecordId = row?.eqaRecordId || recordIds.value[0];
  const res = await getQcEqaRecord(_eqaRecordId);
  recordForm.value = { ...initRecordFormData, ...res.data };
  if (recordForm.value.reportFile) {
    fileList.value = [{ name: recordForm.value.reportFile, url: recordForm.value.reportFile }];
  }
  recordDialog.visible = true;
  recordDialog.title = "修改EQA记录";
};

const submitRecordForm = () => {
  recordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        if (recordForm.value.eqaRecordId) {
          await updateQcEqaRecord(recordForm.value);
        } else {
          await addQcEqaRecord(recordForm.value);
        }
        proxy?.$modal.msgSuccess("操作成功");
        recordDialog.visible = false;
        await getRecordList();
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

const cancelRecord = () => {
  recordDialog.visible = false;
};

const handleRecordDelete = async (row?: QcEqaRecordVO) => {
  const _eqaRecordIds = row?.eqaRecordId || recordIds.value;
  await proxy?.$modal.confirm('是否确认删除EQA记录编号为"' + _eqaRecordIds + '"的数据项？');
  await delQcEqaRecord(_eqaRecordIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getRecordList();
};

// Table height
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
        planQueryParams.pageSize = 20;
        recordQueryParams.pageSize = 20;
      } else if (tabHeightCale < 500) {
        planQueryParams.pageSize = 10;
        recordQueryParams.pageSize = 10;
      }
      tableHeight.value = tabHeightCale + "px";
    }
  }, 150);
};

onMounted(async () => {
  await loadOptions();
  getPlanList();
  getRecordList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
