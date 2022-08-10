<template>
    <div class="app-container">
        <el-form :model="params" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="单号" prop="orderNo">
                <el-input v-model="params.orderNo" placeholder="请输入销售单单号" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="审批状态" prop="ident">
                <el-select v-model="params.ident" multiple style="width:160px;" placeholder="请选择审批状态" clearable>
                    <el-option label="审批中" value="1"></el-option>
                    <el-option label="审批通过" value="0"></el-option>
                    <el-option label="审批拒绝" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="入库进度" prop="ident">
                <el-select v-model="params.ident" multiple style="width:160px;" placeholder="请选择入库进度" clearable>
                    <el-option label="全部入库" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="付款进度" prop="ident">
                <el-select v-model="params.ident" multiple style="width:160px;" placeholder="请选择付款进度" clearable>
                    <el-option label="不限" value=""></el-option>
                    <el-option label="无需付款" value="1"></el-option>
                    <el-option label="未付款" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单据金额" prop="price">
                <div style="display: flex;">
                    <el-input style="width:140px;" v-model="params.email" placeholder="不限" clearable
                        @keyup.enter.native="handleQuery" />
                    <div class="ml10 mr10">-</div>
                    <el-input style="width:140px;" v-model="params.email" placeholder="不限" clearable
                        @keyup.enter.native="handleQuery" />
                </div>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="dateRange" style="width:240px;" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-radio class="ml10" v-model="radio" label="1">仅我的单据</el-radio>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:sale:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:sale:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete" v-hasPermi="['system:sale:remove']">删除</el-button>
            </el-col>
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>

        <el-table v-loading="loading" :data="tableData" :cell-style="$thinking.getCellFontColor"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="单号" align="center" prop="orderNo" width="180" />
            <el-table-column label="供应商" align="center" prop="customerName" />
            <el-table-column label="单据金额" align="center" sortable width="150">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.orderPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="制单信息" align="center" width="200">
                <template slot-scope="scope">
                    <span style="color:'$--color-primary'">{{ scope.row.createName + " " + scope.row.createTime
                    }}</span>
                </template>
            </el-table-column>

            <el-table-column label="付款进度" prop="fundPayProgressEnum.Desc" align="center" />
            <el-table-column label="入库进度" prop="commodityInputProgressEnum.Desc" align="center" />
            <el-table-column label="审批状态" prop="handleMessage" align="center" />
            <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:dict:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)"
                        v-hasPermi="['system:dict:detail']">查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:dict:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize"
            @pagination="getList" />

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入用户姓名" />
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号码" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
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
    listType,
    getType,
    delType,
    addType,
    updateType,
    refreshCache
} from "@/api/system/dict/type";

export default {
    name: "Dict",
    dicts: ["sys_normal_disable"],
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            radio: "",
            // 表格数据
            tableData: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层 新增/编辑框
            open: false,
            // 日期范围
            dateRange: [],
            // 查询参数
            params: {
                pageNum: 1,
                pageSize: 10,
                name: "",
                phone: "",
                email: "",
                sort: "",
                ident: ""
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [{
                    required: true,
                    message: "用户名称不能为空",
                    trigger: "blur"
                }],
                phone: [{
                    required: true,
                    message: "手机号码不能为空",
                    trigger: "blur"
                }],
                email: [{
                    required: true,
                    message: "邮箱不能为空",
                    trigger: "blur"
                }]
            }
        };
    },
    created() {
        // this.getList(); 暂
        this.tableData = [{
            id: "1",
            orderNo: "X29329139192391293",
            customerName: "测试客户",
            address: "复兴区市场",
            name: "测试用户",
            handleMessage: "审批通过",
            phone: "审批通过",
            email: "12312@163.com",
            sort: "desc",
            orderPrice: 566.02,
            status: true,
            createName: "人员",
            commodityInputProgressEnum: {
                Desc: "全部入库"
            },
            fundPayProgressEnum: {
                Desc: "全部付款"
            },
            createTime: "2022-02-20 12:33:00"
        }
        ];
        this.total = 1;
        this.loading = false;
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            listType(this.addDateRange(this.params, this.dateRange)).then(
                response => {
                    this.tableData = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: "",
                name: "",
                phone: "",
                email: ""
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.params.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加用户";
        },
        /** 查看详情按钮操作 */
        handleDetail(row) {
            this.$router.push({
                name: "sale-detail"
            })
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            // this.form = {...row};
            // this.open=true;
            const id = row.id || this.ids;
            getType(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改用户";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateType(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addType(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm('是否确认删除用户id为"' + ids + '"的数据项？')
                .then(function () {
                    return delType(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/dict/type/export", {
                ...this.queryParams
            },
                `type_${new Date().getTime()}.xlsx`
            );
        },
        /** 刷新缓存按钮操作 */
        handleRefreshCache() {
            refreshCache().then(() => {
                this.$modal.msgSuccess("刷新成功");
                this.$store.dispatch("dict/cleanDict");
            });
        }
    }
};
</script>
