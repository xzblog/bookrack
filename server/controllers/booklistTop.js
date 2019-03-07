/*
 * 图书列表前几名
 * @Author: Miracle
 */
const { mysql } = require('../qcloud');

module.exports = async (ctx) => {
  const data = await mysql('books')
    .select('id', 'title', 'image')
    .limit(9)
    .orderBy('count', 'desc');
  ctx.state.data = {
    list: data
  }
};
