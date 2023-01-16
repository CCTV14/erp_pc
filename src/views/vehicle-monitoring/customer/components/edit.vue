<template>
  <div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      @close="handClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户编号" v-if="form.id">
          <span>{{ form.customerNo }}</span>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="当前余额" v-if="form.id">
          <span>￥{{ form.balanceAmount | priceFixedTwo }}</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户分组" prop="customerGroupEnum">
          <el-select
            v-model="form.customerGroupEnum"
            style="width: 100%"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="(item, index) in customerGroupEnumList"
              :key="index"
              :label="item.Desc"
              :value="item.Name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerTypeEnum">
          <el-select
            v-model="form.customerTypeEnum"
            style="width: 100%"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="(item, index) in customerTypeEnumList"
              :key="index"
              :label="item.Desc"
              :value="item.Name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="冻结状态" prop="frozen" v-if="form.id">
          <el-switch
            v-model="form.frozen"
            :active-value="true"
            :inactive-value="false"
            active-color="#F56C6C"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCustomerGroupEnumList,
  getCustomerTypeEnumList,
  customerUpdate,
  customerAdd,
} from "@/api/vehicle-monitoring/customer";
export default {
  data() {
    return {
      // 客户分组数据
      customerGroupEnumList: [],
      // 客户类型数据
      customerTypeEnumList: [],
      // 表单校验
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "请填写长度为2-50的客户姓名",
            trigger: ["blur", "change"],
            min: 2,
            max: 50,
          },
        ],
        phoneNumber: [
          {
            type: "string",
            required: true,
            message: "请填写正确的手机号或座机号",
            trigger: ["blur", "change"],
            pattern:
              /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$|^(?:(?:\+|00)86)?1\d{10}$/,
          },
        ],
        address: [
          {
            type: "string",
            required: true,
            message: "地址不能为空",
            trigger: ["blur", "change"],
          },
        ],
        customerTypeEnum: [
          {
            type: "string",
            required: true,
            message: "请选择客户类型",
            trigger: ["blur", "change"],
          },
        ],
        customerGroupEnum: [
          {
            type: "string",
            required: true,
            message: "请选择客户分组",
            trigger: ["blur", "change"],
          },
        ],
        remark: [
          {
            type: "string",
            required: true,
            message: "请填写长度小于200的备注",
            trigger: ["blur", "change"],
            max: 200,
          },
        ],
      },
    };
  },
  props: {
    title: String,
    open: Boolean,
    form: Object,
  },
  watch: {
    open(val) {
      this.resetForm("form");
      val && this.getCustomerGroupEnumList(), this.getCustomerTypeEnumList();
    },
  },
  methods: {
    handClose() {
      this.$emit("closeDialog", false);
    },
    // 获取客户分组
    getCustomerGroupEnumList() {
      getCustomerGroupEnumList().then((res) => {
        this.customerGroupEnumList = res.data;
      });
    },
    // 获取客户类型
    getCustomerTypeEnumList() {
      getCustomerTypeEnumList().then((res) => {
        this.customerTypeEnumList = res.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let response = this.form.id
            ? await customerUpdate(this.form)
            : await customerAdd(this.form);
          if (response) {
            this.$modal.msgSuccess(response.message);
            this.handClose();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
