<template>
    <div class="app-container">
        <el-form :model="params" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="params.name" placeholder="请输入资金账户名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="账户" prop="account">
                <el-input v-model="params.account" placeholder="请输入账户名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="类型" prop="fundAccountTypeEnum">
                <el-select v-model="params.fundAccountTypeEnum" collapse-tags placeholder="请选择类型" clearable>
                    <el-option label="银行账户" value="1"></el-option>
                    <el-option label="微信钱包" value="0"></el-option>
                    <el-option label="支付宝账户" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="冻结状态" prop="frozen">
                <el-select v-model="params.frozen" collapse-tags placeholder="请选择冻结状态" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已冻结" :value="true"></el-option>
                    <el-option label="未冻结" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期">
                <el-date-picker v-model="dateRange" style="width:240px;" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="selectQueryDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:account:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:account:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete" v-hasPermi="['system:account:remove']">删除</el-button>
            </el-col>
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>

        <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="名称" align="center" prop="name" width="120" />
            <el-table-column label="账户" align="center" prop="account" width="160" />
            <el-table-column label="余额" align="center" sortable width="100">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.price | thousandSymbol }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.fundAccountTypeEnum | getAccountType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="账户累计流入" align="center" width="160">
                <template slot-scope="scope">
                    <span style="color:#378DF5">{{ scope.row.totalInflowAmount | thousandSymbol }}</span>
                </template>
            </el-table-column>
            <el-table-column label="账户累计流出" align="center" width="160">
                <template slot-scope="scope">
                    <span style="color:#FF964E">{{ scope.row.totalOutflowAmount | thousandSymbol }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:dict:edit']">修改</el-button> -->
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
                    <el-input v-model="form.name" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="账户" prop="account">
                    <el-input v-model="form.account" placeholder="请输入账户" />
                </el-form-item>
                <el-form-item label="类型" prop="fundAccountTypeEnum">
                    <el-select v-model="form.fundAccountTypeEnum" style="width:100%" placeholder="请选择类型" clearable>
                        <el-option label="银行账户" value="1"></el-option>
                        <el-option label="微信钱包" value="0"></el-option>
                        <el-option label="支付宝账户" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="冻结状态" prop="frozen" v-if="form.id">
                    <el-switch v-model="form.frozen" :active-value="true" :inactive-value="false">
                    </el-switch>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
    name: "Account",
    dicts: ["sys_normal_disable"],
    filters: {
        getAccountType(val) {
            if (val == 'Cash') {
                return "微信钱包";
            }
        }
    },
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
                account: "",
                frozen: "",
                fundAccountTypeEnum: "",
                minCreateDate: "",
                maxCreateDate: ""
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
        // 假数据
        this.tableData = [{
            id: "1",
            name: "沈阳大街xx3",
            account: "6217****0000102210",
            price: 123922,
            fundAccountTypeEnum: "Cash",
            remark: "暂无",
            totalInflowAmount: 1203012,
            totalOutflowAmount: 123980
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
                account: "",
                frozen: false,
                fundAccountTypeEnum: "",
                remark: ""
            };
            this.resetForm("form");
        },
        // 选择查询日期
        selectQueryDate(val) {
            this.params.minCreateDate = val[0];
            this.params.maxCreateDate = val[1];
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
            this.params.minOrderAmount = "";
            this.params.maxOrderAmount = "";
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加账户";
        },
        /** 查看详情按钮操作 */
        handleDetail(row) {
            this.$router.push({
                name: "account-detail"
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
                this.title = "修改账户";
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
