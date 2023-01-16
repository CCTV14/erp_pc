<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter.native="filterList"
        />
      </el-form-item>
      <!-- <el-form-item label="冻结状态" prop="frozen">
        <el-select
          v-model="queryParams.frozen"
          placeholder="请选择冻结状态"
          clearable
          @change="handleQuery"
        >
          <el-option label="已冻结" :value="true"></el-option>
          <el-option label="未冻结" :value="false"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          v-hasPermi="['system:menu:query']"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:menu:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          >刷新缓存</el-button
        >
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        prop="menuName"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="240"
      ></el-table-column>
      <el-table-column prop="iconName" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.iconName || ''" />
        </template>
      </el-table-column>
      <el-table-column prop="no" label="排序" width="60"></el-table-column>
      <el-table-column
        prop="perms"
        label="权限标识"
        width="300"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="componentPath"
        label="组件路径"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.frozen"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="200"
        align="center"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuTypeEnum">
              <el-radio-group v-model="form.menuTypeEnum">
                <el-radio label="Menu">目录</el-radio>
                <el-radio label="Page">页面</el-radio>
                <el-radio label="Button">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuTypeEnum != 'Button'">
            <el-form-item label="菜单图标" prop="iconName">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.iconName"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.iconName"
                    slot="prefix"
                    :icon-class="form.iconName"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="no">
              <el-input-number
                v-model="form.no"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuTypeEnum != 'Button'">
            <el-form-item>
              <span slot="label">
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.outerChain">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuTypeEnum != 'Button'">
            <el-form-item prop="routerPath">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input
                v-model="form.routerPath"
                placeholder="请输入路由地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuTypeEnum == 'Page'">
            <el-form-item prop="componentPath">
              <span slot="label">
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input
                v-model="form.componentPath"
                placeholder="请输入组件路径"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuTypeEnum != 'Menu'">
            <el-form-item prop="perms">
              <el-input
                v-model="form.perms"
                placeholder="请输入权限标识"
                maxlength="100"
              />
              <span slot="label">
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="form.menuTypeEnum == 'C'">
            <el-form-item>
              <el-input
                v-model="form.query"
                placeholder="请输入路由参数"
                maxlength="255"
              />
              <span slot="label">
                <el-tooltip
                  content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由参数
              </span>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12" v-if="form.menuTypeEnum == 'C'">
            <el-form-item>
              <span slot="label">
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12" v-if="form.menuTypeEnum != 'Button'">
            <el-form-item>
              <span slot="label">
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.menuVisible">
                <el-radio :label="true">显示</el-radio>
                <el-radio :label="false">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuTypeEnum != 'Button'">
            <el-form-item>
              <span slot="label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.frozen">
                <el-radio :label="false">
                  <span>正常</span>
                </el-radio>
                <el-radio :label="true">
                  <span>停用</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
  treeselect,
  changeFrozen,
} from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { refreshCache } from "@/api/system/config";

export default {
  name: "Menu",
  // dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      //
      oldList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        menuName: undefined,
        frozen: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        no: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.iconName = name;
    },
    filterList() {
      let arr = this.filterTree(this.oldList, this.queryParams);
      this.deptList = arr;
    },
    filterTree(arr, keyword) {
      let emptyArr = [];
      for (let item of arr) {
        if (item.menuName.includes(keyword.menuName)) {
          if (
            item.children &&
            Array.isArray(item.children) &&
            item.children.length > 0
          ) {
            item.children = this.filterTree(item.children, keyword);
          }
          emptyArr.push(item);
        } else if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0
        ) {
          item.children = this.filterTree(item.children, keyword);
          if (item.children.length) {
            emptyArr.push(item);
          }
        }
      }
      return emptyArr;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then((response) => {
        this.menuList = response.data;
        this.oldList = response.data;
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.menuOptions = [];
        const menu = { id: 0, menuName: "主类目", children: [] };
        menu.children = response.data;
        this.menuOptions.push(menu);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        menuName: undefined,
        iconName: undefined,
        menuTypeEnum: "Menu",
        no: undefined,
        menuVisible: true,
        frozen: false,
        componentPath: "",
        routerPath: "",
        perms: null,
        outerChain: false,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    // 在表格中切换冻结状态
    handleStatusChange(row) {
      changeFrozen(row.id).then((res) => {
        this.$modal.msgSuccess("操作成功！");
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.id).then((response) => {
        this.form = response.data;
        this.form.menuTypeEnum = response.data.menuTypeEnum.Name;
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateMenu(this.form).then((response) => {
              if (response.success) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addMenu(this.form).then((response) => {
              if (response.success) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.menuName + '"的数据项？')
        .then(function () {
          return delMenu(row.id);
        })
        .then((res) => {
          if (res.success) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        })
        .catch(() => {});
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then((res) => {
        this.$modal.msgSuccess(res.message);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
}
</style>
