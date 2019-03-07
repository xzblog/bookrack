<template>
  <div :style="{color: color, fontSize: size+'px'}">
    <div class="rate">
      <span @click="handleClick(num)" v-for='num in length' :key="num">☆</span>
      <span class='hollow' :style="{ width: value + 'em' }">
        <span @click="handleClick(num)" v-for='num in length' :key="num">★</span>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'rate',
    props: {
      value: { type: [Number, String], default: 0 },
      length: { type: Number, default: 5 },
      readonly: { type: Boolean, default: false },
      color: { type: String, default: '#ea5a49' },
      size: { type: Number, default: 16 },
    },
    methods: {
      handleClick(i) {
        if (this.readonly) {
          return;
        }
        this.value = i;
        this.$emit('handleClickRate', i);
      },
    },
  };
</script>

<style scoped>
  .rate{
    position:relative;
    display: inline-block;
  }
  .rate > span.hollow {
    position:absolute;
    display: inline-block;
    top:0;
    left:0;
    width:0;
    overflow:hidden;
  }
</style>
