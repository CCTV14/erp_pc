<template>
  <div class="main">
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="name" label="商品名称" align="center">
      </el-table-column>
      <el-table-column
        prop="commodityCategory.name"
        label="商品分类"
        align="center"
      />
      <el-table-column prop="color" label="颜色" align="center" />
      <el-table-column prop="unit" label="单位" align="center" />
      <el-table-column label="规格" align="center" width="180">
        <template slot-scope="{ row }">
          {{
            row.commoditySpecList
              .map((crr) => {
                return crr.specName;
              })
              .join()
          }}
        </template>
      </el-table-column>
      <el-table-column prop="supplier.name" label="供应商" align="center" />
      <el-table-column prop="imgUrl" label="图片" align="center">
        <template slot-scope="scope">
          <ImagePreview
            height="60px"
            width="65px"
            :src="scope.row.imageNameList[0]"
          />
        </template>
      </el-table-column>
      <el-table-column label="在产状态" align="center">
        <template slot-scope="scope">
          <span
            :class="
              scope.row.productionStatusEnum.Desc == '已停产'
                ? 'text-error'
                : ''
            "
            >{{ scope.row.productionStatusEnum.Desc }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.frozen ? 'text-error' : ''">{{
            scope.row.frozen ? "已冻结" : "未冻结"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建信息" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.creator.name }} {{ row.createTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getInventoryWarningData } from "@/api/vehicle-monitoring/index";
export default {
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      getInventoryWarningData().then((res) => {
        this.tableData = res.data.commodityList;
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
}
</style>
