/*
 * 图书列表
 * @Author: Miracle
 */
const { mysql } = require('../qcloud');

module.exports = async (ctx) => {
  const {page = 1, size = 10 } = ctx.query;
  const data = await mysql('books')
    .select('id', 'title', 'summary', 'average', 'image', 'author', 'cSessionInfo.user_info')
    .limit(size)
    .offset((page-1) * size)
    .join('cSessionInfo','books.open_id', 'cSessionInfo.open_id' ).orderBy('books.id', 'desc');
  ctx.state.data = {
    list: data.map(item => {
      const userInfo = JSON.parse(item.user_info);
      return Object.assign({},item, {
        user_info: {
          nickname: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      },{
        summary: item.summary.slice(0,60) + '...'
      })
    })
  }
};
