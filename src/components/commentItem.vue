<template>
  <div class="comments">
    <div v-for="item of data" :key="item.id" class="item" @click="linkTo(item.book_id)">
      <div class="user-info">
        <div class="avatar"><img :src="item.user_info && item.user_info.avatarUrl" alt=""></div>
        <div class="info">
          <div class="name">{{item.user_info && item.user_info.nickname}}</div>
          <div class="time">{{item.create_time}}</div>
        </div>
      </div>
      <div class="comment">{{item.comment}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'comment',
    props: {
      data: { type: Object, default: {} },
      link: { type: Boolean, default: false },
    },
    methods: {
      linkTo(id) {
        wx.navigateTo({
          url: `/pages/details/main?id=${id}`,
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .comments{
    background-color: #fff;
    .item{
      border-bottom: 1px solid #f6f6f6;
      padding: 10px 0;
      .user-info{
        display: flex;
        align-items: center;
        .avatar{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .info{
          margin-left: 10px;
          padding: 0;
          .name{
            margin-bottom: 6px;
          }
        }

      }
      .comment{
        color: #666;
        margin-top: 10px;
      }
    }
  }
</style>
