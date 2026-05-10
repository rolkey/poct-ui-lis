<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
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
            <el-form-item label="计划类型" prop="planType">
              <el-select
                v-model="queryParams.planType"
                placeholder="请选择计划类型"
                clearable
              >
                <el-option label="每日" value="DAILY" />
                <el-option label="开机" value="STARTUP" />
                <el-option label="批次更换" value="BATCH_CHANGE" />
                <el-option label="维护后" value="MAINTENANCE" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option label="启用" value="0" />
                <el-option label="停用" value="1" />
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
              v-hasPermi="['lis:qc:plan:edit']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['lis:qc:plan:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['lis:qc:plan:edit']"
            >删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="qcPlanList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="计划ID" align="center" prop="planId" width="80" />
          <el-table-column label="仪器" align="center" prop="instrumentName" min-width="120" />
          <el-table-column label="计划类型" align="center" prop="planType" width="120">
            <template #default="scope">
              <el-tag
                :type="scope.row.planType === 'DAILY' ? '' : scope.row.planType === 'STARTUP' ? 'success' : scope.row.planType === 'BATCH_CHANGE' ? 'warning' : 'info'"
                disable-transitions
              >
                {{ scope.row.planType === 'DAILY' ? '每日' : scope.row.planType === 'STARTUP' ? '开机' : scope.row.planType === 'BATCH_CHANGE' ? '批次更换' : '维护后' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="计划时间" align="center" prop="scheduleTime" width="100" />
          <el-table-column label="提前提醒(分钟)" align="center" prop="remindBeforeMin" width="130" />
          <el-table-column label="负责人" align="center" prop="responsiblePerson" width="100" />
          <el-table-column label="状态" align="center" prop="status" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'info'" disable-transitions>
                {{ scope.row.status === '0' ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="170" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            width="100"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['lis:qc:plan:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['lis:qc:plan:edit']"
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

    <!-- 添加或修改质控计划对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body draggable>
      <el-form ref="qcPlanFormRef" :model="form" :rules="rules" label-width="120px">
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
            <el-form-item label="计划类型" prop="planType">
              <el-select v-model="form.planType" placeholder="请选择计划类型" clearable>
                <el-option label="每日" value="DAILY" />
                <el-option label="开机" value="STARTUP" />
                <el-option label="批次更换" value="BATCH_CHANGE" />
                <el-option label="维护后" value="MAINTENANCE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划时间" prop="scheduleTime">
              <el-time-picker
                v-model="form.scheduleTime"
                placeholder="选择计划时间"
                value-format="HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提前提醒(分钟)" prop="remindBeforeMin">
              <el-input-number v-model="form.remindBeforeMin" :min="0" :max="1440" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="responsiblePerson">
              <el-input v-model="form.responsiblePerson" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="0">启用</el-radio>
                <el-radio value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
  </div>
</template>

<script setup name="QcPlan" lang="ts">
import {
  listQcPlan,
  getQcPlan,
  delQcPlan,
  addQcPlan,
  updateQcPlan,
} from "@/api/lis/qcPlan";
import {
  QcPlanVO,
  QcPlanForm,
  QcPlanQuery,
} from "@/api/lis/qcPlan/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const qcPlanList = ref<QcPlanVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const qcPlanFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: QcPlanForm = {
  planId: undefined,
  instrumentId: undefined,
  planType: undefined,
  scheduleTime: undefined,
  remindBeforeMin: undefined,
  responsiblePerson: undefined,
  status: "0",
  remark: undefined,
};
const data = reactive<PageData<QcPlanForm, QcPlanQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    instrumentId: undefined,
    planType: undefined,
    status: undefined,
    params: {},
  },
  rules: {
    instrumentId: [{ required: true, message: "请选择仪器", trigger: "change" }],
    planType: [{ required: true, message: "请选择计划类型", trigger: "change" }],
    scheduleTime: [{ required: true, message: "请选择计划时间", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 仪器下拉选项
const instrumentOptions = ref<CommInstrumentVO[]>([]);
const loadInstrumentOptions = async () => {
  const res = await listCommInstrument({ pageNum: 1, pageSize: 999, params: {} });
  instrumentOptions.value = res.rows;
};

/** 查询质控计划列表 */
const getList = async () => {
  loading.value = true;
  const res = await listQcPlan(queryParams.value);
  qcPlanList.value = res.rows;
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
  qcPlanFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: QcPlanVO[]) => {
  ids.value = selection.map((item) => item.planId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增质控计划";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: QcPlanVO) => {
  reset();
  const _planId = row?.planId || ids.value[0];
  const res = await getQcPlan(_planId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改质控计划";
};

/** 提交按钮 */
const submitForm = () => {
  qcPlanFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.planId) {
        await updateQcPlan(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQcPlan(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: QcPlanVO) => {
  const _planIds = row?.planId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除质控计划编号为"' + _planIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delQcPlan(_planIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

onMounted(async () => {
  await loadInstrumentOptions();
  getList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
