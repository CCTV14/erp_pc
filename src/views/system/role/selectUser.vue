<template>
  <!-- 授权用户 -->
  <el-dialog
    title="选择用户"
    :visible.sync="visible"
    width="800px"
    top="5vh"
    append-to-body
  >
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="名称" prop="quickSearchInfoList[0].quickSearchValue">
        <el-input
          v-model="queryParams.quickSearchInfoList[0].quickSearchValue"
          placeholder="请输入名称或者联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="table"
        :data="userList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="selectableFun"
        />
        <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="所在组织" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.organization.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageInfo.page"
        :limit.sync="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  findSelectUser,
  roleLeftToRight,
  checkDistribute,
} from "@/api/system/role";
export default {
  props: {
    // 角色编号
    roleId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      // 查询参数
      queryParams: {
        pageInfo: { page: 1, pageSize: 20 },
        quickSearchInfoList: [
          { columns: ["user.phoneNumber", "user.name"], quickSearchValue: "" },
        ],
        sortInfo: null,
      },
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.getList();
      this.visible = true;
    },
    selectableFun(row, index) {
      return !row.disabled;
    },
    // 检查可用的项
    checkDistribute(list) {
      let arr = list.map((item) => {
        return item.id;
      });
      return new Promise((resolve, reject) => {
        checkDistribute({
          roleId: this.roleId,
          userIdList: arr,
        }).then((res) => {
          list.forEach((crr) => {
            if (res.data.includes(crr.id)) {
              crr.disabled = true;
            }
          });
          resolve(list);
        });
      });
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => {
        return {
          sysRoleId: this.roleId,
          userId: item.id,
        };
      });
    },
    // 查询表数据
    async getList() {
      let list = await findSelectUser(this.queryParams);
      if (list) {
        this.userList = await this.checkDistribute(list.data);
        this.total = list.total;
        this.checkDistribute();
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const userIds = this.userIds;
      if (userIds == "") {
        this.$modal.msgError("请选择要分配的用户");
        return;
      }
      roleLeftToRight(userIds).then((res) => {
        this.$modal.msgSuccess(res.message);
        if (res.status === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    },
  },
};
</script>
