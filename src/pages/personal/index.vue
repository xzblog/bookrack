<template>
  <div class="container">
    <div v-if="!isLogin" class="no-isLogin">
      <open-data type="userAvatarUrl" class="avatar"></open-data>
      <open-data type="userNickName" class="nickname"></open-data>
      <button v-if="!isAuth" open-type="getUserInfo" @getuserinfo="getUserInfo">授权登录</button>
      <button v-else @click="doLogin">登录</button>
    </div>

    <div v-else class="isLogin">
      <year-progress></year-progress>
      <button @click="scanCode" class="primary">添加图书</button>
    </div>
  </div>
</template>

<script>
import qcloud from 'wafer2-client-sdk';
import request from '@/utils/request';
import YearProgress from '@/components/yearProgress';

export default {
  components: { YearProgress },
  data() {
    return {
      isLogin: false,
      isAuth: false,
      userInfo: {},
    };
  },
  methods: {
    // 判断用户是否授权和登录
    getAuthInfo() {
      return new Promise((resolve) => {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，判断是否登录
              const session = qcloud.Session.get();
              console.log(session)
              resolve({
                isAuth: true,
                isLogin: session && Object.keys(session).length > 0,
              });
            }
          },
        });
      });
    },
    // 获取授权信息成功回调，第一次授权可以
    getUserInfo(res) {
      console.log(res);
      if (res.mp.detail.userInfo) {
        this.doLogin();
      }
    },
    // 登录， 必须先授权
    doLogin() {
      const session = qcloud.Session.get()
      if (!session) {
        qcloud.login({
          success: (res) => {
            wx.setStorageSync('userinfo', res)
            this.userInfo = res;
            this.isLogin = true;
          },
          fail: (err) => {
            console.error(err)
            wx.showToast({
              title: '登录失败',
              icon: 'none',
            });
          },
        });
      }
    },

    // 提交图书Id
    postIsnc(isbn) {
      const { openId } = wx.getStorageSync('userinfo');
      request({
        url: '/addBook',
        method: 'post',
        data: {
          isbn,
          openId,
        },
      }).then((res) => {
        console.log(res);
        wx.showModal({
          title: '添加成功',
          content: `${res.title}添加成功`,
          showCancel: false,
        });
      });
    },

    // 扫码添加图书
    scanCode() {
      const self = this;
      wx.scanCode({
        success(res) {
          if (res.result) {
            self.postIsnc(res.result);
          }
        },
      });
    },
  },
  async created() {
    const authInfo = await this.getAuthInfo();
    this.isAuth = authInfo.isAuth;
    this.isLogin = authInfo.isLogin;
  },
};
</script>

<style scoped lang="scss">
.container{
  padding: 0 20rpx;
  .no-isLogin{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 200rpx;
    .avatar{
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      margin-bottom: 10rpx;
      overflow: hidden;
    }
    .nickname{
      margin: 10rpx 0 20rpx;
    }
  }

  .isLogin{
    .primary{
      background-color: #8D807C;
      color: #fff;
      margin-top: 100rpx;
    }
  }

}


</style>
