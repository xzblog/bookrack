<template>
  <div class="container">
    <div class="carouse">
      <swiper :indicator-dots="true" :autoplay="true" :display-multiple-items="1" indicator-active-color="#8d807c" :circular="true">
        <swiper-item v-for="(item, index) in top9" :key="index">
          <div class="swiper-slide">
            <span v-for="(v, subIndex) in item" :key="subIndex" class="swiper-item">
              <image :src="v.image" mode="aspectFit" :lazy-load="true" class="slide-image"></image>
            </span>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="book-list">
      <div class="item" v-for="item of books" :key="item.id" @click="handleSkip(item.id)">
        <image :src="item.image" mode="aspectFit" :lazy-load="true" class="pic"></image>
        <div class="text">
          <div class="title">{{item.title}}</div>
          <div class="summary">
            {{item.summary}}
          </div>
          <div class="other-info">
            <span>作者: {{item.author}}</span>
            <span>评分: {{item.average}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!more" class="no-more">加载中...</div>
    <div v-else class="no-more">我是有底线的</div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      books: [],
      top9: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],
      rateNum: '',
      more: false,
      listQuery: {
        page: 1,
        size: 10,
      },
    };
  },
  methods: {
    fetchBookList(init) {
      wx.showNavigationBarLoading();
      if (init) {
        this.listQuery.page = 1;
        this.more = false;
      }
      request({
        url: '/booklist',
        data: this.listQuery,
      }).then((res) => {
        // 返回数据不足每页展示大小时表示没有数据了
        if (res.list.length < this.listQuery.size) {
          this.more = true;
        }
        if (init) {
          this.books = res.list;
        } else {
          this.books = this.books.concat(res.list);
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      });
    },
    fetchTop9() {
      request({
        url: '/booklistTop',
      }).then((res) => {
        if (res.list) {
          this.top9 = [res.list.slice(0, 3), res.list.slice(3, 6), res.list.slice(6, 9)];
        }
      });
    },
    handleSkip(id) {
      wx.navigateTo({
        url: `/pages/details/main?id=${id}`,
      });
    },
  },
  onPullDownRefresh() {
    this.fetchBookList(true);
    this.fetchTop9();
  },
  onReachBottom() {
    if (this.more) {
      return;
    }
    this.listQuery.page++;
    this.fetchBookList();
  },

  mounted() {
    this.fetchBookList(true);
    this.fetchTop9();
  },
};
</script>

<style scoped lang="scss">
  .container{
    background-color: #f6f6f6;
    .carouse{
      background-color: #fff;
      margin-bottom: 10px;
      padding-bottom: 10px ;
      .swiper-slide{
        width: 100%;
        height: 100%;
        display: flex;
        .swiper-item{
          width: 33.33%;
          padding: 0 10px;
          height: 100%;
          .slide-image{
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .book-list{
      .item{
        background-color: #fff;
        height: 120px;
        margin-bottom: 1px;
        padding: 10px;
        .pic{
          width: 24%;
          height: 100%;
          box-shadow: 0 3px 5px #eee;
        }
        .text{
          width: 76%;
          display: inline-block;
          vertical-align: top;
          padding-left: 20px;
          box-sizing: border-box;
          .title{
            font-size: 16px;
            color: #222;
            line-height: 30px;
            .rate{
              float: right;
              color: #Ea5a49;
            }
          }
          .summary{
            overflow: hidden;
            text-overflow:ellipsis;//文本溢出显示省略号
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            width: 100%;
            margin: 5px 0 12px;
            line-height: 20px;
            font-size: 13px;
            color: #999;
          }
          .other-info{
            font-size: 12px;
            color: #999;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .no-more{
      height: 50px;
      line-height: 50px;
      background-color: #f6f6f6;
      color: #999;
      text-align: center;
      font-size: 14px;
    }
  }

</style>
