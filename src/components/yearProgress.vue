<template>
  <div class="progress">
    <progress :percent="percent" color="#8d807c" />
    <p class="title">{{year}}年已经过去{{days}}天了，你要加油！ {{percent}}%</p>
    <p class="desc">
      自己不改变的话， 新的一年也是之前的重演，想去的地方没有去， 想做的事情没有做，
      时间一天天过去，可你还困在原地，迷茫也好，焦虑也好， 不要停留，新的一年不代表新的开始，
      只要下定决心，每一天可以是新的开始！
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    // 判断是否闰年
    isLeapYear() {
      const year = new Date().getFullYear();
      if (year % 400 === 0) {
        return true;
      } else if (year % 4 === 0 && year % 100 !== 0) {
        return true;
      } else {
        return false;
      }
    },
    yearDays() {
      return this.isLeapYear() ? 366 : 365;
    },
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    days() {
      // 设置时间为今年的第一天
      const start = new Date();
      start.setMonth(0);
      start.setDate(1);
      const timestamp = new Date().getTime() - start.getTime();
      return parseInt(timestamp / 1000 / 24 / 60 / 60, 10) + 1;
    },
    percent() {
      return ((this.days * 100) / this.yearDays()).toFixed(1);
    },
  },
};
</script>

<style scoped lang="scss">
.progress {
  padding: 100rpx 0;
  .title{
    font-size: 34rpx;
    margin: 60rpx 0;
  }
  .desc{
    font-size: 14px;
  }
}
</style>
