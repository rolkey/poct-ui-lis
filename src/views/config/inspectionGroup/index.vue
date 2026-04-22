<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="分组代码" prop="groupCode">
              <el-input
                v-model="queryParams.groupCode"
                placeholder="请输入分组代码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="排序号" prop="groupSort">
              <el-input
                v-model="queryParams.groupSort"
                placeholder="请输入排序号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="分组名称" prop="groupName">
              <el-input
                v-model="queryParams.groupName"
                placeholder="请输入分组名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="分组类型" prop="groupClass">
              <el-input
                v-model="queryParams.groupClass"
                placeholder="请输入分组类型"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" class="flex flex-col flex-1 table-card min-h-0 overflow-hidden">
      <template #header>
        <el-row :gutter="10" class="mb-[6px]">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['lis:inspectionGroup:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['lis:inspectionGroup:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['lis:inspectionGroup:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['lis:inspectionGroup:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList">
            <template #actions>
              <!-- 这里可以添加自定义按钮 -->
              <el-tooltip class="item" effect="dark" content="配置" placement="top">
                <el-button circle icon="Tickets" @click="handleConfig" />
              </el-tooltip>
            </template>
          </right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1">
        <el-table
          v-loading="loading"
          border
          :data="inspectionGroupList"
          @selection-change="handleSelectionChange"
          :height="tableHeight"
        >
          <el-table-column type="selection" width="55" align="center" fixed />
          <!-- <el-table-column label="分组ID" align="center" prop="groupId" v-if="true" /> -->
          <el-table-column label="分组代码" align="center" prop="groupCode" fixed width="80" />
          <!-- <el-table-column label="排序号" align="center" prop="groupSort" /> -->
          <el-table-column label="分组名称" align="center" prop="groupName" width="160" />
          <el-table-column label="检验科室" align="center" prop="inspectionDept" width="80" />
          <el-table-column label="分组类型" align="center" prop="groupClass" width="130" />
          <el-table-column label="项目显示格式" align="center" prop="testItemAppend" width="120" />
          <el-table-column label="项目显示" align="center" prop="itemDisplay" width="150" />
          <el-table-column label="起诉样本号" align="center" prop="startNo" width="60" />
          <el-table-column label="开始焦点" align="center" prop="startFocus" width="60" />
          <el-table-column label="回顾条件设置" align="center" prop="resultReview" width="110" />
          <el-table-column label="同类分组" align="center" prop="sameGroup" width="70" />
          <el-table-column label="结果图形类型" align="center" prop="graphFormat" width="60" />
          <el-table-column
            label="对应老系统仪器"
            align="center"
            prop="graphSwitchFile"
            width="110"
          />
          <el-table-column label="状态" align="center" prop="stateFlag" width="60" />
          <el-table-column label="默认结果" align="center" prop="defaultResult" width="90" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['lis:inspectionGroup:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['lis:inspectionGroup:remove']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-card v-if="configShow" class="w-[600px]"> config </el-card>
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
    <!-- 添加或修改检验分组信息对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
      draggable
    >
      <el-form ref="inspectionGroupFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分组代码" prop="groupCode">
          <el-input v-model="form.groupCode" placeholder="请输入分组代码" />
        </el-form-item>
        <el-form-item label="排序号" prop="groupSort">
          <el-input v-model="form.groupSort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="分组类型" prop="groupClass">
          <el-input v-model="form.groupClass" placeholder="请输入分组类型" />
        </el-form-item>
        <el-form-item label="项目显示格式" prop="testItemAppend">
          <el-input v-model="form.testItemAppend" placeholder="请输入项目显示格式" />
        </el-form-item>
        <el-form-item label="项目显示" prop="itemDisplay">
          <el-input v-model="form.itemDisplay" placeholder="请输入项目显示" />
        </el-form-item>
        <el-form-item label="起诉样本号" prop="startNo">
          <el-input v-model="form.startNo" placeholder="请输入起诉样本号" />
        </el-form-item>
        <el-form-item label="开始焦点" prop="startFocus">
          <el-input v-model="form.startFocus" placeholder="请输入开始焦点" />
        </el-form-item>
        <el-form-item label="回顾条件设置" prop="resultReview">
          <el-input v-model="form.resultReview" placeholder="请输入回顾条件设置" />
        </el-form-item>
        <el-form-item label="同类分组" prop="sameGroup">
          <el-input v-model="form.sameGroup" placeholder="请输入同类分组" />
        </el-form-item>
        <el-form-item label="结果图形类型" prop="graphFormat">
          <el-input v-model="form.graphFormat" placeholder="请输入结果图形类型" />
        </el-form-item>
        <el-form-item label="对应老系统仪器" prop="graphSwitchFile">
          <el-input v-model="form.graphSwitchFile" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="stateFlag">
          <el-input v-model="form.stateFlag" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="默认结果" prop="defaultResult">
          <el-input v-model="form.defaultResult" placeholder="请输入默认结果" />
        </el-form-item>
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

<script setup name="InspectionGroup" lang="ts">
import {
  listInspectionGroup,
  getInspectionGroup,
  delInspectionGroup,
  addInspectionGroup,
  updateInspectionGroup,
} from "@/api/lis/inspectionGroup";
import {
  InspectionGroupVO,
  InspectionGroupQuery,
  InspectionGroupForm,
} from "@/api/lis/inspectionGroup/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const inspectionGroupList = ref<InspectionGroupVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const inspectionGroupFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: InspectionGroupForm = {
  groupId: undefined,
  groupCode: undefined,
  groupSort: undefined,
  groupName: undefined,
  inspectionDept: undefined,
  groupClass: undefined,
  testItemAppend: undefined,
  itemDisplay: undefined,
  startNo: undefined,
  startFocus: undefined,
  resultReview: undefined,
  sameGroup: undefined,
  graphFormat: undefined,
  graphSwitchFile: undefined,
  stateFlag: undefined,
  defaultResult: undefined,
};
const data = reactive<PageData<InspectionGroupForm, InspectionGroupQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    groupCode: undefined,
    groupSort: undefined,
    groupName: undefined,
    inspectionDept: undefined,
    groupClass: undefined,
    params: {},
  },
  rules: {
    groupId: [{ required: true, message: "分组ID不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询检验分组信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInspectionGroup(queryParams.value);
  inspectionGroupList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const configShow = ref(false);
/** 取消按钮 */
const handleConfig = () => {
  configShow.value = !configShow.value;
};

const tableWrapperRef = ref(null);
const paginationRef = ref(null);
// 计算高度
const tableHeight = ref("500px"); // 使用 ref 而非 computed

const updateHeight = () => {
  if (tableWrapperRef.value) {
    const pageinationHeight = paginationRef.value?.clientHeight || 0;
    const tabHeightCale = tableWrapperRef.value.clientHeight - pageinationHeight - 40;
    if (tabHeightCale > 500) {
      queryParams.value.pageSize = 20;
    } else if (tabHeightCale < 500) {
      queryParams.value.pageSize = 10;
    }
    tableHeight.value = tabHeightCale + "px";
  }
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  inspectionGroupFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InspectionGroupVO[]) => {
  ids.value = selection.map((item) => item.groupId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加检验分组信息";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: InspectionGroupVO) => {
  reset();
  const _groupId = row?.groupId || ids.value[0];
  const res = await getInspectionGroup(_groupId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改检验分组信息";
};

/** 提交按钮 */
const submitForm = () => {
  inspectionGroupFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.groupId) {
        await updateInspectionGroup(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addInspectionGroup(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: InspectionGroupVO) => {
  const _groupIds = row?.groupId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除检验分组信息编号为"' + _groupIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delInspectionGroup(_groupIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "lis/inspectionGroup/export",
    {
      ...queryParams.value,
    },
    `inspectionGroup_${new Date().getTime()}.xlsx`,
  );
};

onMounted(() => {
  getList();
  nextTick(updateHeight); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
