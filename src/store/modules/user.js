import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
    userInfo: {},
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_USER: (state, userInfo) => {
      state.userInfo = userInfo;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const phoneNumber = userInfo.phoneNumber.trim();
      const password = userInfo.password;
      // const code = userInfo.code; //若依后台定制的，实战不一定要传
      // const uuid = userInfo.uuid  //若依后台定制的，实战不一定要传
      return new Promise((resolve, reject) => {
        login(phoneNumber, password)
          .then((res) => {
            setToken(res.data.authorityToken);
            commit("SET_TOKEN", res.data.authorityToken);
            commit("SET_USER", res.data.userInfo);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            if (!response.data) {
              reject(response.message);
            }
            const res = response.data;
            const user = res.userInfo;
            const avatar =
              user.avatarName == "" || user.avatarName == null
                ? require("@/assets/images/profile.jpg")
                : process.env.VUE_APP_BASE_USER_AVATAR + user.avatarName;
                console.log(avatar);
            // 验证返回的roles是否是一个非空数组
            // 之前这里做过if判断目前暂时删除（如果返回的权限列表长度大于0，就进行下面操作，否则给予默认权限，如下else
            commit("SET_ROLES", res.roles);
            commit("SET_USER", user);
            commit("SET_PERMISSIONS", res.permissions);
            // } else {
            //   commit("SET_ROLES", ["ROLE_DEFAULT"]);
            // }
            commit("SET_NAME", user.name);
            commit("SET_AVATAR", avatar);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        commit("SET_USER", {});
        commit("SET_PERMISSIONS", []);
        removeToken();
        resolve();
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   commit('SET_PERMISSIONS', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    },
  },
};

export default user;
