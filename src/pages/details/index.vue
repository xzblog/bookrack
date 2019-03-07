<template>
  <div class="container">
    <div class="cover">
      <image :src="details.image" class="img-bg"></image>
      <div class="text">
        <image :src="details.image" class="pic"></image>
        <div class="title">{{details.title}}</div>
        <div class="author">{{details.author}}</div>
      </div>
    </div>
    <div class="info">
      <div class="row">
        <div class="user-info">
          <div class="avatar"><img :src="details.user_info && details.user_info.avatarUrl" alt=""></div>
          <div class="name">{{details.user_info && details.user_info.nickname}}</div>
        </div>
        <div class="rate">
          <span>{{details.average}}分</span>
          <rate :value="Number(details.average/2)"></rate>
        </div>
      </div>
      <div class="row">
        <div class="publisher">出版社：{{details.publisher}}</div>
        <div class="price">价格：{{details.price}}</div>
      </div>
    </div>

    <div class="block summary" :style="{height: show?'auto':'200px'}">
      <h2>本书简介</h2>
      <p v-for="(item, i) of details.summary" :key="i"> {{item}}</p>
      <div class="more" @click="handleClickMore">{{show?'收起更多':'查看更多'}}</div>
    </div>
    <div class="block">
      <h2>标签</h2>
      <span v-for="(tag, i) of details.tags" :key="i" class="tag"> {{tag}}</span>
    </div>
    <div class="block">
      <h2>作者简介</h2>
      {{details.author_intro}}
    </div>
    <div class="block">
      <h2>评论</h2>
      <comment-item :data="comments"></comment-item>
    </div>
    <div class="command" v-if="showComment">
      <textarea cols="30" rows="10" v-model="comment" placeholder="请发表评论"></textarea>
      <div class="bot">
        <div class="row">地理位置：<switch :checked="location" @change="getLocation"/> <span>{{location}}</span></div>
        <div class="row">手机型号：<switch :checked="phone" @change="getPhone"/> <span>{{phone}}</span></div>
      </div>
      <button @click="handleAddComment">提交评论</button>
    </div>
    <div class="block">
      <h2>目录</h2>
      <p v-for="(item, i) of details.catalog" :key="i"> {{item}}</p>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import Rate from '@/components/rate';
import CommentItem from '@/components/commentItem';
import amapFile from '@/libs/amap-wx.js';

const myAmapFun = new amapFile.AMapWX({ key: 'b79288ad6ded61c00b843f13b859c799' });
export default {
  data() {
    return {
      id: '',
      details: {},
      show: false,
      comment: '',
      phone: '',
      location: '',
      comments: [],
    };
  },
  components: {
    Rate,
    CommentItem,
  },
  methods: {
    fetchDetails(id = 1) {
      request({
        url: `/bookDetails?id=${id}`,
        data: this.id || id,
      }).then((res) => {
        this.details = res;
        wx.setNavigationBarTitle({
          title: res.title,
        });
      });
    },
    fetchComments() {
      request({
        url: '/getComments',
        data: {
          bookId: this.id,
        },
      }).then((res) => {
        this.comments = res.list;
      });
    },
    handleClickMore() {
      this.show = !this.show;
    },

    // 获取地理位置
    getLocation(e) {
      if (e.target.value) {
        const self = this;
        myAmapFun.getRegeo({
          success(data) {
            self.location = data[0].regeocodeData.addressComponent.city;
          },
          fail(info) {
            console.log(info);
          },
        });
      } else {
        this.location = '';
      }
    },

    // 获取手机型号
    getPhone(e) {
      if (e.target.value) {
        const res = wx.getSystemInfoSync();
        this.phone = res.model;
      } else {
        this.phone = '';
      }
    },

    // 提交评论
    handleAddComment() {
      const data = {
        bookId: this.id,
        openId: this.userInfo.openId,
        comment: this.comment,
        location: this.location,
        phone: this.phone,
      };
      request({
        url: '/addComment',
        data,
        method: 'post',
      }).then((res) => {
        console.log(res);
        this.comment = '';
        this.fetchComments();
      });
    },
  },
  computed: {
    showComment() {
      if (this.comments.length > 0) {
        return false;
      }
      const flag = this.comments.some((item) => {
        return item.open_id === this.userInfo.openId;
      });

      if (flag) {
        return false;
      }
      return true;
    },
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
    };
  },
  mounted() {
    const { id } = this.$root.$mp.query;
    const userInfo = wx.getStorageSync('userinfo');
    this.id = id;
    this.userInfo = userInfo;
    this.fetchDetails(id);
    this.fetchComments();
  },
};
</script>

<style scoped lang="scss">
  .container{
    background-color: #f6f6f6;
    .cover{
      width: 100%;
      height: 240px;
      overflow: hidden;
      position: relative;
      .img-bg{
        width: 100%;
        filter: blur(15px);
        overflow: hidden;
      }
      .text{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #fff;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 10px;
        .pic{
          width: 120px;
          height: 150px;
        }
        .title{
          font-size: 18px;
          margin: 10px 0;
        }
        .author{
          font-size: 14px;
        }
      }
    }
    .info{
      background-color: #fff;
      font-size: 14px;
      padding: 10px;
      .row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        .user-info{
          display: flex;
          align-items: center;
          .avatar{
            width: 45px;
            height: 45px;
            border-radius: 50%;
            overflow: hidden;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .name{
            margin-left: 10px;
          }
        }
        .rate{
          display: flex;
          align-items: center;
          span{
            margin-right: 5px;
          }
        }
      }
    }
    .block{
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      font-size: 14px;
      color: #555;
      h2{
        color: #222;
        font-weight: normal;
        margin-bottom: 10px;
        font-size: 16px;
      }
      p{
        margin-bottom: 6px;
        line-height: 22px;
      }
    }
    .summary{
      overflow: hidden;
      position: relative;
      .more{
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .tag{
      background-color:antiquewhite;
      margin:0 10px 10px;
      border-radius:3px;
      padding:2px 8px;
      display:inline-block;
      color:#666
    }
    .command{
      font-size: 14px;
      .bot{
        padding: 0 10px;
        background-color: #fff;
        .row{
          padding: 5px 0;
        }
      }
    }
  }

</style>
