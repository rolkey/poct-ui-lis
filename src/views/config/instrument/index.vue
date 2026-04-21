<template>
  <div id="app" class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!-- <el-form-item label="仪器代码" prop="instrumentId">
              <el-input
                v-model="queryParams.instrumentId"
                placeholder="请输入仪器代码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item> -->
            <el-form-item label="仪器名称" prop="instrumentName">
              <el-input
                v-model="queryParams.instrumentName"
                placeholder="请输入仪器名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="注册时间" prop="instrumentKeyDate">
              <el-input
                v-model="queryParams.instrumentKeyDate"
                placeholder="请输入注册时间"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="接口程序" prop="interfaceName">
              <el-input
                v-model="queryParams.interfaceName"
                placeholder="请输入接口程序"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <!-- <el-form-item label="端口配置" prop="instrumentCommport">
              <el-input
                v-model="queryParams.instrumentCommport"
                placeholder="请输入端口配置"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item> -->
            <!-- <el-form-item label="key" prop="instrumentKey">
              <el-input
                v-model="queryParams.instrumentKey"
                placeholder="请输入key"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['lis:commInstrument:add']"
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
              v-hasPermi="['lis:commInstrument:edit']"
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
              v-hasPermi="['lis:commInstrument:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['lis:commInstrument:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table
        v-loading="loading"
        border
        :data="commInstrumentList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="仪器代码" align="center" prop="instrumentId" /> -->
        <el-table-column label="仪器名称" align="center" prop="instrumentName" />
        <el-table-column label="科室" align="center" prop="deptName" />
        <el-table-column label="注册时间" align="center" prop="instrumentKeyDate" />
        <el-table-column label="仪器类型" align="center" prop="instrumentType" />
        <el-table-column label="接口程序" align="center" prop="interfaceName" />
        <el-table-column label="通讯方式" align="center" prop="interfaceType" />
        <el-table-column label="端口配置" align="center" prop="instrumentCommport" />
        <!-- <el-table-column label="key" align="center" prop="instrumentKey" /> -->
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
                v-hasPermi="['lis:commInstrument:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['lis:commInstrument:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改仪器对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
      draggable
    >
      <el-form ref="commInstrumentFormRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="仪器代码" prop="instrumentId">
          <el-input v-model="form.instrumentId" placeholder="请输入仪器代码" />
        </el-form-item> -->
        <el-form-item label="仪器名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入仪器名称" />
        </el-form-item>
        <el-form-item label="归属部门" prop="deptId">
          <el-tree-select
            v-model="form.deptId"
            :data="enabledDeptOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择归属部门"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="注册时间" prop="instrumentKeyDate">
          <el-input v-model="form.instrumentKeyDate" placeholder="请输入注册时间" />
        </el-form-item>
        <el-form-item label="接口程序" prop="interfaceName">
          <el-input v-model="form.interfaceName" placeholder="请输入接口程序" />
        </el-form-item>
        <el-form-item label="端口配置" prop="instrumentCommport">
          <el-input v-model="form.instrumentCommport" placeholder="请输入端口配置" />
        </el-form-item>
        <!-- <el-form-item label="key" prop="instrumentKey">
          <el-input v-model="form.instrumentKey" placeholder="请输入key" />
        </el-form-item> -->
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

<script setup name="CommInstrument" lang="ts">
import {
  listCommInstrument,
  getCommInstrument,
  delCommInstrument,
  addCommInstrument,
  updateCommInstrument,
} from "@/api/lis/commInstrument";
import {
  CommInstrumentVO,
  CommInstrumentQuery,
  CommInstrumentForm,
} from "@/api/lis/commInstrument/types";
import { deptTreeSelect } from "@/api/system/dept";
import { DeptTreeVO } from "@/api/system/dept/types";
import { filterDisabledDept, findDept } from "@/utils/dept";
import { ComponentInternalInstance, getCurrentInstance, reactive, ref, toRefs } from "vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const commInstrumentList = ref<CommInstrumentVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const enabledDeptOptions = ref<DeptTreeVO[]>([]);
const deptOptions = ref<DeptTreeVO[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const commInstrumentFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: CommInstrumentForm = {
  instrumentId: undefined,
  instrumentName: undefined,
  instrumentKeyDate: undefined,
  instrumentType: undefined,
  interfaceName: undefined,
  interfaceType: undefined,
  instrumentCommport: undefined,
  instrumentKey: undefined,
  deptId: "",
  deptName: "",
};
const data = reactive<PageData<CommInstrumentForm, CommInstrumentQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    instrumentId: undefined,
    instrumentName: undefined,
    instrumentKeyDate: undefined,
    instrumentType: undefined,
    interfaceName: undefined,
    interfaceType: undefined,
    instrumentCommport: undefined,
    instrumentKey: undefined,
    params: {},
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

/** 查询仪器列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCommInstrument(queryParams.value);
  commInstrumentList.value = res.rows;
  res.rows.forEach((item) => {
    const dept = findDept(item.deptId, deptOptions.value);
    if (dept) {
      item.deptName = dept.label;
    }
  });
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  commInstrumentFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CommInstrumentVO[]) => {
  ids.value = selection.map((item) => item.instrumentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加仪器";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CommInstrumentVO) => {
  reset();
  const _instrumentId = row?.instrumentId || ids.value[0];
  const res = await getCommInstrument(_instrumentId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改仪器";
};

/** 提交按钮 */
const submitForm = () => {
  commInstrumentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.instrumentId) {
        await updateCommInstrument(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCommInstrument(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 查询部门下拉树结构 */
const getDeptTree = async () => {
  const res = await deptTreeSelect();
  deptOptions.value = res.data;
  enabledDeptOptions.value = filterDisabledDept(res.data);
};

/** 删除按钮操作 */
const handleDelete = async (row?: CommInstrumentVO) => {
  const _instrumentIds = row?.instrumentId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除仪器编号为"' + _instrumentIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delCommInstrument(_instrumentIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "lis/commInstrument/export",
    {
      ...queryParams.value,
    },
    `commInstrument_${new Date().getTime()}.xlsx`,
  );
};

onMounted(async () => {
  await getDeptTree(); // 初始化部门数据
  getList();
});
</script>
