<template>
  <div class="container">
    <comment-item :data="comments" link></comment-item>
  </div>
</template>

<script>
import request from '@/utils/request';
import CommentItem from '@/components/commentItem';

export default {
  data() {
    return {
      motto: 'Hello World',
      userInfo: {},
      comments: [],
    };
  },
  components: {
    CommentItem,
  },
  methods: {
    fetchComments() {
      request({
        url: '/getComments',
        data: {
          openId: this.userInfo.openId,
        },
      }).then((res) => {
        this.comments = res.list;
        console.log(this.comments);
      });
    },
  },
  onShow() {
    const userInfo = wx.getStorageSync('userinfo');
    this.userInfo = userInfo;
    this.fetchComments();
  },
};
</script>

<style scoped>
.container{
  font-size: 14px;
  padding: 10px;
}
</style>
