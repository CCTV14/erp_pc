<template>
    <div class="app-container home">
        <el-tabs v-model="defaultName" @tab-click="handleTabClick">
            <el-tab-pane label="通用设置" name="first">
                <el-form :model="sloganForm" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
                    <el-row :gutter="20">
                        <el-col :span="8" :offset="0">
                            <el-form-item label="标语">
                                <el-input v-model="sloganForm.newTitle"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!--  -->
            <el-tab-pane label="单据设置" name="second">
                <el-descriptions title="预收单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="预付单设置（暂无）" class="mt10">
                </el-descriptions>
                <el-descriptions title="销售单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="销售单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                    <el-descriptions-item label="重新选择业务员">
                        <el-radio-group v-model="orderForm.SelectSaleUser">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="采购单设置（暂无）" class="mt10">
                </el-descriptions>
                <el-descriptions title="采购退货单设置" class="mt10">
                    <el-descriptions-item label="重新选择业务员">
                        <el-radio-group v-model="orderForm.SelectSaleUser">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="出库单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="入库单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="收款单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="付款单设置" class="mt10">
                    <el-descriptions-item label="修改单据客户信息">
                        <el-radio-group v-model="orderForm.EditCustomer">
                            <el-radio :label="true">可修改</el-radio>
                            <el-radio :label="false">不可修改</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>
                </el-descriptions>
            </el-tab-pane>
            <!--  -->
            <el-tab-pane label="商品设置" name="third">
                <el-form :model="commodityForm" ref="form" :rules="rules" label-width="150px" :inline="false"
                    size="normal">
                    <el-form-item label="预警数量">
                        <span slot="label">
                            <el-tooltip content="小于该配置值的商品会出现在预警库存中" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            预警数量
                        </span>
                        <el-input-number v-model="commodityForm.number" :min="1" :max="10"></el-input-number>
                    </el-form-item>
                    <el-form-item label="商品页面显示设置">
                        <span slot="label">
                            <el-tooltip content="商品详情页的商品规格展示方式，可选值：清单、横向表格、纵向表格" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            权限字符
                        </span>
                        <el-select v-model="commodityForm.type" placeholder="请选择" clearable>
                            <el-option label="纵向表格" value=""></el-option>
                            <el-option label="横向表格" value="0"></el-option>
                            <el-option label="清单" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            defaultName: "first",
            // 单据设置
            orderForm: {
                EditCustomer: false,
                SelectSaleUser: false
            },
            // 标语表单
            sloganForm: {
                newTitle: ""
            },
            // 商品设置表单
            commodityForm: {
                number: 0,
                type: ""
            },
            rules: {

            }
        }
    },
    methods: {
        handleTabClick(val) {
            console.log(val);
        },
        onSubmit() {

        }
    }

}
const newLocal = "\u5546\u54c1\u8bbe\u7f6e";
</script>

<style lang="scss" scoped>
</style>