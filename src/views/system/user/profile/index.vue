<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="userInfo" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />姓名
                <div class="pull-right">{{ userInfo.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号
                <div class="pull-right">{{ userInfo.phoneNumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />邮箱
                <div class="pull-right">{{ userInfo.mailAddress }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />我的权限
                <div class="pull-right">
                  {{
                    permissions && permissions.length > 0
                      ? "共 " + permissions.length + " 个权限组"
                      : "尚未分配权限组"
                  }}
                </div>
              </li>
              <!-- <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li> -->
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ userInfo.createTime }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />冻结账号
                <div class="pull-right">
                  <span :class="userInfo.frozen ? 'text-error' : ''"></span
                  >{{ userInfo.frozen ? "已冻结" : "未冻结" }}
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="userInfo" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="userInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  computed: {
    ...mapGetters(["userInfo","permissions"])
  },
  data() {
    return {
      activeTab: "userinfo",
    };
  }
};
</script>
