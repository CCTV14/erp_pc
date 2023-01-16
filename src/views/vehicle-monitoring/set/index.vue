<template>
  <div class="app-container home">
    <el-tabs v-model="defaultName" @tab-click="handleTabClick">
      <el-tab-pane label="通用设置" name="first">
        <el-form
          :model="sloganForm"
          ref="form"
          label-width="80px"
          :inline="false"
          size="normal"
        >
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="标语">
                <el-input v-model="sloganForm.value"></el-input>
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
            <el-radio-group
              v-model="orderForm.preCollectOrder.value"
              @change="
                submitOrder(
                  $event,
                  'Order:PreCollectOrder:EditCustomer',
                  'preCollectOrder'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="预付单设置（暂无）" class="mt10">
        </el-descriptions>
        <el-descriptions title="销售单设置" class="mt10">
          <el-descriptions-item label="修改单据客户信息">
            <el-radio-group
              v-model="orderForm.saleOrder.value"
              @change="
                submitOrder($event, 'Order:SaleOrder:EditCustomer', 'saleOrder')
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="销售退货单设置" class="mt10">
          <el-descriptions-item label="修改单据客户信息">
            <el-radio-group
              v-model="orderForm.saleReturnOrder.value"
              @change="
                submitOrder(
                  $event,
                  'Order:SaleReturnOrder:EditCustomer',
                  'saleReturnOrder'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
          <el-descriptions-item label="重新选择业务员">
            <el-radio-group
              v-model="orderForm.saleReturnOrderDir.value"
              @change="
                submitOrder(
                  $event,
                  'Order:SaleReturnOrder:SelectSaleUser',
                  'saleReturnOrderDir'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="采购单设置（暂无）" class="mt10">
        </el-descriptions>
        <el-descriptions title="采购退货单设置" class="mt10">
          <el-descriptions-item label="重新选择业务员">
            <el-radio-group
              v-model="orderForm.purchaseReturnOrderDir.value"
              @change="
                submitOrder(
                  $event,
                  'Order:PurchaseReturnOrder:SelectSaleUser',
                  'purchaseReturnOrderDir'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="出库单设置" class="mt10">
          <el-descriptions-item label="修改单据客户信息">
            <el-radio-group
              v-model="orderForm.commodityOutputOrder.value"
              @change="
                submitOrder(
                  $event,
                  'Order:CommodityOutputOrder:EditCustomer',
                  'commodityOutputOrder'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="入库单设置" class="mt10">
          <el-descriptions-item label="修改单据客户信息">
            <el-radio-group
              v-model="orderForm.commodityInputOrder.value"
              @change="
                submitOrder(
                  $event,
                  'Order:CommodityInputOrder:EditCustomer',
                  'commodityInputOrder'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="收款单设置" class="mt10">
          <el-descriptions-item label="修改单据客户信息">
            <el-radio-group
              v-model="orderForm.fundCollectOrder.value"
              @change="
                submitOrder(
                  $event,
                  'Order:FundCollectOrder:EditCustomer',
                  'fundCollectOrder'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="付款单设置" class="mt10">
          <el-descriptions-item label="修改单据客户信息">
            <el-radio-group
              v-model="orderForm.fundPayOrder.value"
              @change="
                submitOrder(
                  $event,
                  'Order:FundPayOrder:EditCustomer',
                  'fundPayOrder'
                )
              "
            >
              <el-radio label="true">可修改</el-radio>
              <el-radio label="false">不可修改</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="商品设置" name="third">
        <el-form
          :model="commodityForm"
          ref="form"
          label-width="150px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="预警数量">
            <span slot="label">
              <el-tooltip
                content="小于该配置值的商品会出现在预警库存中"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              预警数量
            </span>
            <el-input-number
              v-model="numForm.value"
              :min="1"
              :max="10"
            ></el-input-number>
            <el-button class="ml20" type="primary" @click="onSubmit"
              >保存</el-button
            >
          </el-form-item>
          <el-form-item label="商品页面显示设置">
            <span slot="label">
              <el-tooltip
                content="商品详情页的商品规格展示方式，可选值：清单、横向表格、纵向表格"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              商品规格展示方式
            </span>
            <el-select
              v-model="commodityForm.value"
              placeholder="请选择"
              @change="changeCommodityShow"
            >
              <el-option label="纵向表格" value="TransTable"></el-option>
              <el-option label="横向表格" value="Table"></el-option>
              <el-option label="清单" value="DivList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { findByCode, updateValue } from "@/api/system/set.js";
export default {
  data() {
    return {
      defaultName: "first",
      // 单据设置
      orderForm: {
        preCollectOrder: {
          value: "false",
        },
        saleOrder: {
          value: "false",
        },
        saleReturnOrder: {
          value: "false",
        },
        saleReturnOrderDir: {
          value: "false",
        },
        purchaseReturnOrderDir: {
          value: "false",
        },
        commodityOutputOrder: {
          value: "false",
        },
        commodityInputOrder: {
          value: "false",
        },
        fundCollectOrder: {
          value: "false",
        },
        fundPayOrder: {
          value: "false",
        },
      },
      // 标语表单
      sloganForm: {},
      // 商品设置表单
      commodityForm: {},
      // 商品预警数量表单
      numForm: {},
    };
  },
  mounted() {
    this.getOrderSet();
    this.getIndexTitle();
    this.getCommoditySet();
  },
  methods: {
    // 切换tab事件
    handleTabClick(val) {},
    // 获取首页标语
    getIndexTitle() {
      findByCode("HomePage:Slogan").then((res) => {
        this.sloganForm = res.data;
      });
    },
    // 获取单据设置
    async getOrderSet() {
      let preCollectOrder = await findByCode(
        "Order:PreCollectOrder:EditCustomer"
      );
      let saleOrder = await findByCode("Order:SaleOrder:EditCustomer");
      let saleReturnOrder = await findByCode(
        "Order:SaleReturnOrder:EditCustomer"
      );
      let saleReturnOrderDir = await findByCode(
        "Order:SaleReturnOrder:SelectSaleUser"
      );
      let purchaseReturnOrderDir = await findByCode(
        "Order:PurchaseReturnOrder:SelectSaleUser"
      );
      let commodityOutputOrder = await findByCode(
        "Order:CommodityOutputOrder:EditCustomer"
      );
      let commodityInputOrder = await findByCode(
        "Order:CommodityInputOrder:EditCustomer"
      );
      let fundCollectOrder = await findByCode(
        "Order:FundCollectOrder:EditCustomer"
      );
      let fundPayOrder = await findByCode("Order:FundPayOrder:EditCustomer");
      this.orderForm = {
        preCollectOrder: preCollectOrder.data,
        saleOrder: saleOrder.data,
        saleReturnOrder: saleReturnOrder.data,
        saleReturnOrderDir: saleReturnOrderDir.data,
        purchaseReturnOrderDir: purchaseReturnOrderDir.data,
        commodityOutputOrder: commodityOutputOrder.data,
        commodityInputOrder: commodityInputOrder.data,
        fundCollectOrder: fundCollectOrder.data,
        fundPayOrder: fundPayOrder.data,
      };
    },
    // 获取商品设置
    async getCommoditySet() {
      let num = await findByCode("Commodity:WarningQuantity");
      let type = await findByCode("Commodity:CommodityPageSpecListType");
      if (num.success) {
        this.numForm = num.data;
      }
      if (type.success) {
        this.commodityForm = type.data;
      }
    },
    // 点击保存
    onSubmit() {
      if (this.defaultName == "first") {
        updateValue(this.sloganForm).then((res) => {
          this.$modal.msgSuccess(res.message);
        });
      } else if (this.defaultName == "third") {
        updateValue(this.numForm).then((res) => {
          this.$modal.msgSuccess(res.message);
        });
      }
    },
    // 选择表格展示方式时
    changeCommodityShow(val) {
      updateValue(this.commodityForm).then((res) => {
        this.$modal.msgSuccess(res.message);
      });
    },
    // 选择单据设置的时候
    submitOrder(val, code, form) {
      // 回调val值和传入的code暂时没用到
      updateValue(this.orderForm[form]).then((res) => {
        this.$modal.msgSuccess(res.message);
      });
    },
  },
};
const newLocal = "\u5546\u54c1\u8bbe\u7f6e";
</script>

<style lang="scss" scoped></style>
