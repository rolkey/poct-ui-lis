<template>
  <el-dialog
    title="失控处理"
    v-model="dialogVisible"
    width="500px"
    append-to-body
    draggable
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="失控原因" prop="oocCause">
        <el-select
          v-model="formData.oocCause"
          placeholder="请选择失控原因"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in causeOptions"
            :key="item.causeId"
            :label="item.causeName"
            :value="item.causeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="纠正措施" prop="correctiveAction">
        <el-input
          v-model="formData.correctiveAction"
          type="textarea"
          :rows="4"
          placeholder="请输入纠正措施"
        />
      </el-form-item>
      <el-form-item label="处理人" prop="handler">
        <el-input
          v-model="formData.handler"
          placeholder="请输入处理人"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="submit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { listOocCauseDict } from "@/api/lis/qcOoc";
import { OocCauseDictVO } from "@/api/lis/qcOoc/types";

const props = withDefaults(defineProps<{
  visible: boolean
  recordData?: any
}>(), {
  visible: false,
  recordData: null,
});

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void
  (e: "submitted", data: { oocCause: string; correctiveAction: string; handler: string; recordId: string | number }): void
}>();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const formRef = ref<ElFormInstance>();
const loading = ref(false);
const causeOptions = ref<OocCauseDictVO[]>([]);

const formData = reactive({
  oocCause: undefined as string | undefined,
  correctiveAction: undefined as string | undefined,
  handler: undefined as string | undefined,
});

const rules: any = {
  oocCause: [{ required: true, message: "请选择失控原因", trigger: "change" }],
  correctiveAction: [{ required: true, message: "请输入纠正措施", trigger: "blur" }],
  handler: [{ required: true, message: "请输入处理人", trigger: "blur" }],
};

const loadCauseOptions = async () => {
  try {
    const res = await listOocCauseDict({ pageNum: 1, pageSize: 999, params: {} });
    causeOptions.value = res.rows || [];
  } catch {
    causeOptions.value = [];
  }
};

const submit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        emit("submitted", {
          oocCause: formData.oocCause!,
          correctiveAction: formData.correctiveAction!,
          handler: formData.handler!,
          recordId: props.recordData?.recordId,
        });
      } finally {
        loading.value = false;
      }
    }
  });
};

const handleClose = () => {
  formRef.value?.resetFields();
  formData.oocCause = undefined;
  formData.correctiveAction = undefined;
  formData.handler = undefined;
  dialogVisible.value = false;
};

watch(
  () => props.visible,
  (val) => {
    if (val) {
      loadCauseOptions();
    }
  },
);
</script>
